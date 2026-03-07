import { ref, computed } from 'vue'
import type { BookConfig } from '@book/shared'
import { adminApi } from '../api/adminApi'

const config = ref<BookConfig | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

export function useBookConfigAdmin() {
  async function loadConfig() {
    isLoading.value = true
    error.value = null
    try {
      config.value = await adminApi.getConfig()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function saveConfig() {
    if (!config.value) return
    try {
      await adminApi.updateConfig(config.value)
      return true
    } catch (e) {
      error.value = (e as Error).message
      return false
    }
  }

  const sections = computed(() => config.value?.sections ?? [])

  return { config, sections, isLoading, error, loadConfig, saveConfig }
}
