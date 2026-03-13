import { describe, it, expect } from 'vitest'
import {
  inferConstString,
  inferLetString,
  inferConstNumber,
  inferLetNumber,
  inferConstArray,
  inferAsConstArray
} from './01-easy-infer-types'

describe('inferTypes', () => {
  it('const string сохраняет литеральный тип', () => {
    expect(inferConstString()).toBe('"hello"')
  })

  it('let string расширяется до string', () => {
    expect(inferLetString()).toBe('string')
  })

  it('const number сохраняет литеральный тип', () => {
    expect(inferConstNumber()).toBe('42')
  })

  it('let number расширяется до number', () => {
    expect(inferLetNumber()).toBe('number')
  })

  it('const массив — mutable number[]', () => {
    expect(inferConstArray()).toBe('number[]')
  })

  it('as const массив — readonly кортеж', () => {
    expect(inferAsConstArray()).toBe('readonly [1, 2, 3]')
  })
})
