import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBookConfig } from './useBookConfig'

export interface Breadcrumb {
  label: string
  to?: string
}

export function useBreadcrumbs() {
  const route = useRoute()
  const { findSection, findSubsection, findChapter, findSubchapter, findChapterGroup } =
    useBookConfig()

  const breadcrumbs = computed(() => {
    const crumbs: Breadcrumb[] = []
    const sectionId = route.params.section as string | undefined
    const subsectionId = route.params.subsection as string | undefined
    const chapterId = route.params.chapter as string | undefined
    const subchapterId = route.params.subchapter as string | undefined

    if (sectionId) {
      const section = findSection(sectionId)
      if (section) {
        crumbs.push({ label: section.title })
      }
    }

    if (sectionId && subsectionId) {
      const subsection = findSubsection(sectionId, subsectionId)
      if (subsection) {
        crumbs.push({ label: subsection.title })
      }
    }

    if (sectionId && subsectionId && chapterId) {
      const group = findChapterGroup(sectionId, subsectionId, chapterId)
      if (group) {
        crumbs.push({ label: group.title })
      }

      const chapter = findChapter(sectionId, subsectionId, chapterId)
      if (chapter) {
        crumbs.push({
          label: chapter.title,
          to: `/${sectionId}/${subsectionId}/${chapterId}`,
        })
      }
    }

    if (sectionId && subsectionId && chapterId && subchapterId) {
      const sub = findSubchapter(sectionId, subsectionId, chapterId, subchapterId)
      if (sub) {
        crumbs.push({ label: sub.title })
      }
    }

    return crumbs
  })

  return { breadcrumbs }
}
