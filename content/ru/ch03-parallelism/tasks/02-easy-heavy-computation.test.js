import { describe, it, expect } from 'vitest'
import { computeInWorker } from './02-easy-heavy-computation'

describe('computeInWorker', () => {
  it('выполняет функцию в воркере и возвращает результат', async () => {
    const double = (n) => n * 2
    const result = await computeInWorker(double, 21)
    expect(result).toBe(42)
  })

  it('работает с вычислительно тяжёлой функцией', async () => {
    const sum = (n) => {
      let s = 0
      for (let i = 1; i <= n; i++) s += i
      return s
    }
    const result = await computeInWorker(sum, 100)
    expect(result).toBe(5050)
  })

  it('возвращает промис', () => {
    const identity = (x) => x
    const result = computeInWorker(identity, 'test')
    expect(result).toBeInstanceOf(Promise)
  })

  it('работает с объектами', async () => {
    const getLength = (arr) => arr.length
    const result = await computeInWorker(getLength, [1, 2, 3, 4, 5])
    expect(result).toBe(5)
  })
})
