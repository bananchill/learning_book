/** Сериализуемое значение в песочнице */
export type SerializableValue = string | number | boolean | null | object

/** Результат выполнения одного теста в песочнице */
export interface TestResult {
  /** Название теста */
  name: string
  /** Статус выполнения */
  status: 'pass' | 'fail' | 'error'
  /** Ожидаемое значение (если fail) */
  expected?: SerializableValue
  /** Полученное значение (если fail) */
  received?: SerializableValue
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
  args: SerializableValue[]
}
