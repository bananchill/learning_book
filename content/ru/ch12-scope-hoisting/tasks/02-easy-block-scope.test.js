import { describe, it, expect } from 'vitest'
import { blockScope } from './02-easy-block-scope'

describe('blockScope', () => {
  it('возвращает массив нужной длины', () => {
    expect(blockScope(3)).toHaveLength(3)
    expect(blockScope(5)).toHaveLength(5)
  })

  it('каждая функция возвращает свой индекс', () => {
    const fns = blockScope(3)
    expect(fns[0]()).toBe(0)
    expect(fns[1]()).toBe(1)
    expect(fns[2]()).toBe(2)
  })

  it('функции независимы (не разделяют переменную)', () => {
    const fns = blockScope(5)
    // Все должны возвращать разные значения
    const results = fns.map(f => f())
    expect(results).toEqual([0, 1, 2, 3, 4])
  })

  it('работает с n=1', () => {
    const fns = blockScope(1)
    expect(fns[0]()).toBe(0)
  })

  it('работает с n=0', () => {
    expect(blockScope(0)).toEqual([])
  })
})
