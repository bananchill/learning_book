import { describe, it, expect } from 'vitest'
import { getTypeInfo } from './02-easy-typeof'

describe('getTypeInfo', () => {
  it('определяет тип числа', () => {
    expect(getTypeInfo(42)).toEqual({ type: 'number', isNull: false })
  })

  it('определяет тип строки', () => {
    expect(getTypeInfo('hello')).toEqual({ type: 'string', isNull: false })
  })

  it('определяет тип булева значения', () => {
    expect(getTypeInfo(true)).toEqual({ type: 'boolean', isNull: false })
  })

  it('определяет тип undefined', () => {
    expect(getTypeInfo(undefined)).toEqual({ type: 'undefined', isNull: false })
  })

  it('корректно обрабатывает null (особенность JS)', () => {
    // typeof null === 'object' — историческая ошибка JS
    expect(getTypeInfo(null)).toEqual({ type: 'object', isNull: true })
  })

  it('определяет тип объекта', () => {
    const result = getTypeInfo({})
    expect(result.type).toBe('object')
    expect(result.isNull).toBe(false)
  })

  it('определяет тип функции', () => {
    expect(getTypeInfo(() => {})).toEqual({ type: 'function', isNull: false })
  })
})
