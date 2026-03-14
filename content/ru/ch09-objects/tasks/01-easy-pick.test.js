import { describe, it, expect } from 'vitest'
import { pick } from './01-easy-pick.js'

describe('pick', () => {
  it('выбирает указанные ключи', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('возвращает один ключ', () => {
    expect(pick({ a: 1, b: 2 }, ['b'])).toEqual({ b: 2 })
  })

  it('игнорирует несуществующие ключи', () => {
    expect(pick({ a: 1 }, ['x', 'y'])).toEqual({})
  })

  it('пустой объект — возвращает {}', () => {
    expect(pick({}, ['a', 'b'])).toEqual({})
  })

  it('пустой массив ключей — возвращает {}', () => {
    expect(pick({ a: 1, b: 2 }, [])).toEqual({})
  })

  it('не изменяет исходный объект', () => {
    const obj = { a: 1, b: 2, c: 3 }
    pick(obj, ['a'])
    expect(obj).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('работает с разными типами значений', () => {
    const obj = { n: 42, s: 'hello', b: true, arr: [1, 2], obj: { x: 1 } }
    expect(pick(obj, ['n', 's', 'b'])).toEqual({ n: 42, s: 'hello', b: true })
  })
})
