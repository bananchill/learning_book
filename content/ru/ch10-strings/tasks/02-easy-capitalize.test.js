import { describe, it, expect } from 'vitest'
import { capitalize } from './02-easy-capitalize.js'

describe('capitalize', () => {
  it('делает первую букву каждого слова заглавной', () => {
    expect(capitalize('hello world')).toBe('Hello World')
  })

  it('работает с несколькими словами', () => {
    expect(capitalize('the quick brown fox')).toBe('The Quick Brown Fox')
  })

  it('не изменяет остальные буквы слова', () => {
    expect(capitalize('HELLO WORLD')).toBe('HELLO WORLD')
  })

  it('одно слово', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('пустая строка', () => {
    expect(capitalize('')).toBe('')
  })

  it('одна буква', () => {
    expect(capitalize('a')).toBe('A')
  })

  it('русские слова', () => {
    expect(capitalize('привет мир')).toBe('Привет Мир')
  })
})
