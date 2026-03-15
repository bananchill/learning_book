import { describe, it, expect } from 'vitest'
import { add, greet, isEven, getLength, formatDate } from './01-easy-add-types'

describe('add', () => {
  it('складывает два числа', () => {
    expect(add(2, 3)).toBe(5)
  })

  it('работает с отрицательными числами', () => {
    expect(add(-1, 1)).toBe(0)
  })
})

describe('greet', () => {
  it('приветствует по имени', () => {
    expect(greet('Алиса')).toBe('Привет, Алиса!')
  })
})

describe('isEven', () => {
  it('возвращает true для чётного числа', () => {
    expect(isEven(4)).toBe(true)
  })

  it('возвращает false для нечётного числа', () => {
    expect(isEven(3)).toBe(false)
  })
})

describe('getLength', () => {
  it('возвращает длину строки', () => {
    expect(getLength('hello')).toBe(5)
  })

  it('возвращает 0 для пустой строки', () => {
    expect(getLength('')).toBe(0)
  })
})

describe('formatDate', () => {
  it('форматирует дату', () => {
    const date = new Date(2024, 0, 15) // 15 января 2024
    const result = formatDate(date)
    expect(result).toContain('15')
  })
})
