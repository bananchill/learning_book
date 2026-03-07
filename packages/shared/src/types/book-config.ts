/** Метаданные подглавы */
export interface SubchapterMeta {
  id: string
  title: string
  order: number
}

/** Метаданные главы в конфиге книги */
export interface ChapterMeta {
  id: string
  title: string
  description: string
  order: number
  contentPath: string
  subchapters: SubchapterMeta[]
}

/** Метаданные секции */
export interface SectionMeta {
  id: string
  title: string
  icon: string
  order: number
  chapters: ChapterMeta[]
}

/** Конфигурация книги */
export interface BookConfig {
  sections: SectionMeta[]
}
