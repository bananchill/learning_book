import { describe, it, expect } from 'vitest'
import { curry } from './05-medium-curry'

describe('curry', () => {
  const sum3 = (a, b, c) => a + b + c

  it('полное каррирование', () => {
    expect(curry(sum3)(1)(2)(3)).toBe(6)
  })

  it('частичное применение', () => {
    expect(curry(sum3)(1, 2)(3)).toBe(6)
  })

  it('все аргументы сразу', () => {
    expect(curry(sum3)(1, 2, 3)).toBe(6)
  })

  it('работает с функцией двух аргументов', () => {
    const add = (a, b) => a + b
    expect(curry(add)(3)(4)).toBe(7)
  })

  it('функция без аргументов', () => {
    const hello = () => 'hello'
    expect(curry(hello)()).toBe('hello')
  })
})
