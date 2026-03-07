import { Router } from 'express'
import { BOOK_CONFIG_PATH } from '../lib/contentPath.js'
import { readJsonFile } from '../lib/readJsonFile.js'
import { writeJsonFile } from '../lib/writeJsonFile.js'

export const configRouter = Router()

// GET /api/config — возвращает book.config.json
configRouter.get('/', async (_req, res, next) => {
  try {
    const config = await readJsonFile(BOOK_CONFIG_PATH)
    res.json(config)
  } catch (err) {
    next(err)
  }
})

// PUT /api/config — обновляет book.config.json
configRouter.put('/', async (req, res, next) => {
  try {
    await writeJsonFile(BOOK_CONFIG_PATH, req.body)
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
})
