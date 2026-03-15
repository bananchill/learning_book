import { describe, it, expect, vi } from 'vitest'
import { greetUser, filterNumbers, mapStrings, sortNumbers } from './01-easy-fn-types'

describe('greetUser', () => {
  it('вызывает коллбэк с приветствием', () => {
    const cb = vi.fn()
    greetUser('Алиса', cb)
    expect(cb).toHaveBeenCalledWith('Привет, Алиса!')
  })
})

describe('filterNumbers', () => {
  it('фильтрует числа по предикату', () => {
    const result = filterNumbers([1, 2, 3, 4, 5], (n: number) => n > 3)
    expect(result).toEqual([4, 5])
  })

  it('возвращает пустой массив, если ничего не подходит', () => {
    const result = filterNumbers([1, 2, 3], (n: number) => n > 10)
    expect(result).toEqual([])
  })
})

describe('mapStrings', () => {
  it('преобразует строки с индексами', () => {
    const result = mapStrings(['a', 'b', 'c'], (s: string, i: number) => `${i}:${s}`)
    expect(result).toEqual(['0:a', '1:b', '2:c'])
  })
})

describe('sortNumbers', () => {
  it('сортирует числа по компаратору (по возрастанию)', () => {
    const result = sortNumbers([3, 1, 2], (a: number, b: number) => a - b)
    expect(result).toEqual([1, 2, 3])
  })

  it('сортирует числа по компаратору (по убыванию)', () => {
    const result = sortNumbers([3, 1, 2], (a: number, b: number) => b - a)
    expect(result).toEqual([3, 2, 1])
  })

  it('не мутирует оригинальный массив', () => {
    const original = [3, 1, 2]
    sortNumbers(original, (a: number, b: number) => a - b)
    expect(original).toEqual([3, 1, 2])
  })
})
