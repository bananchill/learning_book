import { describe, it, expect } from 'vitest'
import { result1, result2, result3 } from './02-easy-fix-errors'

describe('result1', () => {
  it('результат — число 15', () => {
    expect(result1).toBe(15)
    expect(typeof result1).toBe('number')
  })
})

describe('result2', () => {
  it('результат — строка с приветствием', () => {
    expect(typeof result2).toBe('string')
    expect(result2).toContain('Привет, Алиса!')
  })
})

describe('result3', () => {
  it('результат — строка "хахаха"', () => {
    expect(result3).toBe('хахаха')
  })
})
