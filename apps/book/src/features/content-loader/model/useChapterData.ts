import { ref, watch } from 'vue'
import type { Quiz, Task, Walkthrough, Interview } from '@book/shared'
import { normalizeContentPath } from '@book/shared'

// Динамический импорт .json файлов из контента
const jsonModules = import.meta.glob<Record<string, unknown>>('../../../../../../content/ru/**/*.json')

// Построить маппинг: нормализованный путь → загрузчик
const jsonMap = new Map<string, () => Promise<Record<string, unknown>>>()
for (const [key, loader] of Object.entries(jsonModules)) {
  const match = key.match(/ru\/(.+)$/)
  if (match) {
    jsonMap.set(match[1], loader)
  }
}

export function useChapterData(contentPath: () => string | undefined) {
  const quiz = ref<Quiz | null>(null)
  const tasks = ref<Task[]>([])
  const walkthrough = ref<Walkthrough | null>(null)
  const interview = ref<Interview | null>(null)
  const isLoading = ref(false)

  watch(contentPath, async (basePath) => {
    quiz.value = null
    tasks.value = []
    walkthrough.value = null
    interview.value = null

    if (!basePath) {
      isLoading.value = false
      return
    }

    isLoading.value = true

    const prefix = normalizeContentPath(basePath)

    const loaders = {
      quiz: jsonMap.get(`${prefix}/quiz.json`),
      tasks: jsonMap.get(`${prefix}/tasks/_tasks.json`),
      walkthrough: jsonMap.get(`${prefix}/walkthrough.json`),
      interview: jsonMap.get(`${prefix}/interview.json`),
    }

    const results = await Promise.allSettled([
      loaders.quiz?.(),
      loaders.tasks?.(),
      loaders.walkthrough?.(),
      loaders.interview?.(),
    ])

    if (results[0].status === 'fulfilled' && results[0].value) {
      quiz.value = (results[0].value.default ?? results[0].value) as Quiz
    }
    if (results[1].status === 'fulfilled' && results[1].value) {
      const data = (results[1].value.default ?? results[1].value) as { tasks?: Task[] }
      tasks.value = data.tasks ?? []
    }
    if (results[2].status === 'fulfilled' && results[2].value) {
      walkthrough.value = (results[2].value.default ?? results[2].value) as Walkthrough
    }
    if (results[3].status === 'fulfilled' && results[3].value) {
      interview.value = (results[3].value.default ?? results[3].value) as Interview
    }

    isLoading.value = false
  }, { immediate: true })

  return { quiz, tasks, walkthrough, interview, isLoading }
}
