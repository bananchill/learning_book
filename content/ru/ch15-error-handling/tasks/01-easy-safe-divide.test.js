import { describe, it, expect } from 'vitest'
import { safeDivide } from './01-easy-safe-divide'

describe('safeDivide', () => {
  it('возвращает { ok: true, value } при успехе', () => {
    const result = safeDivide(10, 2)
    expect(result.ok).toBe(true)
    expect(result.value).toBe(5)
  })

  it('возвращает { ok: false, error } при делении на ноль', () => {
    const result = safeDivide(10, 0)
    expect(result.ok).toBe(false)
    expect(result.error).toBeInstanceOf(Error)
  })

  it('не выбрасывает исключений', () => {
    expect(() => safeDivide(1, 0)).not.toThrow()
  })

  it('сообщение об ошибке информативное', () => {
    const result = safeDivide(5, 0)
    expect(result.error.message).toBeTruthy()
    expect(result.error.message.length).toBeGreaterThan(0)
  })

  it('работает с отрицательными числами', () => {
    const result = safeDivide(-10, 2)
    expect(result.ok).toBe(true)
    expect(result.value).toBe(-5)
  })

  it('работает с дробными числами', () => {
    const result = safeDivide(1, 3)
    expect(result.ok).toBe(true)
    expect(result.value).toBeCloseTo(0.333)
  })
})
