import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAsyncAction } from '@book/shared'
import { adminApi } from '../api/adminApi'
import type { AdminStats } from '@/shared'

export const useStatsStore = defineStore('admin-stats', () => {
  const stats = ref<AdminStats | null>(null)
  const { isLoading, error, run } = useAsyncAction()

  async function fetchStats() {
    const result = await run(() => adminApi.getStats())
    if (result) stats.value = result
  }

  return { stats, isLoading, error, fetchStats }
})
