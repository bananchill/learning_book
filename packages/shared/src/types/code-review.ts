/** Проблема в коде для задания code review */
export interface CodeReviewIssue {
  /** Номер строки с проблемой */
  line: number
  /** Тип проблемы */
  type: 'bug' | 'memory_leak' | 'best_practice' | 'performance'
  /** Описание проблемы */
  description: string
  /** Как исправить */
  fix: string
}

/** Задание на code review */
export interface CodeReview {
  /** Уникальный идентификатор */
  id: string
  /** Название задания */
  title: string
  /** Путь к файлу с плохим кодом */
  codeFile: string
  /** Список проблем в коде */
  issues: CodeReviewIssue[]
}
