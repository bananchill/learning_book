import { describe, it, expect } from 'vitest'

// Тесты проверяют корректность деклараций для модуля "math-utils".
// Компиляция этого файла -- главная проверка.

describe('модуль math-utils', () => {
  it('Point содержит x и y типа number', () => {
    // Импорт из объявленного модуля
    type TestPoint = import('math-utils').Point
    const p: TestPoint = { x: 1, y: 2 }
    expect(p.x).toBe(1)
    expect(p.y).toBe(2)
  })

  it('distance принимает две точки и возвращает число', () => {
    type Dist = typeof import('math-utils').distance
    // Проверяем, что сигнатура соответствует ожидаемой
    const fn: Dist = (a, b) => Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
    expect(fn({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5)
  })

  it('clamp ограничивает значение', () => {
    type Clamp = typeof import('math-utils').clamp
    const fn: Clamp = (v, min, max) => Math.min(Math.max(v, min), max)
    expect(fn(15, 0, 10)).toBe(10)
    expect(fn(-5, 0, 10)).toBe(0)
    expect(fn(5, 0, 10)).toBe(5)
  })

  it('lerp выполняет интерполяцию', () => {
    type Lerp = typeof import('math-utils').lerp
    const fn: Lerp = (start, end, t) => start + (end - start) * t
    expect(fn(0, 10, 0.5)).toBe(5)
  })

  it('PI -- число', () => {
    type PI = typeof import('math-utils').PI
    const pi: PI = 3.14159
    expect(typeof pi).toBe('number')
  })
})
