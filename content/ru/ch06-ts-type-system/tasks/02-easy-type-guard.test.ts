import { describe, it, expect } from 'vitest'
import { isNotNull, filterNulls } from './02-easy-type-guard'

describe('isNotNull', () => {
  it('возвращает true для не-null значений', () => {
    expect(isNotNull('hello')).toBe(true)
    expect(isNotNull(42)).toBe(true)
    expect(isNotNull(0)).toBe(true)
    expect(isNotNull('')).toBe(true)
    expect(isNotNull(false)).toBe(true)
  })

  it('возвращает false для null', () => {
    expect(isNotNull(null)).toBe(false)
  })
})

describe('filterNulls', () => {
  it('убирает null из массива строк', () => {
    const input: (string | null)[] = ['hello', null, 'world', null]
    expect(filterNulls(input)).toEqual(['hello', 'world'])
  })

  it('убирает null из массива чисел', () => {
    const input: (number | null)[] = [1, null, 2, 3, null]
    expect(filterNulls(input)).toEqual([1, 2, 3])
  })

  it('возвращает пустой массив для массива из null', () => {
    expect(filterNulls([null, null])).toEqual([])
  })

  it('возвращает копию для массива без null', () => {
    expect(filterNulls([1, 2, 3])).toEqual([1, 2, 3])
  })
})
