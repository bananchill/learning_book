import type { TestResult, ConsoleEntry } from '@book/shared'

/** Пропсы основного компонента CodeSandbox */
export interface CodeSandboxProps {
  starterCode?: string
  testCode?: string
  language?: 'javascript' | 'typescript' | 'sql' | 'yaml'
  autoRun?: boolean
  debounceMs?: number
  readOnly?: boolean
  height?: string
  showConsole?: boolean
  /** Ключ для localStorage-персистенции (например, task id) */
  persistenceKey?: string
}

/** События CodeSandbox */
export interface CodeSandboxEmits {
  'code-change': [code: string]
  'test-results': [results: TestResult[]]
}

/** Внутреннее состояние песочницы */
export interface SandboxState {
  code: string
  isRunning: boolean
  error: string | null
  testResults: TestResult[]
  consoleLogs: ConsoleEntry[]
}

/** Опции для useCodeHistory */
export interface CodeHistoryOptions {
  /** Максимальное количество записей в стеке */
  maxStackSize?: number
}
