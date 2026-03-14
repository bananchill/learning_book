import { describe, it, expect } from 'vitest'
import { omit } from './02-easy-omit.js'

describe('omit', () => {
  it('убирает один ключ', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 })
  })

  it('убирает несколько ключей', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ b: 2 })
  })

  it('несуществующие ключи игнорируются', () => {
    expect(omit({ a: 1 }, ['x'])).toEqual({ a: 1 })
  })

  it('пустой массив ключей — возвращает копию', () => {
    const obj = { a: 1, b: 2 }
    const result = omit(obj, [])
    expect(result).toEqual({ a: 1, b: 2 })
    expect(result).not.toBe(obj) // должна быть новая копия
  })

  it('убрать все ключи — возвращает {}', () => {
    expect(omit({ a: 1, b: 2 }, ['a', 'b'])).toEqual({})
  })

  it('не изменяет исходный объект', () => {
    const obj = { a: 1, b: 2, c: 3 }
    omit(obj, ['a'])
    expect(obj).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('работает с пустым объектом', () => {
    expect(omit({}, ['a', 'b'])).toEqual({})
  })
})
