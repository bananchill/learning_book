import { describe, it, expect } from 'vitest'
import { filter } from './03-easy-filter'

describe('filter', () => {
  it('фильтрует числа больше 2', () => {
    expect(filter(x => x > 2)([1, 2, 3, 4])).toEqual([3, 4])
  })

  it('фильтрует чётные числа', () => {
    expect(filter(x => x % 2 === 0)([1, 2, 3, 4])).toEqual([2, 4])
  })

  it('возвращает пустой массив, если ничего не подходит', () => {
    expect(filter(x => x > 10)([1, 2, 3])).toEqual([])
  })

  it('возвращает все элементы, если все подходят', () => {
    expect(filter(x => x > 0)([1, 2, 3])).toEqual([1, 2, 3])
  })

  it('работает со строками', () => {
    expect(filter(s => s.length > 3)(['кот', 'собака', 'да', 'медведь'])).toEqual(['собака', 'медведь'])
  })

  it('промежуточный вызов создаёт переиспользуемый фильтр', () => {
    const isPositive = filter(x => x > 0)
    expect(isPositive([-1, 0, 1, 2])).toEqual([1, 2])
    expect(isPositive([-5, -3, 7])).toEqual([7])
  })

  it('работает с пустым массивом', () => {
    expect(filter(x => x > 0)([])).toEqual([])
  })
})
