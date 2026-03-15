import { describe, it, expect } from 'vitest'
import { castToString, castToNumber, parseJsonAs } from './02-easy-type-cast.tsx'

describe('castToString', () => {
  it('возвращает строку без изменений', () => {
    expect(castToString('hello')).toBe('hello')
  })

  it('преобразует число в строку', () => {
    expect(castToString(42)).toBe('42')
  })

  it('преобразует boolean в строку', () => {
    expect(castToString(true)).toBe('true')
  })

  it('преобразует null в строку', () => {
    expect(castToString(null)).toBe('null')
  })
})

describe('castToNumber', () => {
  it('возвращает число без изменений', () => {
    expect(castToNumber(42)).toBe(42)
  })

  it('преобразует числовую строку', () => {
    expect(castToNumber('3.14')).toBeCloseTo(3.14)
  })

  it('возвращает NaN для нечисловой строки', () => {
    expect(castToNumber('abc')).toBeNaN()
  })

  it('возвращает NaN для объекта', () => {
    expect(castToNumber({})).toBeNaN()
  })
})

describe('parseJsonAs', () => {
  it('парсит объект из JSON', () => {
    const result = parseJsonAs<{ name: string; age: number }>(
      '{"name":"Алиса","age":25}'
    )
    expect(result.name).toBe('Алиса')
    expect(result.age).toBe(25)
  })

  it('парсит массив из JSON', () => {
    const result = parseJsonAs<number[]>('[1, 2, 3]')
    expect(result).toEqual([1, 2, 3])
  })

  it('парсит примитив из JSON', () => {
    const result = parseJsonAs<string>('"hello"')
    expect(result).toBe('hello')
  })

  it('бросает ошибку при невалидном JSON', () => {
    expect(() => parseJsonAs<unknown>('not json')).toThrow()
  })
})
