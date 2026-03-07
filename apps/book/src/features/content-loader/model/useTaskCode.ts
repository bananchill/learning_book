import { ref, watch } from 'vue'

// Загружаем все .js файлы из контента как raw-текст
const jsModules = import.meta.glob<string>(
  '../../../../../../content/ru/**/tasks/*.js',
  { query: '?raw', import: 'default' },
)

// Нормализуем пути: убираем префикс до ru/
const jsMap = new Map<string, () => Promise<string>>()
for (const [key, loader] of Object.entries(jsModules)) {
  const match = key.match(/ru\/(.+)$/)
  if (match) {
    jsMap.set(match[1], loader)
  }
}

/**
 * Убирает import-строки из тест-файла.
 * Sandbox worker сам предоставляет describe, it, expect и пользовательские экспорты.
 */
function stripImports(code: string): string {
  return code
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('import '))
    .join('\n')
    .trim()
}

/**
 * Убирает export из starter-кода.
 * Sandbox worker сам извлекает объявления через regex.
 */
function stripExports(code: string): string {
  return code.replace(/^export\s+/gm, '')
}

/**
 * Загружает starter-код и тест-код задачи из content/.
 */
export function useTaskCode(
  contentPath: () => string | undefined,
  taskFile: () => string | undefined,
  testFile: () => string | undefined,
) {
  const starterCode = ref('')
  const testCode = ref('')
  const isLoading = ref(false)

  watch(
    [contentPath, taskFile, testFile],
    async ([basePath, file, test]) => {
      starterCode.value = ''
      testCode.value = ''

      if (!basePath || !file || !test) {
        isLoading.value = false
        return
      }

      isLoading.value = true

      // "content/ru/ch01-closures" → "ch01-closures"
      const prefix = basePath.replace(/^content\/ru\//, '')

      const starterLoader = jsMap.get(`${prefix}/tasks/${file}`)
      const testLoader = jsMap.get(`${prefix}/tasks/${test}`)

      const [starterResult, testResult] = await Promise.allSettled([
        starterLoader?.(),
        testLoader?.(),
      ])

      if (starterResult.status === 'fulfilled' && starterResult.value) {
        starterCode.value = stripExports(starterResult.value)
      }
      if (testResult.status === 'fulfilled' && testResult.value) {
        testCode.value = stripImports(testResult.value)
      }

      isLoading.value = false
    },
    { immediate: true },
  )

  return { starterCode, testCode, isLoading }
}
