import { describe, it, expect } from 'vitest'
import { parallelMap } from './08-hard-parallel-map'

const doubleCode = `
  self.onmessage = (e) => {
    self.postMessage(e.data * 2)
  }
`

const slowDoubleCode = `
  self.onmessage = (e) => {
    const start = Date.now()
    while (Date.now() - start < 10) {}
    self.postMessage(e.data * 2)
  }
`

describe('parallelMap', () => {
  it('обрабатывает массив и возвращает результаты', async () => {
    const result = await parallelMap([1, 2, 3, 4, 5], doubleCode, 2)
    expect(result).toEqual([2, 4, 6, 8, 10])
  })

  it('сохраняет порядок результатов', async () => {
    const result = await parallelMap([5, 3, 1, 4, 2], doubleCode, 2)
    expect(result).toEqual([10, 6, 2, 8, 4])
  })

  it('работает с одним воркером', async () => {
    const result = await parallelMap([10, 20, 30], doubleCode, 1)
    expect(result).toEqual([20, 40, 60])
  })

  it('работает с пустым массивом', async () => {
    const result = await parallelMap([], doubleCode, 2)
    expect(result).toEqual([])
  })

  it('обрабатывает больше задач, чем воркеров', async () => {
    const items = Array.from({ length: 10 }, (_, i) => i + 1)
    const result = await parallelMap(items, doubleCode, 3)
    expect(result).toEqual(items.map((x) => x * 2))
  })

  it('использует параллелизм (быстрее последовательного)', async () => {
    const items = Array.from({ length: 8 }, (_, i) => i + 1)
    const start = Date.now()
    await parallelMap(items, slowDoubleCode, 4)
    const elapsed = Date.now() - start

    // 8 задач по 10ms, 4 воркера → ~20ms (2 раунда)
    // Последовательно было бы ~80ms
    expect(elapsed < 60).toBe(true)
  })
})
