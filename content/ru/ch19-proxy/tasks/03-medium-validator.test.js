import { describe, it, expect } from 'vitest'
import { createValidated } from './03-medium-validator.js'

const schema = {
  age: (v) => typeof v === 'number' && v >= 0 && v <= 150,
  email: (v) => typeof v === 'string' && v.includes('@')
}

describe('createValidated', () => {
  it('разрешает запись валидных значений', () => {
    const user = createValidated({}, schema)
    expect(() => { user.age = 25 }).not.toThrow()
    expect(user.age).toBe(25)
  })

  it('бросает TypeError для невалидного значения', () => {
    const user = createValidated({}, schema)
    expect(() => { user.age = -5 }).toThrow(TypeError)
    expect(() => { user.age = 200 }).toThrow(TypeError)
    expect(() => { user.email = 'notanemail' }).toThrow(TypeError)
  })

  it('сообщение об ошибке содержит имя свойства и значение', () => {
    const user = createValidated({}, schema)
    expect(() => { user.age = -5 }).toThrow(/age/)
    expect(() => { user.age = -5 }).toThrow(/-5/)
  })

  it('не изменяет target при невалидных данных', () => {
    const target = { age: 30 }
    const user = createValidated(target, schema)
    try { user.age = -1 } catch {}
    expect(target.age).toBe(30) // не изменилось
    expect(user.age).toBe(30)
  })

  it('разрешает запись свойств не из schema без проверки', () => {
    const user = createValidated({}, schema)
    expect(() => { user.name = 'Алиса' }).not.toThrow()
    expect(() => { user.name = 123 }).not.toThrow() // нет валидатора
    expect(user.name).toBe(123)
  })

  it('правильно читает записанные значения', () => {
    const user = createValidated({}, schema)
    user.age = 42
    user.email = 'test@example.com'
    expect(user.age).toBe(42)
    expect(user.email).toBe('test@example.com')
  })
})
