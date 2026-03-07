/** Результат выполнения одного теста в песочнице */
export interface TestResult {
  /** Название теста */
  name: string
  /** Статус выполнения */
  status: 'pass' | 'fail' | 'error'
  /** Ожидаемое значение (если fail) */
  expected?: unknown
  /** Полученное значение (если fail) */
  received?: unknown
  /** Сообщение об ошибке */
  message?: string
  /** Длительность выполнения в мс */
  duration: number
}

/** Запись вывода консоли в песочнице */
export interface ConsoleEntry {
  /** Уровень сообщения */
  level: 'log' | 'warn' | 'error'
  /** Аргументы вызова console */
  args: unknown[]
}
