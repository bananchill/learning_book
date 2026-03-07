import { ref, shallowRef, watch, type Component } from 'vue'

// Динамический импорт всех .md файлов из контента
const contentModules = import.meta.glob<{ default: Component }>('@content/ru/**/*.md')

export function useChapterContent(contentPath: () => string | undefined) {
  const component = shallowRef<Component | null>(null)
  const isLoading = ref(false)
  const error = ref<'not_found' | 'load_error' | null>(null)

  watch(contentPath, async (path) => {
    component.value = null
    error.value = null

    if (!path) {
      isLoading.value = false
      return
    }

    isLoading.value = true

    // Ключ для glob: @content → /content в путях
    const globKey = `@content/${path.replace(/^content\//, '')}`
    // Альтернативный ключ с полным путём
    const altKey = `/${path}`

    const loader = contentModules[globKey] ?? contentModules[altKey]

    if (!loader) {
      error.value = 'not_found'
      isLoading.value = false
      return
    }

    try {
      const mod = await loader()
      component.value = mod.default
    } catch {
      error.value = 'load_error'
    } finally {
      isLoading.value = false
    }
  }, { immediate: true })

  return { component, isLoading, error }
}
