import { describe, it, expect } from 'vitest'
import { truncate } from './01-easy-truncate.js'

describe('truncate', () => {
  it('не обрезает строку короче maxLength', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('не обрезает строку равной maxLength', () => {
    expect(truncate('Hello', 5)).toBe('Hello')
  })

  it('обрезает длинную строку и добавляет ...', () => {
    expect(truncate('Hello, World!', 10)).toBe('Hello, ...')
  })

  it('результат ровно maxLength символов', () => {
    const result = truncate('abcdefghij', 7)
    expect(result.length).toBe(7)
    expect(result.endsWith('...')).toBe(true)
  })

  it('когда maxLength <= 3 — возвращает ...', () => {
    expect(truncate('Hello', 3)).toBe('...')
    expect(truncate('Hello', 2)).toBe('...')
    expect(truncate('Hello', 1)).toBe('...')
  })

  it('работает с пустой строкой', () => {
    expect(truncate('', 5)).toBe('')
  })

  it('работает с многобайтными символами (проверяет .length)', () => {
    const result = truncate('JavaScript', 7)
    expect(result.length).toBe(7)
    expect(result).toBe('Java...')
  })
})
