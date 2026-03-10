import { describe, it, expect } from 'vitest'
import { findDeoptRisk } from './05-medium-deopt'

describe('findDeoptRisk', () => {
  const add = (a, b) => a + b

  it('стабильные типы → false', () => {
    expect(findDeoptRisk(add, [[1, 2], [3, 4], [5, 6]])).toBe(false)
  })

  it('смена типа аргумента → true', () => {
    expect(findDeoptRisk(add, [[1, 2], ['a', 'b']])).toBe(true)
  })

  it('смена типа только одного аргумента → true', () => {
    expect(findDeoptRisk(add, [[1, 2], [1, 'два']])).toBe(true)
  })

  it('один тестовый вызов → false (нет смены типов)', () => {
    expect(findDeoptRisk(add, [[1, 2]])).toBe(false)
  })

  it('пустой массив тестов → false', () => {
    expect(findDeoptRisk(add, [])).toBe(false)
  })

  it('объект и примитив → true', () => {
    const fn = (x) => x
    expect(findDeoptRisk(fn, [[1], [{ a: 1 }]])).toBe(true)
  })

  it('все строки → false', () => {
    expect(findDeoptRisk(add, [['a', 'b'], ['c', 'd'], ['e', 'f']])).toBe(false)
  })
})
