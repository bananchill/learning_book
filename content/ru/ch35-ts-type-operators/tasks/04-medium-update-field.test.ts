import { describe, it, expect } from 'vitest'
import { updateField, updateFields } from './04-medium-update-field'

describe('updateField', () => {
  const user = { name: 'Алиса', age: 30, admin: false }

  it('обновляет строковое поле', () => {
    const result = updateField(user, 'name', 'Боб')
    expect(result.name).toBe('Боб')
    expect(result.age).toBe(30)
    expect(result.admin).toBe(false)
  })

  it('обновляет числовое поле', () => {
    const result = updateField(user, 'age', 25)
    expect(result.age).toBe(25)
    expect(result.name).toBe('Алиса')
  })

  it('обновляет булевое поле', () => {
    const result = updateField(user, 'admin', true)
    expect(result.admin).toBe(true)
  })

  it('не мутирует оригинальный объект', () => {
    const result = updateField(user, 'name', 'Боб')
    expect(user.name).toBe('Алиса')
    expect(result).not.toBe(user)
  })

  it('сохраняет все остальные поля', () => {
    const result = updateField(user, 'age', 99)
    expect(result).toEqual({ name: 'Алиса', age: 99, admin: false })
  })
})

describe('updateFields', () => {
  const user = { name: 'Алиса', age: 30, admin: false }

  it('обновляет несколько полей одновременно', () => {
    const result = updateFields(user, { name: 'Боб', age: 25 })
    expect(result).toEqual({ name: 'Боб', age: 25, admin: false })
  })

  it('обновляет одно поле', () => {
    const result = updateFields(user, { admin: true })
    expect(result).toEqual({ name: 'Алиса', age: 30, admin: true })
  })

  it('при пустом updates возвращает копию', () => {
    const result = updateFields(user, {})
    expect(result).toEqual(user)
    expect(result).not.toBe(user)
  })

  it('не мутирует оригинальный объект', () => {
    updateFields(user, { name: 'Боб' })
    expect(user.name).toBe('Алиса')
  })
})
