import { ref, shallowRef, watch, type Component } from 'vue'
import { useI18n } from '@book/i18n'
import { normalizeContentPath } from '@book/shared'

const contentModules = import.meta.glob(['@content/**/*.md', '@content/**/*.mdx'], {
  eager: true
})

const moduleMap = new Map<string, { default: Component }>()

const buildModuleMap = (locale: string) => {
  for (const [key, loader] of Object.entries(contentModules)) {
    const match = key.match(`${locale}\\/(.+)$`)
    if (match) {
      // Нормализуем ключ: убираем расширение .md/.mdx
      const normalizedKey = match[1].replace(/\.mdx?$/, '')
      moduleMap.set(normalizedKey, loader as { default: Component })
    }
  }
}

export function useChapterContent(contentPath: () => string | undefined) {
  const i18n = useI18n()
  const locale = i18n.locale.value
  const component = shallowRef<Component | null>(null)
  const isLoading = ref(false)
  const error = ref<'not_found' | 'load_error' | null>(null)
  buildModuleMap(locale)

  watch(
    contentPath,
    async (path) => {
      component.value = null
      error.value = null

      if (!path) {
        isLoading.value = false
        return
      }

      isLoading.value = true

      const normalizedPath = normalizeContentPath(path, locale).replace(/\.mdx?$/, '')

      const loader = moduleMap.get(normalizedPath)

      if (!loader) {
        error.value = 'not_found'
        isLoading.value = false
        return
      }

      try {
        component.value = loader.default
      } catch {
        error.value = 'load_error'
      } finally {
        isLoading.value = false
      }
    },
    { immediate: true }
  )

  return { component, isLoading, error }
}