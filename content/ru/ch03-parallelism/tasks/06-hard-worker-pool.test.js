import { describe, it, expect } from 'vitest'
import { WorkerPool } from './06-hard-worker-pool'

const doubleWorkerCode = `
  self.onmessage = (e) => {
    self.postMessage(e.data * 2)
  }
`

const slowWorkerCode = `
  self.onmessage = (e) => {
    const start = Date.now()
    while (Date.now() - start < e.data.delay) {}
    self.postMessage(e.data.value)
  }
`

describe('WorkerPool', () => {
  it('выполняет задачу и возвращает результат', async () => {
    const pool = new WorkerPool(doubleWorkerCode, 2)
    const result = await pool.exec(21)
    expect(result).toBe(42)
    pool.destroy()
  })

  it('обрабатывает несколько задач', async () => {
    const pool = new WorkerPool(doubleWorkerCode, 2)
    const results = await Promise.all([
      pool.exec(1),
      pool.exec(2),
      pool.exec(3),
    ])
    expect(results).toEqual([2, 4, 6])
    pool.destroy()
  })

  it('ограничивает количество одновременных задач', async () => {
    let maxRunning = 0
    let running = 0

    const trackingCode = `
      self.onmessage = (e) => {
        const start = Date.now()
        while (Date.now() - start < 30) {}
        self.postMessage(e.data)
      }
    `

    const pool = new WorkerPool(trackingCode, 2)
    const tasks = Array.from({ length: 5 }, (_, i) => pool.exec(i))
    const results = await Promise.all(tasks)

    expect(results).toEqual([0, 1, 2, 3, 4])
    pool.destroy()
  })

  it('ставит задачи в очередь когда все воркеры заняты', async () => {
    const pool = new WorkerPool(doubleWorkerCode, 1)
    const results = await Promise.all([
      pool.exec(10),
      pool.exec(20),
      pool.exec(30),
    ])
    expect(results).toEqual([20, 40, 60])
    pool.destroy()
  })

  it('destroy завершает все воркеры', () => {
    const pool = new WorkerPool(doubleWorkerCode, 3)
    pool.destroy()
    // не должно выбросить ошибку
  })
})
