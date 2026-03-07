import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookConfig } from './useBookConfig'

export interface Breadcrumb {
  label: string
  to?: string
}

export function useBreadcrumbs() {
  const route = useRoute()
  const { findSection, findChapter, findSubchapter } = useBookConfig()

  const breadcrumbs = computed(() => {
    const crumbs: Breadcrumb[] = []
    const sectionId = route.params.section as string | undefined
    const chapterId = route.params.chapter as string | undefined
    const subchapterId = route.params.subchapter as string | undefined

    if (sectionId) {
      const section = findSection(sectionId)
      if (section) {
        crumbs.push({ label: section.title })
      }
    }

    if (sectionId && chapterId) {
      const chapter = findChapter(sectionId, chapterId)
      if (chapter) {
        crumbs.push({ label: chapter.title, to: `/${sectionId}/${chapterId}` })
      }
    }

    if (sectionId && chapterId && subchapterId) {
      const sub = findSubchapter(sectionId, chapterId, subchapterId)
      if (sub) {
        crumbs.push({ label: sub.title })
      }
    }

    return crumbs
  })

  return { breadcrumbs }
}
