import { describe, it, expect } from 'vitest'
import { curry2 } from './01-easy-curry2'

describe('curry2', () => {
  it('каррирует функцию сложения', () => {
    const add = (a, b) => a + b
    expect(curry2(add)(1)(2)).toBe(3)
  })

  it('каррирует функцию умножения', () => {
    const multiply = (a, b) => a * b
    expect(curry2(multiply)(3)(4)).toBe(12)
  })

  it('работает со строками', () => {
    const greet = (greeting, name) => `${greeting}, ${name}!`
    expect(curry2(greet)('Привет')('мир')).toBe('Привет, мир!')
  })

  it('промежуточный вызов возвращает функцию', () => {
    const add = (a, b) => a + b
    const addFive = curry2(add)(5)
    expect(typeof addFive).toBe('function')
    expect(addFive(3)).toBe(8)
    expect(addFive(10)).toBe(15)
  })

  it('каждый вызов curry2 создаёт независимую функцию', () => {
    const add = (a, b) => a + b
    const addOne = curry2(add)(1)
    const addTen = curry2(add)(10)
    expect(addOne(5)).toBe(6)
    expect(addTen(5)).toBe(15)
  })
})
