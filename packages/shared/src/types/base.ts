/** Уровень сложности задания или вопроса */
export type Difficulty = 'easy' | 'medium' | 'hard'

/** Глава книги */
export interface Chapter {
  /** Уникальный идентификатор (e.g., ch01-closures) */
  id: string
  /** Название главы */
  title: string
  /** Краткое описание */
  description: string
  /** Секция, к которой относится глава */
  section: string
  /** Порядковый номер */
  order: number
}

/** Секция книги (группа глав) */
export interface Section {
  /** Уникальный идентификатор секции */
  id: string
  /** Название секции */
  title: string
  /** Список глав в секции */
  chapters: Chapter[]
}
