import { describe, it, expect } from 'vitest'
import { parallelLimit } from './06-hard-parallel-limit'

describe('parallelLimit', () => {
  it('возвращает результаты в правильном порядке', async () => {
    const tasks = [
      () => new Promise(r => setTimeout(() => r('a'), 30)),
      () => new Promise(r => setTimeout(() => r('b'), 10)),
      () => new Promise(r => setTimeout(() => r('c'), 20)),
    ]
    const results = await parallelLimit(tasks, 2)
    expect(results).toEqual(['a', 'b', 'c'])
  })

  it('ограничивает параллелизм', async () => {
    let running = 0
    let maxRunning = 0
    const createTask = (val) => () => {
      running++
      maxRunning = Math.max(maxRunning, running)
      return new Promise(r => setTimeout(() => { running--; r(val) }, 20))
    }
    const tasks = [createTask(1), createTask(2), createTask(3), createTask(4), createTask(5)]
    const results = await parallelLimit(tasks, 2)
    expect(maxRunning <= 2).toBe(true)
    expect(results).toEqual([1, 2, 3, 4, 5])
  })

  it('работает с пустым массивом', async () => {
    const results = await parallelLimit([], 3)
    expect(results).toEqual([])
  })
})
