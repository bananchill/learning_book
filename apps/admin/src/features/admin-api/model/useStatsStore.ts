import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminApi } from '../api/adminApi'
import type { AdminStats } from '@/shared'

export const useStatsStore = defineStore('admin-stats', () => {
  const stats = ref<AdminStats | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchStats() {
    isLoading.value = true
    error.value = null
    try {
      stats.value = await adminApi.getStats()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  return { stats, isLoading, error, fetchStats }
})
