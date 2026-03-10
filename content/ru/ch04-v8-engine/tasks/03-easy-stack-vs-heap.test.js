import { describe, it, expect } from 'vitest'
import { classifyStorage } from './03-easy-stack-vs-heap'

describe('classifyStorage', () => {
  it('числа → stack', () => {
    expect(classifyStorage(42)).toBe('stack')
    expect(classifyStorage(3.14)).toBe('stack')
    expect(classifyStorage(0)).toBe('stack')
    expect(classifyStorage(-1)).toBe('stack')
  })

  it('строки → stack', () => {
    expect(classifyStorage('hello')).toBe('stack')
    expect(classifyStorage('')).toBe('stack')
  })

  it('boolean → stack', () => {
    expect(classifyStorage(true)).toBe('stack')
    expect(classifyStorage(false)).toBe('stack')
  })

  it('undefined → stack', () => {
    expect(classifyStorage(undefined)).toBe('stack')
  })

  it('null → stack', () => {
    expect(classifyStorage(null)).toBe('stack')
  })

  it('symbol → stack', () => {
    expect(classifyStorage(Symbol('test'))).toBe('stack')
  })

  it('bigint → stack', () => {
    expect(classifyStorage(42n)).toBe('stack')
  })

  it('объект → heap', () => {
    expect(classifyStorage({ x: 1 })).toBe('heap')
    expect(classifyStorage({})).toBe('heap')
  })

  it('массив → heap', () => {
    expect(classifyStorage([1, 2, 3])).toBe('heap')
    expect(classifyStorage([])).toBe('heap')
  })

  it('функция → heap', () => {
    expect(classifyStorage(() => {})).toBe('heap')
    expect(classifyStorage(function () {})).toBe('heap')
  })
})
