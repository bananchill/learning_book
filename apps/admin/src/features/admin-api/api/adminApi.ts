import type { BookConfig } from '@book/shared'
import type { AdminStats, ChapterListItem, ChapterDetail } from '@/shared'

const BASE = '/api'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(`${BASE}${url}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function putJson<T>(url: string, data: unknown): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const adminApi = {
  getConfig: () => fetchJson<BookConfig>('/config'),
  updateConfig: (data: BookConfig) => putJson<{ success: boolean }>('/config', data),

  getChapters: () => fetchJson<ChapterListItem[]>('/chapters'),
  getChapter: (id: string) => fetchJson<ChapterDetail>(`/chapters/${id}`),
  updateChapterMeta: (id: string, meta: unknown) =>
    putJson<{ success: boolean }>(`/chapters/${id}/meta`, meta),

  getStats: () => fetchJson<AdminStats>('/stats'),
}
