import { describe, it, expect, vi } from 'vitest'
import { memoize } from './02-easy-memoize'

describe('memoize', () => {
  it('возвращает результат оригинальной функции', () => {
    const double = memoize((x) => x * 2)
    expect(double(5)).toBe(10)
  })

  it('не вызывает функцию повторно для того же аргумента', () => {
    const fn = vi.fn((x) => x * 2)
    const memoized = memoize(fn)
    memoized(5)
    memoized(5)
    memoized(5)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('вызывает функцию для разных аргументов', () => {
    const fn = vi.fn((x) => x * 2)
    const memoized = memoize(fn)
    memoized(1)
    memoized(2)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('корректно кэширует разные значения', () => {
    const memoized = memoize((x) => x + 1)
    expect(memoized(1)).toBe(2)
    expect(memoized(2)).toBe(3)
    expect(memoized(1)).toBe(2)
  })
})
