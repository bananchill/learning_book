import { ref, computed } from 'vue'
import type { BookConfig } from '@book/shared'
import { useAsyncAction } from '@book/shared'
import { adminApi } from '../api/adminApi'

const config = ref<BookConfig | null>(null)
const { isLoading, error, run } = useAsyncAction()

export function useBookConfigAdmin() {
  async function loadConfig() {
    const result = await run(() => adminApi.getConfig())
    if (result) config.value = result
  }

  async function saveConfig() {
    if (!config.value) return false
    const result = await run(() => adminApi.updateConfig(config.value!))
    return result !== undefined
  }

  const sections = computed(() => config.value?.sections ?? [])

  return { config, sections, isLoading, error, loadConfig, saveConfig }
}
