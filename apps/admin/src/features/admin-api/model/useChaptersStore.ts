import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAsyncAction } from '@book/shared'
import { adminApi } from '../api/adminApi'
import type { ChapterListItem, ChapterDetail } from '@/shared'

export const useChaptersStore = defineStore('admin-chapters', () => {
  const chapters = ref<ChapterListItem[]>([])
  const currentChapter = ref<ChapterDetail | null>(null)
  const { isLoading, error, run } = useAsyncAction()

  async function fetchChapters() {
    const result = await run(() => adminApi.getChapters())
    if (result) chapters.value = result
  }

  async function fetchChapter(id: string) {
    const result = await run(() => adminApi.getChapter(id))
    if (result) currentChapter.value = result
  }

  return { chapters, currentChapter, isLoading, error, fetchChapters, fetchChapter }
})
