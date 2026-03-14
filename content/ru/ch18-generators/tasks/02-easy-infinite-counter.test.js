import { describe, it, expect } from 'vitest'
import { InfiniteCounter } from './02-easy-infinite-counter.js'

describe('InfiniteCounter', () => {
  it('считает от 0 с шагом 1 по умолчанию', () => {
    const counter = new InfiniteCounter()
    const iter = counter[Symbol.iterator]()
    expect(iter.next()).toEqual({ value: 0, done: false })
    expect(iter.next()).toEqual({ value: 1, done: false })
    expect(iter.next()).toEqual({ value: 2, done: false })
  })

  it('поддерживает кастомный start и step', () => {
    const counter = new InfiniteCounter(10, 5)
    const iter = counter[Symbol.iterator]()
    expect(iter.next().value).toBe(10)
    expect(iter.next().value).toBe(15)
    expect(iter.next().value).toBe(20)
  })

  it('никогда не возвращает done: true', () => {
    const counter = new InfiniteCounter()
    const iter = counter[Symbol.iterator]()
    for (let i = 0; i < 1000; i++) {
      const result = iter.next()
      expect(result.done).toBe(false)
    }
  })

  it('работает с for...of и break', () => {
    const first3 = []
    for (const n of new InfiniteCounter(1, 2)) {
      first3.push(n)
      if (first3.length === 3) break
    }
    expect(first3).toEqual([1, 3, 5])
  })

  it('каждый for...of начинает с начала', () => {
    const counter = new InfiniteCounter(100, 10)
    const run1 = []
    for (const n of counter) {
      run1.push(n)
      if (run1.length === 3) break
    }
    const run2 = []
    for (const n of counter) {
      run2.push(n)
      if (run2.length === 3) break
    }
    expect(run1).toEqual([100, 110, 120])
    expect(run2).toEqual([100, 110, 120]) // не продолжает с места остановки
  })
})
