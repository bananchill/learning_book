import { defineStore } from 'pinia'
import { ref } from 'vue'
import { adminApi } from '../api/adminApi'
import type { ChapterListItem, ChapterDetail } from '@/shared'

export const useChaptersStore = defineStore('admin-chapters', () => {
  const chapters = ref<ChapterListItem[]>([])
  const currentChapter = ref<ChapterDetail | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchChapters() {
    isLoading.value = true
    error.value = null
    try {
      chapters.value = await adminApi.getChapters()
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  async function fetchChapter(id: string) {
    isLoading.value = true
    error.value = null
    try {
      currentChapter.value = await adminApi.getChapter(id)
    } catch (e) {
      error.value = (e as Error).message
    } finally {
      isLoading.value = false
    }
  }

  return { chapters, currentChapter, isLoading, error, fetchChapters, fetchChapter }
})
