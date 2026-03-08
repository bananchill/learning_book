import { describe, it, expect } from 'vitest'
import { parallelSum } from './04-medium-parallel-sum'

describe('parallelSum', () => {
  it('суммирует массив параллельно', async () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const result = await parallelSum(numbers, 2)
    expect(result).toBe(55)
  })

  it('работает с одним воркером', async () => {
    const numbers = [10, 20, 30]
    const result = await parallelSum(numbers, 1)
    expect(result).toBe(60)
  })

  it('работает когда воркеров больше, чем элементов', async () => {
    const numbers = [5, 10]
    const result = await parallelSum(numbers, 4)
    expect(result).toBe(15)
  })

  it('работает с пустым массивом', async () => {
    const result = await parallelSum([], 2)
    expect(result).toBe(0)
  })

  it('корректно суммирует большой массив', async () => {
    const numbers = Array.from({ length: 1000 }, (_, i) => i + 1)
    const expected = (1000 * 1001) / 2
    const result = await parallelSum(numbers, 4)
    expect(result).toBe(expected)
  })
})
