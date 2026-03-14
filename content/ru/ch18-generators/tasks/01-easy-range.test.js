import { describe, it, expect } from 'vitest'
import { range } from './01-easy-range.js'

describe('range', () => {
  it('генерирует числа от start до end с шагом 1', () => {
    expect([...range(1, 5)]).toEqual([1, 2, 3, 4])
  })

  it('генерирует числа с пользовательским шагом', () => {
    expect([...range(0, 10, 2)]).toEqual([0, 2, 4, 6, 8])
  })

  it('поддерживает отрицательный шаг', () => {
    expect([...range(5, 1, -1)]).toEqual([5, 4, 3, 2])
  })

  it('возвращает пустой диапазон когда start === end', () => {
    expect([...range(0, 0)]).toEqual([])
  })

  it('возвращает пустой диапазон когда условие сразу не выполняется', () => {
    expect([...range(5, 1)]).toEqual([]) // шаг 1, но start > end
  })

  it('работает с for...of', () => {
    const result = []
    for (const n of range(0, 3)) {
      result.push(n)
    }
    expect(result).toEqual([0, 1, 2])
  })

  it('является генератором (возвращает итератор)', () => {
    const gen = range(0, 3)
    expect(gen.next()).toEqual({ value: 0, done: false })
    expect(gen.next()).toEqual({ value: 1, done: false })
    expect(gen.next()).toEqual({ value: 2, done: false })
    expect(gen.next()).toEqual({ value: undefined, done: true })
  })
})
