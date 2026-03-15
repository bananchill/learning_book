import { describe, it, expect } from 'vitest'
import { describeList, describeUser, sum, createPoint, pointFromArray, tupleToObject } from './05-medium-rest-destructuring'

describe('describeList', () => {
  it('описывает список с несколькими элементами', () => {
    expect(describeList('a', 'b', 'c')).toBe('первый: a, остальные: b, c')
  })

  it('описывает список с одним элементом', () => {
    expect(describeList('один')).toBe('первый: один, остальные: нет')
  })

  it('описывает список с множеством элементов', () => {
    expect(describeList('x', 'y', 'z', 'w')).toBe('первый: x, остальные: y, z, w')
  })
})

describe('describeUser', () => {
  it('описывает пользователя с городом', () => {
    expect(describeUser({ name: 'Алиса', age: 25, city: 'Питер' }))
      .toBe('Алиса, 25 лет, Питер')
  })

  it('использует город по умолчанию', () => {
    expect(describeUser({ name: 'Боб', age: 30 }))
      .toBe('Боб, 30 лет, Москва')
  })
})

describe('sum', () => {
  it('суммирует числа', () => {
    expect(sum(1, 2, 3)).toBe(6)
  })

  it('возвращает 0 для пустого вызова', () => {
    expect(sum()).toBe(0)
  })

  it('работает с одним числом', () => {
    expect(sum(42)).toBe(42)
  })

  it('работает с отрицательными числами', () => {
    expect(sum(-1, -2, 3)).toBe(0)
  })
})

describe('pointFromArray', () => {
  it('создаёт точку из массива координат', () => {
    expect(pointFromArray([10, 20])).toEqual({ x: 10, y: 20 })
  })

  it('работает с нулевыми координатами', () => {
    expect(pointFromArray([0, 0])).toEqual({ x: 0, y: 0 })
  })
})

describe('tupleToObject', () => {
  it('преобразует кортеж в объект', () => {
    expect(tupleToObject(['ширина', 100])).toEqual({ name: 'ширина', value: 100 })
  })

  it('работает с другими значениями', () => {
    expect(tupleToObject(['высота', 200])).toEqual({ name: 'высота', value: 200 })
  })
})
