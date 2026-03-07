import { computed } from 'vue'
import type { BookConfig, SectionMeta, ChapterMeta, SubchapterMeta } from '@book/shared'
import bookConfigData from '../../../../book.config.json'

const config = bookConfigData as BookConfig

export function useBookConfig() {
  const sections = computed(() => config.sections)

  function findSection(sectionId: string): SectionMeta | undefined {
    return config.sections.find(s => s.id === sectionId)
  }

  function findChapter(sectionId: string, chapterId: string): ChapterMeta | undefined {
    return findSection(sectionId)?.chapters.find(c => c.id === chapterId)
  }

  function findSubchapter(
    sectionId: string,
    chapterId: string,
    subchapterId: string,
  ): SubchapterMeta | undefined {
    return findChapter(sectionId, chapterId)?.subchapters.find(s => s.id === subchapterId)
  }

  /** Найти первую главу с контентом для секции */
  function firstChapter(sectionId: string): ChapterMeta | undefined {
    return findSection(sectionId)?.chapters[0]
  }

  /** Найти первую доступную главу во всей книге */
  function firstAvailableChapter(): { sectionId: string; chapter: ChapterMeta } | undefined {
    for (const section of config.sections) {
      if (section.chapters.length > 0) {
        return { sectionId: section.id, chapter: section.chapters[0] }
      }
    }
    return undefined
  }

  return { sections, findSection, findChapter, findSubchapter, firstChapter, firstAvailableChapter }
}
