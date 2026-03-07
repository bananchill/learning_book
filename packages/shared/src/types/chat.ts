/** Контекст главы для AI-чата */
export interface ChapterContext {
  /** Идентификатор главы */
  chapterId: string
  /** Заголовок главы */
  title: string
  /** Тема главы */
  topic: string
  /** Текущий подраздел */
  subchapter?: string
  /** Ключевые концепции главы */
  keyConcepts: string[]
  /** Частые ошибки по теме */
  commonMistakes: string[]
}

/** Сообщение в AI-чате */
export interface ChatMessage {
  /** Уникальный идентификатор */
  id: string
  /** Роль отправителя */
  role: 'user' | 'assistant'
  /** Текст сообщения */
  content: string
  /** Временная метка */
  timestamp: number
}
