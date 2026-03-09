import { describe, it, expect } from 'vitest'
import { memoize } from './02-easy-memoize'

describe('memoize', () => {
  it('возвращает результат оригинальной функции', () => {
    const double = memoize((x) => x * 2)
    expect(double(5)).toBe(10)
  })

  it('не вызывает функцию повторно для того же аргумента', () => {
    let callCount = 0
    const fn = (x) => { callCount++; return x * 2 }
    const memoized = memoize(fn)
    memoized(5)
    memoized(5)
    memoized(5)
    expect(callCount).toBe(1)
  })

  it('вызывает функцию для разных аргументов', () => {
    let callCount = 0
    const fn = (x) => { callCount++; return x * 2 }
    const memoized = memoize(fn)
    memoized(1)
    memoized(2)
    expect(callCount).toBe(2)
  })

  it('корректно кэширует разные значения', () => {
    const memoized = memoize((x) => x + 1)
    expect(memoized(1)).toBe(2)
    expect(memoized(2)).toBe(3)
    expect(memoized(1)).toBe(2)
  })
})
