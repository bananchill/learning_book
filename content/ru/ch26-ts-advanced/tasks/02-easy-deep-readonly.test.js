import { describe, it, expect } from 'vitest'
import { deepFreeze } from './02-easy-deep-readonly.js'

describe('deepFreeze', () => {
  it('замораживает объект верхнего уровня', () => {
    const obj = { a: 1, b: 2 }
    deepFreeze(obj)
    expect(Object.isFrozen(obj)).toBe(true)
  })

  it('замораживает вложенные объекты', () => {
    const obj = { nested: { value: 42 } }
    deepFreeze(obj)
    expect(Object.isFrozen(obj.nested)).toBe(true)
  })

  it('замораживает глубоко вложенные объекты', () => {
    const obj = { a: { b: { c: { value: 1 } } } }
    deepFreeze(obj)
    expect(Object.isFrozen(obj.a.b.c)).toBe(true)
  })

  it('возвращает тот же объект', () => {
    const obj = { x: 1 }
    const result = deepFreeze(obj)
    expect(result).toBe(obj)
  })

  it('в строгом режиме бросает ошибку при попытке изменить', () => {
    const obj = deepFreeze({ value: 1, nested: { x: 2 } })
    expect(() => {
      'use strict'
      // @ts-ignore
      obj.value = 99
    }).toThrow()
  })

  it('не падает на примитивных значениях в свойствах', () => {
    const obj = { num: 42, str: 'hello', bool: true, nil: null }
    expect(() => deepFreeze(obj)).not.toThrow()
    expect(Object.isFrozen(obj)).toBe(true)
  })
})
