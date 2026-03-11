import { Router } from 'express'
import { resolve } from 'path'
import { CONTENT_DIR, BOOK_CONFIG_PATH } from '../lib/contentPath.js'
import { readJsonFile } from '../lib/readJsonFile.js'
import { writeJsonFile } from '../lib/writeJsonFile.js'
import { listMdFiles } from '../lib/listMdFiles.js'
import type { BookConfig } from '@book/shared'

export const chaptersRouter = Router()

/** Безопасно извлекает значение из Promise.allSettled */
function extractSettled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

// GET /api/chapters — список всех глав с индикаторами контента
chaptersRouter.get('/', async (_req, res, next) => {
  try {
    const config = await readJsonFile<BookConfig>(BOOK_CONFIG_PATH)
    const chapters = []

    for (const section of config.sections) {
      for (const subsection of section.subsections) {
        for (const group of subsection.groups) {
          for (const chapter of group.chapters) {
            const chapterDir = resolve(CONTENT_DIR, chapter.id)

            const [tasks, quiz, interview, walkthrough] = await Promise.allSettled([
              readJsonFile<{ tasks: unknown[] }>(resolve(chapterDir, 'tasks', '_tasks.json')),
              readJsonFile<{ questions: unknown[] }>(resolve(chapterDir, 'quiz.json')),
              readJsonFile<{ questions: unknown[] }>(resolve(chapterDir, 'interview.json')),
              readJsonFile(resolve(chapterDir, 'walkthrough.json')),
            ])

            const taskList = extractSettled(tasks)
            const quizData = extractSettled(quiz)
            const interviewData = extractSettled(interview)

            chapters.push({
              id: chapter.id,
              title: chapter.title,
              description: chapter.description,
              section: section.id,
              sectionTitle: section.title,
              subsection: subsection.id,
              subsectionTitle: subsection.title,
              group: group.id,
              groupTitle: group.title,
              order: chapter.order,
              hasQuiz: quizData !== null,
              hasTasks: taskList !== null,
              hasInterview: interviewData !== null,
              hasWalkthrough: extractSettled(walkthrough) !== null,
              taskCount: taskList?.tasks?.length ?? 0,
              quizQuestionCount: quizData?.questions?.length ?? 0,
            })
          }
        }
      }
    }

    res.json(chapters)
  } catch (err) {
    next(err)
  }
})

// GET /api/chapters/:chapterId — полные данные главы
chaptersRouter.get('/:chapterId', async (req, res, next) => {
  try {
    const { chapterId } = req.params
    const chapterDir = resolve(CONTENT_DIR, chapterId)

    const [meta, quiz, tasks, interview, walkthrough, resources, codeReview] =
      await Promise.allSettled([
        readJsonFile(resolve(chapterDir, '_meta.json')),
        readJsonFile(resolve(chapterDir, 'quiz.json')),
        readJsonFile(resolve(chapterDir, 'tasks', '_tasks.json')),
        readJsonFile(resolve(chapterDir, 'interview.json')),
        readJsonFile(resolve(chapterDir, 'walkthrough.json')),
        readJsonFile(resolve(chapterDir, 'resources.json')),
        readJsonFile(resolve(chapterDir, 'code-review', '01-review.json')),
      ])

    const subchapterFiles = await listMdFiles(chapterDir)

    res.json({
      meta: extractSettled(meta),
      quiz: extractSettled(quiz),
      tasks: (extractSettled(tasks) as { tasks: unknown[] } | null)?.tasks ?? null,
      interview: extractSettled(interview),
      walkthrough: extractSettled(walkthrough),
      resources: extractSettled(resources),
      codeReview: extractSettled(codeReview),
      subchapterFiles,
    })
  } catch (err) {
    next(err)
  }
})

// PUT /api/chapters/:chapterId/meta — обновить _meta.json
chaptersRouter.put('/:chapterId/meta', async (req, res, next) => {
  try {
    const { chapterId } = req.params
    const metaPath = resolve(CONTENT_DIR, chapterId, '_meta.json')
    await writeJsonFile(metaPath, req.body)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})
