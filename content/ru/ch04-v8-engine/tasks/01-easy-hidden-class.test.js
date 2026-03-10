import { describe, it, expect } from 'vitest'
import { sameHiddenClass } from './01-easy-hidden-class'

describe('sameHiddenClass', () => {
  it('одинаковые свойства в одинаковом порядке → true', () => {
    expect(sameHiddenClass({ x: 1, y: 2 }, { x: 3, y: 4 })).toBe(true)
  })

  it('одинаковые свойства в разном порядке → false', () => {
    expect(sameHiddenClass({ x: 1, y: 2 }, { y: 3, x: 4 })).toBe(false)
  })

  it('разные свойства → false', () => {
    expect(sameHiddenClass({ x: 1, y: 2 }, { x: 1, z: 2 })).toBe(false)
  })

  it('разное количество свойств → false', () => {
    expect(sameHiddenClass({ x: 1 }, { x: 1, y: 2 })).toBe(false)
  })

  it('пустые объекты → true', () => {
    expect(sameHiddenClass({}, {})).toBe(true)
  })

  it('значения не влияют — важен только порядок ключей', () => {
    expect(sameHiddenClass({ a: 'hello', b: 42 }, { a: true, b: null })).toBe(true)
  })
})
