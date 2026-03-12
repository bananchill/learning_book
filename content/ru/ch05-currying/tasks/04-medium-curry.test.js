import { describe, it, expect } from 'vitest'
import { curry } from './04-medium-curry'

describe('curry', () => {
  const sum3 = (a, b, c) => a + b + c
  const sum2 = (a, b) => a + b

  it('каррирует функцию трёх аргументов — по одному', () => {
    expect(curry(sum3)(1)(2)(3)).toBe(6)
  })

  it('каррирует функцию трёх аргументов — два + один', () => {
    expect(curry(sum3)(1, 2)(3)).toBe(6)
  })

  it('каррирует функцию трёх аргументов — один + два', () => {
    expect(curry(sum3)(1)(2, 3)).toBe(6)
  })

  it('вызывает сразу, если все аргументы переданы', () => {
    expect(curry(sum3)(1, 2, 3)).toBe(6)
  })

  it('работает с функцией двух аргументов', () => {
    expect(curry(sum2)(10)(20)).toBe(30)
  })

  it('промежуточные вызовы возвращают функции', () => {
    const addTo1 = curry(sum3)(1)
    expect(typeof addTo1).toBe('function')

    const addTo1and2 = addTo1(2)
    expect(typeof addTo1and2).toBe('function')

    expect(addTo1and2(3)).toBe(6)
  })

  it('каждый curry создаёт независимую цепочку', () => {
    const curried = curry(sum3)
    const a = curried(1)
    const b = curried(10)
    expect(a(2)(3)).toBe(6)
    expect(b(20)(30)).toBe(60)
  })

  it('работает с функцией одного аргумента', () => {
    const identity = x => x
    expect(curry(identity)(42)).toBe(42)
  })

  it('сохраняет правильный порядок аргументов', () => {
    const concat = (a, b, c) => `${a}-${b}-${c}`
    expect(curry(concat)('a')('b')('c')).toBe('a-b-c')
  })
})
