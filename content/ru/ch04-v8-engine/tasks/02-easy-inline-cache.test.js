import { describe, it, expect } from 'vitest'
import { classifyIC } from './02-easy-inline-cache'

describe('classifyIC', () => {
  it('один shape → monomorphic', () => {
    expect(classifyIC([
      { x: 1, y: 2 },
      { x: 3, y: 4 },
      { x: 5, y: 6 },
    ])).toBe('monomorphic')
  })

  it('два shape → polymorphic', () => {
    expect(classifyIC([
      { x: 1, y: 2 },
      { x: 1, z: 3 },
    ])).toBe('polymorphic')
  })

  it('четыре shape → polymorphic', () => {
    expect(classifyIC([
      { a: 1 },
      { b: 1 },
      { c: 1 },
      { d: 1 },
    ])).toBe('polymorphic')
  })

  it('пять shape → megamorphic', () => {
    expect(classifyIC([
      { a: 1 },
      { b: 1 },
      { c: 1 },
      { d: 1 },
      { e: 1 },
    ])).toBe('megamorphic')
  })

  it('одинаковые ключи в разном порядке — разные shape', () => {
    expect(classifyIC([
      { x: 1, y: 2 },
      { y: 1, x: 2 },
    ])).toBe('polymorphic')
  })

  it('один объект → monomorphic', () => {
    expect(classifyIC([{ x: 1 }])).toBe('monomorphic')
  })
})
