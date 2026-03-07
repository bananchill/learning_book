/** Результат выполнения одного теста в песочнице */
export interface TestResult {
  /** Название теста */
  name: string
  /** Статус выполнения */
  status: 'passed' | 'failed' | 'pending'
  /** Сообщение об ошибке (если failed) */
  error?: string
  /** Ожидаемое значение (если failed) */
  expected?: string
  /** Полученное значение (если failed) */
  received?: string
}
