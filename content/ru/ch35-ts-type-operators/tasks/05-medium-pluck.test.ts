import { describe, it, expect } from 'vitest'
import { pluck, pluckMany } from './05-medium-pluck'

describe('pluck', () => {
  const users = [
    { id: 1, name: 'Алиса', age: 30 },
    { id: 2, name: 'Боб', age: 25 },
    { id: 3, name: 'Ева', age: 35 },
  ]

  it('извлекает строковые значения по ключу', () => {
    expect(pluck(users, 'name')).toEqual(['Алиса', 'Боб', 'Ева'])
  })

  it('извлекает числовые значения по ключу', () => {
    expect(pluck(users, 'age')).toEqual([30, 25, 35])
  })

  it('извлекает id', () => {
    expect(pluck(users, 'id')).toEqual([1, 2, 3])
  })

  it('возвращает пустой массив для пустого входа', () => {
    expect(pluck([], 'name')).toEqual([])
  })

  it('работает с объектами другой формы', () => {
    const products = [
      { title: 'Книга', price: 500 },
      { title: 'Ручка', price: 50 },
    ]
    expect(pluck(products, 'title')).toEqual(['Книга', 'Ручка'])
    expect(pluck(products, 'price')).toEqual([500, 50])
  })
})

describe('pluckMany', () => {
  const users = [
    { id: 1, name: 'Алиса', age: 30, admin: true },
    { id: 2, name: 'Боб', age: 25, admin: false },
  ]

  it('извлекает подмножество ключей', () => {
    expect(pluckMany(users, ['name', 'age'])).toEqual([
      { name: 'Алиса', age: 30 },
      { name: 'Боб', age: 25 },
    ])
  })

  it('извлекает один ключ', () => {
    expect(pluckMany(users, ['id'])).toEqual([
      { id: 1 },
      { id: 2 },
    ])
  })

  it('возвращает пустой массив для пустого входа', () => {
    expect(pluckMany([], ['name'])).toEqual([])
  })

  it('при пустом массиве ключей возвращает пустые объекты', () => {
    expect(pluckMany(users, [])).toEqual([{}, {}])
  })
})
