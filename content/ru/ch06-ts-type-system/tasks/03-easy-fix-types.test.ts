import { describe, it, expect } from 'vitest'
import { parseData, formatUser, safeStringLength, divide } from './03-easy-fix-types'

describe('parseData', () => {
  it('преобразует строку в верхний регистр', () => {
    expect(parseData('hello')).toBe('HELLO')
  })

  it('выбрасывает ошибку для не-строки', () => {
    expect(() => parseData(42)).toThrow()
    expect(() => parseData(null)).toThrow()
  })
})

describe('formatUser', () => {
  it('форматирует пользователя с именем и возрастом', () => {
    expect(formatUser({ name: 'Алекс', age: 25 })).toBe('Алекс (25)')
  })
})

describe('safeStringLength', () => {
  it('возвращает длину строки', () => {
    expect(safeStringLength('hello')).toBe(5)
    expect(safeStringLength('')).toBe(0)
  })

  it('возвращает 0 для не-строки', () => {
    expect(safeStringLength(42)).toBe(0)
    expect(safeStringLength(null)).toBe(0)
    expect(safeStringLength(undefined)).toBe(0)
  })
})

describe('divide', () => {
  it('делит числа', () => {
    expect(divide(10, 2)).toBe(5)
    expect(divide(7, 3)).toBeCloseTo(2.333, 2)
  })

  it('возвращает null при делении на ноль', () => {
    expect(divide(10, 0)).toBeNull()
  })
})
