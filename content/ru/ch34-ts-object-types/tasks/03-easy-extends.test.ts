import { describe as desc, it, expect } from 'vitest'
import { getArea, describe as describeShape, type Circle, type Rectangle } from './03-easy-extends'

desc('getArea', () => {
  it('вычисляет площадь круга', () => {
    const circle: Circle = { kind: 'circle', color: 'красный', radius: 5 }
    expect(getArea(circle)).toBeCloseTo(Math.PI * 25)
  })

  it('вычисляет площадь круга с радиусом 1', () => {
    const circle: Circle = { kind: 'circle', color: 'синий', radius: 1 }
    expect(getArea(circle)).toBeCloseTo(Math.PI)
  })

  it('вычисляет площадь прямоугольника', () => {
    const rect: Rectangle = { kind: 'rectangle', color: 'зелёный', width: 10, height: 5 }
    expect(getArea(rect)).toBe(50)
  })

  it('вычисляет площадь квадрата (прямоугольник)', () => {
    const square: Rectangle = { kind: 'rectangle', color: 'жёлтый', width: 7, height: 7 }
    expect(getArea(square)).toBe(49)
  })
})

desc('describeShape', () => {
  it('описывает круг', () => {
    const circle: Circle = { kind: 'circle', color: 'красный', radius: 5 }
    expect(describeShape(circle)).toBe('красный круг с радиусом 5')
  })

  it('описывает прямоугольник', () => {
    const rect: Rectangle = { kind: 'rectangle', color: 'зелёный', width: 10, height: 5 }
    expect(describeShape(rect)).toBe('зелёный прямоугольник 10x5')
  })
})
