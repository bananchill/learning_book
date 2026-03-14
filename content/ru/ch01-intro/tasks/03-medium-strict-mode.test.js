import { describe, it, expect } from 'vitest'
import { calculateTotal } from './03-medium-strict-mode'

describe('calculateTotal', () => {
  it('суммирует массив чисел', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6)
  })

  it('возвращает 0 для пустого массива', () => {
    expect(calculateTotal([])).toBe(0)
  })

  it('работает с отрицательными числами', () => {
    expect(calculateTotal([-1, -2, 3])).toBe(0)
  })

  it('работает с одним элементом', () => {
    expect(calculateTotal([42])).toBe(42)
  })
})
