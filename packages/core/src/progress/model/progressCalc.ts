import type { ChapterProgress, ChapterStatus } from '@book/shared'
import { calcPercent } from '@book/shared'

// Расчёт процента завершения главы
export function chapterCompletionPercent(progress: ChapterProgress): number {
  const parts: number[] = []

  // Чтение
  if (progress.reading.total > 0) {
    parts.push(progress.reading.completed.length / progress.reading.total)
  }

  // Задачи
  if (progress.tasks.total > 0) {
    parts.push(progress.tasks.completed.length / progress.tasks.total)
  }

  // Квиз
  if (progress.quiz.total > 0) {
    parts.push(progress.quiz.passed ? 1 : 0)
  }

  if (parts.length === 0) return 0
  const sum = parts.reduce((a, b) => a + b, 0)
  return calcPercent(sum, parts.length)
}

// Статус главы
export function chapterStatus(progress: ChapterProgress): ChapterStatus {
  const percent = chapterCompletionPercent(progress)
  if (percent === 0) return 'not_started'
  if (percent === 100) return 'completed'
  return 'in_progress'
}

// Общий процент книги
export function bookCompletionPercent(
  chapters: Record<string, ChapterProgress>,
  totalChapters: number,
): number {
  if (totalChapters === 0) return 0
  const completedCount = Object.values(chapters).filter(
    (ch) => chapterStatus(ch) === 'completed',
  ).length
  return calcPercent(completedCount, totalChapters)
}
