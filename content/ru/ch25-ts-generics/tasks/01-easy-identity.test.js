import { describe, it, expect } from 'vitest'
import { identity } from './01-easy-identity.js'

describe('identity', () => {
  it('возвращает число без изменений', () => {
    expect(identity(42)).toBe(42)
  })

  it('возвращает строку без изменений', () => {
    expect(identity('hello')).toBe('hello')
  })

  it('возвращает булево значение без изменений', () => {
    expect(identity(true)).toBe(true)
    expect(identity(false)).toBe(false)
  })

  it('возвращает объект без изменений (та же ссылка)', () => {
    const obj = { name: 'Иван' }
    expect(identity(obj)).toBe(obj)
  })

  it('возвращает массив без изменений (та же ссылка)', () => {
    const arr = [1, 2, 3]
    expect(identity(arr)).toBe(arr)
  })

  it('возвращает null и undefined без изменений', () => {
    expect(identity(null)).toBeNull()
    expect(identity(undefined)).toBeUndefined()
  })
})
