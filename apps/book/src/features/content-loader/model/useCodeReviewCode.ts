import { ref, watch } from 'vue'
import { normalizeContentPath } from '@book/shared'

// Загружаем все .js файлы из code-review/ как raw-текст
const jsModules = import.meta.glob<string>(
  '../../../../../../content/ru/**/code-review/*.js',
  { query: '?raw', import: 'default' },
)

const jsMap = new Map<string, () => Promise<string>>()
for (const [key, loader] of Object.entries(jsModules)) {
  const match = key.match(/ru\/(.+)$/)
  if (match) {
    jsMap.set(match[1], loader)
  }
}

/**
 * Загружает код для code-review задания.
 */
export function useCodeReviewCode(
  contentPath: () => string | undefined,
  codeFile: () => string | undefined,
) {
  const code = ref('')
  const isLoading = ref(false)

  watch(
    [contentPath, codeFile],
    async ([basePath, file]) => {
      code.value = ''

      if (!basePath || !file) {
        isLoading.value = false
        return
      }

      isLoading.value = true

      const prefix = normalizeContentPath(basePath)
      const loader = jsMap.get(`${prefix}/code-review/${file}`)

      if (loader) {
        try {
          code.value = await loader()
        } catch {
          // Файл не найден
        }
      }

      isLoading.value = false
    },
    { immediate: true },
  )

  return { code, isLoading }
}
