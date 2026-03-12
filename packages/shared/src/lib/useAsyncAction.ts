import { ref } from 'vue'

/**
 * Обёртка для async-действий с отслеживанием isLoading / error.
 * Устраняет дублирование try/catch/finally в сторах.
 */
export function useAsyncAction() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    isLoading.value = true
    error.value = null
    try {
      return await fn()
    } catch (e) {
      error.value = (e as Error).message
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, run }
}
