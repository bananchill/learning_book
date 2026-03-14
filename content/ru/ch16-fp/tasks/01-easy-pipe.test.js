import { describe, it, expect } from 'vitest'
import { pipe } from './01-easy-pipe'

describe('pipe', () => {
  const double = x => x * 2
  const addOne = x => x + 1
  const square = x => x ** 2

  it('применяет одну функцию', () => {
    expect(pipe(double)(5)).toBe(10)
  })

  it('применяет две функции слева направо', () => {
    expect(pipe(double, addOne)(3)).toBe(7) // double(3)=6, addOne(6)=7
  })

  it('применяет три функции слева направо', () => {
    expect(pipe(double, addOne, square)(3)).toBe(49) // 6 → 7 → 49
  })

  it('работает со строками', () => {
    const trim = s => s.trim()
    const upper = s => s.toUpperCase()
    const exclaim = s => s + '!'

    expect(pipe(trim, upper, exclaim)('  привет  ')).toBe('ПРИВЕТ!')
  })

  it('без функций возвращает значение as-is', () => {
    expect(pipe()(42)).toBe(42)
  })

  it('не мутирует массив функций', () => {
    const fns = [double, addOne]
    const transform = pipe(...fns)
    transform(5)
    expect(fns).toHaveLength(2)
  })
})
