import { ref, shallowRef, watch, type Component } from 'vue'

// Динамический импорт всех .md файлов из контента (относительный путь)
const contentModules = import.meta.glob<{ default: Component }>('../../../../content/ru/**/*.md')

// Построить маппинг: нормализованный путь → загрузчик
const moduleMap = new Map<string, () => Promise<{ default: Component }>>()
for (const [key, loader] of Object.entries(contentModules)) {
  // Ключи: "../../../../content/ru/ch01-closures/index.md"
  // Извлекаем часть после "ru/"
  const match = key.match(/ru\/(.+)$/)
  if (match) {
    moduleMap.set(match[1], loader)
  }
}

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

    // Нормализуем путь: "content/ru/ch01-closures/index.md" → "ch01-closures/index.md"
    const normalizedPath = path.replace(/^content\/ru\//, '')

    const loader = moduleMap.get(normalizedPath)

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
