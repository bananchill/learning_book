import { describe, it, expect } from 'vitest'
import { Shape, Rectangle, Square } from './03-medium-shapes'

describe('Shape', () => {
  it('имеет цвет по умолчанию black', () => {
    const s = new Shape()
    expect(s.color).toBe('black')
  })

  it('describe возвращает строку с цветом', () => {
    const s = new Shape('red')
    expect(s.describe()).toBe('Фигура: red')
  })
})

describe('Rectangle', () => {
  it('вычисляет площадь', () => {
    const r = new Rectangle(4, 5, 'blue')
    expect(r.area()).toBe(20)
  })

  it('describe включает цвет и площадь', () => {
    const r = new Rectangle(4, 5, 'blue')
    expect(r.describe()).toBe('Прямоугольник: blue, площадь 20')
  })

  it('является экземпляром Shape', () => {
    expect(new Rectangle(1, 2) instanceof Shape).toBe(true)
  })
})

describe('Square', () => {
  it('стороны равны переданному side', () => {
    const s = new Square(6, 'green')
    expect(s.area()).toBe(36)
  })

  it('является экземпляром Rectangle', () => {
    expect(new Square(3) instanceof Rectangle).toBe(true)
  })

  it('является экземпляром Shape', () => {
    expect(new Square(3) instanceof Shape).toBe(true)
  })

  it('describe работает через наследование', () => {
    const s = new Square(4, 'purple')
    expect(s.describe()).toContain('16')
    expect(s.describe()).toContain('purple')
  })
})
