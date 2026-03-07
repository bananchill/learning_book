// Web Worker для изолированного выполнения пользовательского кода и тестов

import { runTests, type TestResult } from './testAdapter'

interface ConsoleEntry {
  level: 'log' | 'warn' | 'error'
  args: unknown[]
}

interface RunMessage {
  type: 'run'
  code: string
  testCode: string
}

interface ResultMessage {
  type: 'result'
  testResults: TestResult[]
  consoleLogs: ConsoleEntry[]
  error?: string
}

const TIMEOUT_MS = 5000

// Перехват console
const consoleLogs: ConsoleEntry[] = []
const originalConsole = {
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
}

function interceptConsole() {
  consoleLogs.length = 0
  console.log = (...args: unknown[]) => {
    consoleLogs.push({ level: 'log', args: args.map(serializeArg) })
  }
  console.warn = (...args: unknown[]) => {
    consoleLogs.push({ level: 'warn', args: args.map(serializeArg) })
  }
  console.error = (...args: unknown[]) => {
    consoleLogs.push({ level: 'error', args: args.map(serializeArg) })
  }
}

function restoreConsole() {
  console.log = originalConsole.log
  console.warn = originalConsole.warn
  console.error = originalConsole.error
}

// Сериализация аргументов для передачи через postMessage
function serializeArg(arg: unknown): unknown {
  if (arg === undefined) return 'undefined'
  if (arg === null) return null
  if (typeof arg === 'function') return `[Function: ${arg.name || 'anonymous'}]`
  if (typeof arg === 'symbol') return arg.toString()
  if (typeof arg === 'object') {
    try {
      return JSON.parse(JSON.stringify(arg))
    } catch {
      return String(arg)
    }
  }
  return arg
}

// Выполнение пользовательского кода и сбор экспортов
function executeUserCode(code: string): Record<string, unknown> {
  // Оборачиваем код: всё, что объявлено через function/const/let/var, собираем в объект
  // Используем обёртку с module-like паттерном
  const wrappedCode = `
    'use strict';
    ${code}
    ;
    // Собираем все объявления в объект
    const __exports = {};
    try {
      ${extractExportNames(code).map((name) => `if (typeof ${name} !== 'undefined') __exports['${name}'] = ${name};`).join('\n      ')}
    } catch(e) {}
    return __exports;
  `

  const fn = new Function(wrappedCode)
  return fn() as Record<string, unknown>
}

// Извлечение имён функций и переменных из кода
function extractExportNames(code: string): string[] {
  const names: string[] = []
  const patterns = [
    /(?:^|\n)\s*function\s+(\w+)/g,
    /(?:^|\n)\s*(?:const|let|var)\s+(\w+)/g,
    /(?:^|\n)\s*class\s+(\w+)/g,
  ]
  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(code)) !== null) {
      if (match[1] && !names.includes(match[1])) {
        names.push(match[1])
      }
    }
  }
  return names
}

// Обработка входящих сообщений
self.onmessage = (event: MessageEvent<RunMessage>) => {
  if (event.data.type !== 'run') return

  const { code, testCode } = event.data
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  // Таймаут
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error('TIMEOUT'))
    }, TIMEOUT_MS)
  })

  const runPromise = new Promise<ResultMessage>((resolve) => {
    interceptConsole()

    try {
      // Выполняем пользовательский код
      const userExports = executeUserCode(code)

      // Выполняем тесты, если есть
      let testResults: TestResult[] = []
      if (testCode.trim()) {
        testResults = runTests(testCode, userExports)
      }

      restoreConsole()

      resolve({
        type: 'result',
        testResults,
        consoleLogs: [...consoleLogs],
      })
    } catch (err) {
      restoreConsole()

      const message = err instanceof Error ? err.message : String(err)
      const isSyntax = err instanceof SyntaxError

      resolve({
        type: 'result',
        testResults: [],
        consoleLogs: [...consoleLogs],
        error: isSyntax ? `Синтаксическая ошибка: ${message}` : `Ошибка выполнения: ${message}`,
      })
    }
  })

  Promise.race([runPromise, timeoutPromise])
    .then((result) => {
      if (timeoutId) clearTimeout(timeoutId)
      self.postMessage(result)
    })
    .catch((err) => {
      if (timeoutId) clearTimeout(timeoutId)
      restoreConsole()

      const isTimeout = err instanceof Error && err.message === 'TIMEOUT'
      self.postMessage({
        type: 'result',
        testResults: [],
        consoleLogs: [...consoleLogs],
        error: isTimeout
          ? 'Превышено время выполнения (5 сек). Возможно, бесконечный цикл.'
          : `Ошибка: ${err instanceof Error ? err.message : String(err)}`,
      } satisfies ResultMessage)
    })
}
