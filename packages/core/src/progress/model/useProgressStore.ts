import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { computed } from 'vue'
import type { ChapterProgress, BookProgress } from '@book/shared'
import { addIfAbsent } from '@book/shared'
import { chapterCompletionPercent, chapterStatus, bookCompletionPercent } from './progressCalc'

const DEFAULT_CHAPTER_PROGRESS: () => ChapterProgress = () => ({
  chapterId: '',
  reading: { completed: [], total: 0 },
  tasks: { completed: [], total: 0 },
  quiz: { score: 0, total: 0, passed: false },
  interview: { reviewed: [], total: 0 },
  walkthrough: { completed: false },
  lastActivity: new Date().toISOString(),
})

export const useProgressStore = defineStore('progress', () => {
  const progress = useStorage<BookProgress>('book-progress', {
    chapters: {},
    streak: { current: 0, lastDate: '' },
    totalCompletion: 0,
  })

  // Получить или создать прогресс главы
  function getChapter(chapterId: string): ChapterProgress {
    if (!progress.value.chapters[chapterId]) {
      progress.value.chapters[chapterId] = {
        ...DEFAULT_CHAPTER_PROGRESS(),
        chapterId,
      }
    }
    return progress.value.chapters[chapterId]
  }

  function markSubchapterRead(chapterId: string, subchapterId: string) {
    const ch = getChapter(chapterId)
    if (addIfAbsent(ch.reading.completed, subchapterId)) {
      ch.lastActivity = new Date().toISOString()
    }
  }

  function markTaskCompleted(chapterId: string, taskId: string) {
    const ch = getChapter(chapterId)
    if (addIfAbsent(ch.tasks.completed, taskId)) {
      ch.lastActivity = new Date().toISOString()
    }
  }

  function saveQuizScore(chapterId: string, score: number, total: number) {
    const ch = getChapter(chapterId)
    ch.quiz = { score, total, passed: total > 0 && (score / total) >= 0.6 }
    ch.lastActivity = new Date().toISOString()
  }

  function markInterviewReviewed(chapterId: string, questionId: string) {
    const ch = getChapter(chapterId)
    if (addIfAbsent(ch.interview.reviewed, questionId)) {
      ch.lastActivity = new Date().toISOString()
    }
  }

  function markWalkthroughCompleted(chapterId: string) {
    const ch = getChapter(chapterId)
    ch.walkthrough.completed = true
    ch.lastActivity = new Date().toISOString()
  }

  function setChapterTotals(chapterId: string, totals: {
    reading?: number
    tasks?: number
    quiz?: number
    interview?: number
  }) {
    const ch = getChapter(chapterId)
    if (totals.reading !== undefined) ch.reading.total = totals.reading
    if (totals.tasks !== undefined) ch.tasks.total = totals.tasks
    if (totals.quiz !== undefined) ch.quiz.total = totals.quiz
    if (totals.interview !== undefined) ch.interview.total = totals.interview
  }

  function getChapterPercent(chapterId: string): number {
    return chapterCompletionPercent(getChapter(chapterId))
  }

  function getChapterStatus(chapterId: string) {
    return chapterStatus(getChapter(chapterId))
  }

  const allChapters = computed(() => progress.value.chapters)

  function resetAll() {
    progress.value = {
      chapters: {},
      streak: { current: 0, lastDate: '' },
      totalCompletion: 0,
    }
  }

  function resetChapter(chapterId: string) {
    delete progress.value.chapters[chapterId]
  }

  return {
    progress,
    allChapters,
    getChapter,
    markSubchapterRead,
    markTaskCompleted,
    saveQuizScore,
    markInterviewReviewed,
    markWalkthroughCompleted,
    setChapterTotals,
    getChapterPercent,
    getChapterStatus,
    resetAll,
    resetChapter,
  }
})
