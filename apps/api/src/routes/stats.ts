import { Router } from 'express'
import { resolve } from 'path'
import { CONTENT_DIR, BOOK_CONFIG_PATH } from '../lib/contentPath.js'
import { readJsonFile } from '../lib/readJsonFile.js'
import type { BookConfig } from '@book/shared'

export const statsRouter = Router()

// GET /api/stats — агрегированная статистика
statsRouter.get('/', async (_req, res, next) => {
  try {
    const config = await readJsonFile<BookConfig>(BOOK_CONFIG_PATH)

    let totalChapters = 0
    let totalTasks = 0
    let totalQuizQuestions = 0
    let totalInterviewQuestions = 0
    let chaptersWithContent = 0
    const coverage = { tasks: 0, quiz: 0, interview: 0, walkthrough: 0, codeReview: 0 }

    for (const section of config.sections) {
      for (const subsection of section.subsections) {
      for (const group of subsection.groups) {
      for (const chapter of group.chapters) {
        totalChapters++
        const dir = resolve(CONTENT_DIR, chapter.id)
        let hasAny = false

        try {
          const tasksData = await readJsonFile<{ tasks: unknown[] }>(resolve(dir, 'tasks', '_tasks.json'))
          totalTasks += tasksData.tasks.length
          coverage.tasks++
          hasAny = true
        } catch { /* нет файла */ }

        try {
          const quiz = await readJsonFile<{ questions: unknown[] }>(resolve(dir, 'quiz.json'))
          totalQuizQuestions += quiz.questions.length
          coverage.quiz++
          hasAny = true
        } catch { /* нет файла */ }

        try {
          const interview = await readJsonFile<{ questions: unknown[] }>(resolve(dir, 'interview.json'))
          totalInterviewQuestions += interview.questions.length
          coverage.interview++
          hasAny = true
        } catch { /* нет файла */ }

        try {
          await readJsonFile(resolve(dir, 'walkthrough.json'))
          coverage.walkthrough++
          hasAny = true
        } catch { /* нет файла */ }

        try {
          await readJsonFile(resolve(dir, 'code-review', '01-review.json'))
          coverage.codeReview++
          hasAny = true
        } catch { /* нет файла */ }

        if (hasAny) chaptersWithContent++
      }
      }
      }
    }

    res.json({
      totalSections: config.sections.length,
      totalChapters,
      totalTasks,
      totalQuizQuestions,
      totalInterviewQuestions,
      chaptersWithContent,
      chaptersEmpty: totalChapters - chaptersWithContent,
      contentCoverage: coverage,
    })
  } catch (err) {
    next(err)
  }
})
