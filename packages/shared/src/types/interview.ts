/** Самооценка ответа на вопрос собеседования */
export type SelfAssessment = 'good' | 'ok' | 'bad'

/** Вопрос для подготовки к собеседованию */
export interface InterviewQuestion {
  /** Уникальный идентификатор */
  id: string
  /** Текст вопроса */
  question: string
  /** Уровень: junior / middle / senior */
  level: 'junior' | 'middle' | 'senior'
  /** Хороший ответ */
  goodAnswer: string
  /** Что интервьюер хочет услышать */
  whatInterviewerWants: string
  /** Типичные ошибки кандидатов */
  commonMistakes: string[]
  /** Дополнительные вопросы */
  followUps: string[]
}

/** Блок вопросов для собеседования по главе */
export interface Interview {
  /** Идентификатор главы */
  chapter: string
  /** Список вопросов */
  questions: InterviewQuestion[]
}
