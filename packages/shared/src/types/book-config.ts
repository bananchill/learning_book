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

/** Группа глав по уровню сложности */
export interface ChapterGroupMeta {
  id: string
  title: string
  order: number
  chapters: ChapterMeta[]
}

/** Подсекция (JS, TS, React...) */
export interface SubsectionMeta {
  id: string
  title: string
  icon?: string
  order: number
  groups: ChapterGroupMeta[]
}

/** Метаданные секции — содержит subsections */
export interface SectionMeta {
  id: string
  title: string
  icon: string
  order: number
  subsections: SubsectionMeta[]
}

/** Конфигурация книги */
export interface BookConfig {
  sections: SectionMeta[]
}
