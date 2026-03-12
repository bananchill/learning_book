import { describe, it, expect } from 'vitest'
import { partial } from './05-medium-partial'

describe('partial', () => {
  const add3 = (a, b, c) => a + b + c
  const greet = (greeting, name, punctuation) => `${greeting}, ${name}${punctuation}`

  it('фиксирует один аргумент', () => {
    expect(partial(add3, 1)(2, 3)).toBe(6)
  })

  it('фиксирует два аргумента', () => {
    expect(partial(add3, 1, 2)(3)).toBe(6)
  })

  it('фиксирует все аргументы', () => {
    expect(partial(add3, 1, 2, 3)()).toBe(6)
  })

  it('работает со строковыми аргументами', () => {
    const sayHello = partial(greet, 'Привет')
    expect(sayHello('мир', '!')).toBe('Привет, мир!')
  })

  it('создаёт независимые частично применённые функции', () => {
    const addOne = partial(add3, 1)
    const addTen = partial(add3, 10)
    expect(addOne(2, 3)).toBe(6)
    expect(addTen(20, 30)).toBe(60)
  })

  it('без фиксированных аргументов работает как обычный вызов', () => {
    const fn = partial(add3)
    expect(fn(1, 2, 3)).toBe(6)
  })

  it('сохраняет порядок аргументов', () => {
    const concat = (a, b, c, d) => `${a}${b}${c}${d}`
    expect(partial(concat, 'a', 'b')('c', 'd')).toBe('abcd')
  })
})
