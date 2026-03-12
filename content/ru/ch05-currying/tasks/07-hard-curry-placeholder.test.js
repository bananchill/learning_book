import { describe, it, expect } from 'vitest'
import { curryWithPlaceholder, _ } from './07-hard-curry-placeholder'

describe('curryWithPlaceholder', () => {
  const sum3 = (a, b, c) => a + b + c
  const sub = (a, b) => a - b

  it('работает как обычный curry без плейсхолдеров', () => {
    expect(curryWithPlaceholder(sum3)(1)(2)(3)).toBe(6)
  })

  it('работает с передачей нескольких аргументов', () => {
    expect(curryWithPlaceholder(sum3)(1, 2)(3)).toBe(6)
  })

  it('пропускает первый аргумент через плейсхолдер', () => {
    expect(curryWithPlaceholder(sub)(_, 3)(10)).toBe(7)
  })

  it('пропускает аргумент в середине', () => {
    expect(curryWithPlaceholder(sum3)(1, _, 3)(2)).toBe(6)
  })

  it('пропускает несколько аргументов', () => {
    expect(curryWithPlaceholder(sum3)(_, _, 3)(1)(2)).toBe(6)
  })

  it('все аргументы — плейсхолдеры', () => {
    expect(curryWithPlaceholder(sum3)(_, _, _)(1)(2)(3)).toBe(6)
  })

  it('плейсхолдер в начале цепочки', () => {
    const concat = (a, b, c) => `${a}${b}${c}`
    expect(curryWithPlaceholder(concat)(_, 'b')('a')('c')).toBe('abc')
  })

  it('создаёт переиспользуемые частично применённые функции', () => {
    const subtractFrom10 = curryWithPlaceholder(sub)(10)
    expect(subtractFrom10(3)).toBe(7)
    expect(subtractFrom10(7)).toBe(3)

    const subtractFive = curryWithPlaceholder(sub)(_, 5)
    expect(subtractFive(10)).toBe(5)
    expect(subtractFive(20)).toBe(15)
  })
})
