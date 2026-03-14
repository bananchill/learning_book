import { describe, it, expect } from 'vitest'
import { ValidationError } from './02-easy-validation-error'

describe('ValidationError', () => {
  it('является экземпляром Error', () => {
    const e = new ValidationError('Обязательное поле', 'email')
    expect(e instanceof Error).toBe(true)
  })

  it('является экземпляром ValidationError', () => {
    const e = new ValidationError('Обязательное поле', 'email')
    expect(e instanceof ValidationError).toBe(true)
  })

  it('message установлен правильно', () => {
    const e = new ValidationError('Email обязателен', 'email')
    expect(e.message).toBe('Email обязателен')
  })

  it('name === ValidationError', () => {
    const e = new ValidationError('ошибка', 'поле')
    expect(e.name).toBe('ValidationError')
  })

  it('field установлен правильно', () => {
    const e = new ValidationError('Неверный формат', 'phone')
    expect(e.field).toBe('phone')
  })

  it('можно поймать как Error', () => {
    expect(() => {
      throw new ValidationError('тест', 'поле')
    }).toThrow(Error)
  })

  it('можно различить через instanceof', () => {
    const errors = [
      new ValidationError('1', 'a'),
      new Error('2'),
      new ValidationError('3', 'b')
    ]
    const validationErrors = errors.filter(e => e instanceof ValidationError)
    expect(validationErrors).toHaveLength(2)
  })
})
