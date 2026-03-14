import { describe, it, expect } from 'vitest'
import { deepClone } from './03-medium-deep-clone.js'

describe('deepClone', () => {
  it('клонирует плоский объект', () => {
    const obj = { a: 1, b: 'hello', c: true }
    const cloned = deepClone(obj)
    expect(cloned).toEqual(obj)
    expect(cloned).not.toBe(obj) // новая ссылка
  })

  it('клонирует вложенный объект', () => {
    const obj = { x: { y: { z: 42 } } }
    const cloned = deepClone(obj)
    cloned.x.y.z = 99
    expect(obj.x.y.z).toBe(42) // исходник не изменился
  })

  it('клонирует массив', () => {
    const arr = [1, 2, 3]
    const cloned = deepClone(arr)
    expect(cloned).toEqual([1, 2, 3])
    expect(cloned).not.toBe(arr)
  })

  it('клонирует вложенный массив', () => {
    const arr = [[1, 2], [3, 4]]
    const cloned = deepClone(arr)
    cloned[0][0] = 99
    expect(arr[0][0]).toBe(1) // исходник не изменился
  })

  it('клонирует объект с массивом', () => {
    const obj = { name: 'Иван', tags: ['js', 'ts'] }
    const cloned = deepClone(obj)
    cloned.tags.push('vue')
    expect(obj.tags).toEqual(['js', 'ts']) // исходник не изменился
  })

  it('возвращает примитивы как есть', () => {
    expect(deepClone(42)).toBe(42)
    expect(deepClone('hello')).toBe('hello')
    expect(deepClone(true)).toBe(true)
    expect(deepClone(null)).toBe(null)
    expect(deepClone(undefined)).toBe(undefined)
  })

  it('клонирует смешанную структуру', () => {
    const obj = {
      id: 1,
      user: { name: 'Иван', roles: ['admin', 'user'] },
      scores: [10, 20, 30]
    }
    const cloned = deepClone(obj)
    cloned.user.name = 'Мария'
    cloned.user.roles.push('moderator')
    cloned.scores[0] = 999
    expect(obj.user.name).toBe('Иван')
    expect(obj.user.roles).toEqual(['admin', 'user'])
    expect(obj.scores[0]).toBe(10)
  })
})
