/** Вопрос квиза */
export interface QuizQuestion {
  /** Уникальный идентификатор */
  id: string
  /** Текст вопроса */
  question: string
  /** Тип вопроса */
  type: 'multiple-choice' | 'true-false' | 'code-output'
  /** Варианты ответов (для multiple-choice и code-output) */
  options?: string[]
  /** Правильный ответ (индекс или текст) */
  correctAnswer: string | number
  /** Объяснение правильного ответа */
  explanation: string
}

/** Квиз главы */
export interface Quiz {
  /** Идентификатор главы */
  chapter: string
  /** Список вопросов */
  questions: QuizQuestion[]
}
