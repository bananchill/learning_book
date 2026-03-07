// Минимальный vitest-совместимый рантайм для выполнения тестов в Web Worker

export interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'error'
  expected?: unknown
  received?: unknown
  message?: string
  duration: number
}

// Глубокое сравнение значений
function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a === null || b === null) return false
  if (typeof a !== typeof b) return false

  if (typeof a === 'object') {
    const aObj = a as Record<string, unknown>
    const bObj = b as Record<string, unknown>

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false
      return a.every((item, i) => deepEqual(item, b[i]))
    }

    if (Array.isArray(a) !== Array.isArray(b)) return false

    const aKeys = Object.keys(aObj)
    const bKeys = Object.keys(bObj)
    if (aKeys.length !== bKeys.length) return false

    return aKeys.every((key) => deepEqual(aObj[key], bObj[key]))
  }

  return false
}

// Форматирование значения для отображения
function formatValue(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

// Expect — цепочка матчеров
function createExpect(received: unknown) {
  const matchers = {
    toBe(expected: unknown) {
      if (received !== expected) {
        throw { expected, received, message: `Ожидалось ${formatValue(expected)}, получено ${formatValue(received)}` }
      }
    },
    toEqual(expected: unknown) {
      if (!deepEqual(received, expected)) {
        throw { expected, received, message: `Ожидалось ${formatValue(expected)}, получено ${formatValue(received)}` }
      }
    },
    toBeTruthy() {
      if (!received) {
        throw { expected: 'truthy', received, message: `Ожидалось truthy, получено ${formatValue(received)}` }
      }
    },
    toBeFalsy() {
      if (received) {
        throw { expected: 'falsy', received, message: `Ожидалось falsy, получено ${formatValue(received)}` }
      }
    },
    toBeDefined() {
      if (received === undefined) {
        throw { expected: 'defined', received, message: 'Ожидалось определённое значение, получено undefined' }
      }
    },
    toBeUndefined() {
      if (received !== undefined) {
        throw { expected: 'undefined', received, message: `Ожидалось undefined, получено ${formatValue(received)}` }
      }
    },
    toBeNull() {
      if (received !== null) {
        throw { expected: null, received, message: `Ожидалось null, получено ${formatValue(received)}` }
      }
    },
    toContain(item: unknown) {
      if (typeof received === 'string') {
        if (!received.includes(item as string)) {
          throw { expected: item, received, message: `Строка не содержит ${formatValue(item)}` }
        }
      } else if (Array.isArray(received)) {
        if (!received.includes(item)) {
          throw { expected: item, received, message: `Массив не содержит ${formatValue(item)}` }
        }
      } else {
        throw { expected: item, received, message: 'toContain работает только с массивами и строками' }
      }
    },
    toHaveLength(expected: number) {
      const len = (received as { length?: number })?.length
      if (len !== expected) {
        throw { expected, received: len, message: `Ожидалась длина ${expected}, получена ${len}` }
      }
    },
    toThrow(expectedMessage?: string | RegExp) {
      if (typeof received !== 'function') {
        throw { message: 'toThrow можно использовать только с функциями' }
      }
      try {
        ;(received as () => void)()
        throw { expected: 'ошибка', received: 'функция не выбросила ошибку', message: 'Ожидалась ошибка, но функция выполнилась успешно' }
      } catch (e) {
        // Если это наш throw — пробрасываем дальше
        if (e && typeof e === 'object' && 'expected' in e && 'received' in e) {
          // Проверяем, это наш assertion error или ошибка пользовательского кода
          if ((e as { received: unknown }).received === 'функция не выбросила ошибку') throw e
        }
        if (expectedMessage) {
          const msg = e instanceof Error ? e.message : String(e)
          if (typeof expectedMessage === 'string' && !msg.includes(expectedMessage)) {
            throw { expected: expectedMessage, received: msg, message: `Ожидалась ошибка "${expectedMessage}", получена "${msg}"` }
          }
          if (expectedMessage instanceof RegExp && !expectedMessage.test(msg)) {
            throw { expected: expectedMessage.toString(), received: msg, message: `Ошибка не соответствует ${expectedMessage}` }
          }
        }
      }
    },
  }

  return matchers
}

// Запуск набора тестов
export function runTests(testCode: string, userExports: Record<string, unknown>): TestResult[] {
  const results: TestResult[] = []
  let currentDescribe = ''

  function describe(name: string, fn: () => void) {
    const prev = currentDescribe
    currentDescribe = currentDescribe ? `${currentDescribe} > ${name}` : name
    fn()
    currentDescribe = prev
  }

  function it(name: string, fn: () => void) {
    const fullName = currentDescribe ? `${currentDescribe} > ${name}` : name
    const start = performance.now()
    try {
      fn()
      results.push({
        name: fullName,
        status: 'pass',
        duration: Math.round(performance.now() - start),
      })
    } catch (err) {
      const duration = Math.round(performance.now() - start)
      if (err && typeof err === 'object' && 'message' in err) {
        results.push({
          name: fullName,
          status: 'fail',
          expected: (err as { expected?: unknown }).expected,
          received: (err as { received?: unknown }).received,
          message: (err as { message: string }).message,
          duration,
        })
      } else {
        results.push({
          name: fullName,
          status: 'error',
          message: String(err),
          duration,
        })
      }
    }
  }

  // Выполняем тесты, делая функции доступными
  const testFn = new Function(
    'describe',
    'it',
    'test',
    'expect',
    // Передаём экспорты пользовательского кода как переменные
    ...Object.keys(userExports),
    testCode,
  )

  testFn(
    describe,
    it,
    it, // test — алиас для it
    createExpect,
    ...Object.values(userExports),
  )

  return results
}
