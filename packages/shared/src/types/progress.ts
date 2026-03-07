/** Прогресс пользователя по одной главе */
export interface ChapterProgress {
  /** Идентификатор главы */
  chapterId: string
  /** Прогресс чтения подглав */
  reading: { completed: string[]; total: number }
  /** Прогресс выполнения заданий */
  tasks: { completed: string[]; total: number }
  /** Результат квиза */
  quiz: { score: number; total: number; passed: boolean }
  /** Просмотренные вопросы для собеседования */
  interview: { reviewed: string[]; total: number }
  /** Пройден ли пошаговый разбор */
  walkthrough: { completed: boolean }
  /** Дата последней активности (ISO) */
  lastActivity: string
}

/** Общий прогресс по всей книге */
export interface BookProgress {
  /** Прогресс по каждой главе */
  chapters: Record<string, ChapterProgress>
  /** Серия дней обучения подряд */
  streak: { current: number; lastDate: string }
  /** Общий процент завершения книги */
  totalCompletion: number
}
