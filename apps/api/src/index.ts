import express from 'express'
import cors from 'cors'
import { configRouter } from './routes/config.js'
import { chaptersRouter } from './routes/chapters.js'
import { statsRouter } from './routes/stats.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const port = process.env.PORT ?? 3000

app.use(cors({ origin: ['http://localhost:5174', 'http://localhost:5173'] }))
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/config', configRouter)
app.use('/api/chapters', chaptersRouter)
app.use('/api/stats', statsRouter)

app.use(errorHandler)

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`)
})
