import { describe, it, expect } from 'vitest'
import { createDictionary, getValueOrDefault, sumValues, type Dictionary } from './02-easy-index-signature'

describe('Dictionary', () => {
  it('позволяет хранить строковые ключи с числовыми значениями', () => {
    const dict: Dictionary = { apples: 5, oranges: 3 }
    expect(dict['apples']).toBe(5)
  })
})

describe('createDictionary', () => {
  it('создаёт словарь из массива пар', () => {
    const result = createDictionary([['a', 1], ['b', 2]])
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('создаёт пустой словарь из пустого массива', () => {
    const result = createDictionary([])
    expect(result).toEqual({})
  })

  it('перезаписывает дубликаты последним значением', () => {
    const result = createDictionary([['a', 1], ['a', 2]])
    expect(result).toEqual({ a: 2 })
  })
})

describe('getValueOrDefault', () => {
  const dict: Dictionary = { apples: 5, oranges: 3 }

  it('возвращает значение по существующему ключу', () => {
    expect(getValueOrDefault(dict, 'apples', 0)).toBe(5)
  })

  it('возвращает значение по умолчанию для несуществующего ключа', () => {
    expect(getValueOrDefault(dict, 'bananas', 10)).toBe(10)
  })
})

describe('sumValues', () => {
  it('суммирует все значения словаря', () => {
    const dict: Dictionary = { a: 10, b: 20, c: 30 }
    expect(sumValues(dict)).toBe(60)
  })

  it('возвращает 0 для пустого словаря', () => {
    expect(sumValues({})).toBe(0)
  })

  it('работает с одним элементом', () => {
    expect(sumValues({ only: 42 })).toBe(42)
  })
})
