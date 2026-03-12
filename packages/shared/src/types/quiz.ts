import type { Difficulty } from './base'

/** Вопрос квиза */
export interface QuizQuestion {
  /** Уникальный идентификатор */
  id: string
  /** Текст вопроса */
  question: string
  /** Тип вопроса */
  type: 'multiple-choice' | 'true-false' | 'code-output'
  /** Варианты ответов */
  options: string[]
  /** Правильный ответ (индекс или текст) */
  correctAnswer: string | number
  /** Объяснение правильного ответа */
  explanation: string
  /** Блок кода (для code-output вопросов) */
  code?: string
  /** Уровень сложности */
  difficulty?: Difficulty
}

/** Квиз главы */
export interface Quiz {
  /** Идентификатор главы */
  chapter: string
  /** Список вопросов */
  questions: QuizQuestion[]
}

/** Ответ пользователя на вопрос квиза */
export interface QuizAnswer {
  questionId: string
  answer: number | number[] | boolean
  correct: boolean
}

/** Результат квиза */
export interface QuizScore {
  total: number
  correct: number
  percentage: number
}
