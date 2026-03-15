import { describe, it, expect } from 'vitest'
import { createValidator, createOperation } from './02-easy-call-signatures'
import type { Validator, MathOperation } from './02-easy-call-signatures'

describe('Validator', () => {
  it('валидирует строку по паттерну', () => {
    const emailValidator = createValidator(
      /^[^@]+@[^@]+\.[^@]+$/,
      'Некорректный email'
    )
    expect(emailValidator('test@example.com')).toBe(true)
    expect(emailValidator('invalid')).toBe(false)
  })

  it('имеет свойство errorMessage', () => {
    const validator = createValidator(/^\d+$/, 'Только цифры')
    expect(validator.errorMessage).toBe('Только цифры')
  })

  it('можно вызвать и прочитать свойство', () => {
    const validator: Validator = createValidator(/^[a-z]+$/, 'Только строчные буквы')
    expect(validator('hello')).toBe(true)
    expect(validator('Hello')).toBe(false)
    expect(validator.errorMessage).toBe('Только строчные буквы')
  })
})

describe('MathOperation', () => {
  it('выполняет операцию над числами', () => {
    const add = createOperation('+', (a, b) => a + b)
    expect(add(2, 3)).toBe(5)
  })

  it('имеет свойство symbol', () => {
    const multiply = createOperation('*', (a, b) => a * b)
    expect(multiply.symbol).toBe('*')
  })

  it('работает с разными операциями', () => {
    const sub: MathOperation = createOperation('-', (a, b) => a - b)
    expect(sub(10, 3)).toBe(7)
    expect(sub.symbol).toBe('-')
  })
})
