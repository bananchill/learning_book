import { describe, it, expect } from 'vitest'
import { add, multiply, capitalize, trimStr, formatDate } from './02-easy-re-export.js'

describe('add', () => {
  it('складывает два числа', () => {
    expect(add(2, 3)).toBe(5)
    expect(add(-1, 1)).toBe(0)
    expect(add(0, 0)).toBe(0)
  })
})

describe('multiply', () => {
  it('умножает два числа', () => {
    expect(multiply(3, 4)).toBe(12)
    expect(multiply(-2, 5)).toBe(-10)
    expect(multiply(0, 100)).toBe(0)
  })
})

describe('capitalize', () => {
  it('делает первую букву заглавной', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('world')).toBe('World')
  })

  it('делает остальные буквы строчными', () => {
    expect(capitalize('hELLO')).toBe('Hello')
    expect(capitalize('WORLD')).toBe('World')
  })

  it('работает с пустой строкой', () => {
    expect(capitalize('')).toBe('')
  })
})

describe('trimStr', () => {
  it('убирает пробелы по краям', () => {
    expect(trimStr('  hello  ')).toBe('hello')
    expect(trimStr('\t text \n')).toBe('text')
    expect(trimStr('no spaces')).toBe('no spaces')
  })
})

describe('formatDate', () => {
  it('форматирует дату в YYYY-MM-DD', () => {
    expect(formatDate(new Date('2024-01-15T12:00:00'))).toBe('2024-01-15')
    expect(formatDate(new Date('2024-12-31T00:00:00'))).toBe('2024-12-31')
  })

  it('дополняет месяц и день нулём', () => {
    expect(formatDate(new Date('2024-03-05T12:00:00'))).toBe('2024-03-05')
  })
})
