import { describe, it, expect } from 'vitest'
import { compose, pipe } from './06-hard-compose-pipe'

describe('compose', () => {
  const double = x => x * 2
  const addOne = x => x + 1
  const square = x => x * x

  it('применяет функции справа налево', () => {
    // compose(addOne, double)(5) = addOne(double(5)) = addOne(10) = 11
    expect(compose(addOne, double)(5)).toBe(11)
  })

  it('работает с тремя функциями', () => {
    // compose(addOne, double, square)(3) = addOne(double(square(3))) = addOne(double(9)) = addOne(18) = 19
    expect(compose(addOne, double, square)(3)).toBe(19)
  })

  it('одна функция — просто вызов', () => {
    expect(compose(double)(5)).toBe(10)
  })

  it('работает со строками', () => {
    const exclaim = s => s + '!'
    const upper = s => s.toUpperCase()
    const trim = s => s.trim()
    // compose(exclaim, upper, trim)('  привет  ') = exclaim(upper('привет')) = exclaim('ПРИВЕТ') = 'ПРИВЕТ!'
    expect(compose(exclaim, upper, trim)('  привет  ')).toBe('ПРИВЕТ!')
  })

  it('порядок имеет значение', () => {
    // compose(square, addOne)(3) = square(addOne(3)) = square(4) = 16
    expect(compose(square, addOne)(3)).toBe(16)
    // compose(addOne, square)(3) = addOne(square(3)) = addOne(9) = 10
    expect(compose(addOne, square)(3)).toBe(10)
  })
})

describe('pipe', () => {
  const double = x => x * 2
  const addOne = x => x + 1
  const square = x => x * x

  it('применяет функции слева направо', () => {
    // pipe(double, addOne)(5) = addOne(double(5)) = addOne(10) = 11
    expect(pipe(double, addOne)(5)).toBe(11)
  })

  it('работает с тремя функциями', () => {
    // pipe(square, double, addOne)(3) = addOne(double(square(3))) = addOne(double(9)) = addOne(18) = 19
    expect(pipe(square, double, addOne)(3)).toBe(19)
  })

  it('одна функция — просто вызов', () => {
    expect(pipe(double)(5)).toBe(10)
  })

  it('pipe — это compose в обратном порядке', () => {
    const fns = [double, addOne, square]
    const pipeResult = pipe(...fns)(2)
    const composeResult = compose(...[...fns].reverse())(2)
    expect(pipeResult).toBe(composeResult)
  })

  it('порядок имеет значение', () => {
    // pipe(addOne, square)(3) = square(addOne(3)) = square(4) = 16
    expect(pipe(addOne, square)(3)).toBe(16)
    // pipe(square, addOne)(3) = addOne(square(3)) = addOne(9) = 10
    expect(pipe(square, addOne)(3)).toBe(10)
  })
})
