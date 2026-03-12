import { describe, it, expect } from 'vitest'
import { sum } from './08-hard-infinite-sum'

describe('sum — бесконечное каррирование', () => {
  it('один аргумент', () => {
    expect(sum(5)()).toBe(5)
  })

  it('два аргумента', () => {
    expect(sum(1)(2)()).toBe(3)
  })

  it('три аргумента', () => {
    expect(sum(1)(2)(3)()).toBe(6)
  })

  it('много аргументов', () => {
    expect(sum(1)(2)(3)(4)(5)()).toBe(15)
  })

  it('работает с нулём', () => {
    expect(sum(0)(0)(0)()).toBe(0)
  })

  it('работает с отрицательными числами', () => {
    expect(sum(10)(-3)(-2)()).toBe(5)
  })

  it('промежуточные вызовы возвращают функцию', () => {
    const partial = sum(1)(2)
    expect(typeof partial).toBe('function')
    expect(partial(3)()).toBe(6)
  })

  it('каждая цепочка независима', () => {
    const a = sum(10)
    const b = sum(100)
    expect(a(5)()).toBe(15)
    expect(b(50)()).toBe(150)
  })
})
