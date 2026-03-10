import { describe, it, expect } from 'vitest'
import { createUsers } from './04-medium-optimize-shape'

describe('createUsers', () => {
  it('нормализует порядок свойств', () => {
    const result = createUsers([
      { email: 'a@b.com', name: 'Алиса', age: 25 },
      { age: 30, name: 'Боб', email: 'b@b.com' },
    ])
    expect(Object.keys(result[0])).toEqual(['name', 'age', 'email'])
    expect(Object.keys(result[1])).toEqual(['name', 'age', 'email'])
  })

  it('сохраняет значения', () => {
    const result = createUsers([
      { name: 'Алиса', age: 25, email: 'a@b.com' },
    ])
    expect(result[0]).toEqual({ name: 'Алиса', age: 25, email: 'a@b.com' })
  })

  it('удаляет лишние свойства', () => {
    const result = createUsers([
      { name: 'Боб', age: 30, email: 'b@b.com', role: 'admin', id: 1 },
    ])
    expect(result[0]).toEqual({ name: 'Боб', age: 30, email: 'b@b.com' })
    expect(result[0]).not.toHaveProperty('role')
    expect(result[0]).not.toHaveProperty('id')
  })

  it('все объекты имеют одинаковый набор ключей', () => {
    const result = createUsers([
      { age: 20, email: 'x@y.com', name: 'X', extra: true },
      { name: 'Y', email: 'y@y.com', age: 21 },
      { email: 'z@y.com', age: 22, name: 'Z', foo: 'bar' },
    ])
    const allKeys = result.map(o => Object.keys(o).join(','))
    expect(new Set(allKeys).size).toBe(1)
  })

  it('пустой массив → пустой массив', () => {
    expect(createUsers([])).toEqual([])
  })
})
