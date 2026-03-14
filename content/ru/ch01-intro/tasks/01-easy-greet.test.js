import { describe, it, expect } from 'vitest'
import { greet } from './01-easy-greet'

describe('greet', () => {
  it('приветствует по имени', () => {
    expect(greet('Иван')).toBe('Привет, Иван!')
  })

  it('использует Мир по умолчанию', () => {
    expect(greet()).toBe('Привет, Мир!')
  })

  it('работает с любым именем', () => {
    expect(greet('JavaScript')).toBe('Привет, JavaScript!')
  })

  it('работает с пустой строкой', () => {
    expect(greet('')).toBe('Привет, !')
  })
})
