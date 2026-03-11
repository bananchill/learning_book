import { computed } from 'vue'
import type {
  BookConfig,
  SectionMeta,
  SubsectionMeta,
  ChapterGroupMeta,
  ChapterMeta,
  SubchapterMeta,
} from '@book/shared'
import bookConfigData from '../../../../book.config.json'

const config = bookConfigData as BookConfig

export function useBookConfig() {
  const sections = computed(() => config.sections)

  function findSection(sectionId: string): SectionMeta | undefined {
    return config.sections.find(s => s.id === sectionId)
  }

  function findSubsection(
    sectionId: string,
    subsectionId: string,
  ): SubsectionMeta | undefined {
    return findSection(sectionId)?.subsections.find(s => s.id === subsectionId)
  }

  function findChapter(
    sectionId: string,
    subsectionId: string,
    chapterId: string,
  ): ChapterMeta | undefined {
    const sub = findSubsection(sectionId, subsectionId)
    if (!sub) return undefined
    for (const group of sub.groups) {
      const chapter = group.chapters.find((c: ChapterMeta) => c.id === chapterId)
      if (chapter) return chapter
    }
    return undefined
  }

  function findSubchapter(
    sectionId: string,
    subsectionId: string,
    chapterId: string,
    subchapterId: string,
  ): SubchapterMeta | undefined {
    return findChapter(sectionId, subsectionId, chapterId)?.subchapters.find(
      s => s.id === subchapterId,
    )
  }

  /** Найти группу, к которой принадлежит глава */
  function findChapterGroup(sectionId: string, subsectionId: string, chapterId: string) {
    const sub = findSubsection(sectionId, subsectionId)
    if (!sub) return undefined
    return sub.groups.find((g: ChapterGroupMeta) =>
      g.chapters.some((c: ChapterMeta) => c.id === chapterId),
    )
  }

  /** Найти первую главу с контентом для секции */
  function firstChapter(sectionId: string): {
    subsectionId: string
    chapter: ChapterMeta
  } | undefined {
    const section = findSection(sectionId)
    if (!section) return undefined
    for (const sub of section.subsections) {
      for (const group of sub.groups) {
        if (group.chapters.length > 0) {
          return { subsectionId: sub.id, chapter: group.chapters[0] }
        }
      }
    }
    return undefined
  }

  /** Найти первую доступную главу во всей книге */
  function firstAvailableChapter(): {
    sectionId: string
    subsectionId: string
    chapter: ChapterMeta
  } | undefined {
    for (const section of config.sections) {
      for (const sub of section.subsections) {
        for (const group of sub.groups) {
          if (group.chapters.length > 0) {
            return {
              sectionId: section.id,
              subsectionId: sub.id,
              chapter: group.chapters[0],
            }
          }
        }
      }
    }
    return undefined
  }

  /** Плоский список всех глав секции */
  function allChaptersFlat(sectionId: string): ChapterMeta[] {
    const section = findSection(sectionId)
    if (!section) return []
    const result: ChapterMeta[] = []
    for (const sub of section.subsections) {
      for (const group of sub.groups) {
        result.push(...group.chapters)
      }
    }
    return result
  }

  return {
    sections,
    findSection,
    findSubsection,
    findChapter,
    findSubchapter,
    findChapterGroup,
    firstChapter,
    firstAvailableChapter,
    allChaptersFlat,
  }
}
