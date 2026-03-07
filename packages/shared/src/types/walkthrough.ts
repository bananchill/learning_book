/** Шаг пошагового разбора кода */
export interface WalkthroughStep {
  /** Номер строки, которая выполняется */
  line: number
  /** Объяснение, что происходит на этом шаге */
  description: string
  /** Текущие значения переменных */
  variables: Record<string, string>
  /** Текущий стек вызовов */
  callStack: string[]
  /** Что подсветить в визуализации (опционально) */
  highlight?: string
}

/** Пошаговый разбор кода (debugger-like) */
export interface Walkthrough {
  /** Название разбора */
  title: string
  /** Исходный код для разбора */
  code: string
  /** Шаги выполнения */
  steps: WalkthroughStep[]
}
