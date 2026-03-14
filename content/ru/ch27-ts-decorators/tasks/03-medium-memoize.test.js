import { describe, it, expect, vi } from 'vitest'
import { memoize } from './03-medium-memoize.js'

// Вспомогательная функция для применения декоратора
function applyMemoize(instance, methodName) {
  const proto = Object.getPrototypeOf(instance)
  const descriptor = Object.getOwnPropertyDescriptor(proto, methodName)
  const newDescriptor = memoize(proto, methodName, descriptor)
  if (newDescriptor) {
    Object.defineProperty(proto, methodName, newDescriptor)
  }
}

describe('memoize decorator', () => {
  it('возвращает правильный результат', () => {
    class Calc {
      multiply(a, b) { return a * b }
    }

    const calc = new Calc()
    applyMemoize(calc, 'multiply')
    expect(calc.multiply(3, 4)).toBe(12)
  })

  it('вызывает оригинальный метод только один раз для одинаковых аргументов', () => {
    const spy = vi.fn((x) => x * x)

    class Squarer {
      square(x) { return spy(x) }
    }

    const s = new Squarer()
    applyMemoize(s, 'square')

    s.square(5)
    s.square(5)
    s.square(5)

    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('вычисляет заново для разных аргументов', () => {
    const spy = vi.fn((x) => x + 1)

    class Incrementer {
      inc(x) { return spy(x) }
    }

    const i = new Incrementer()
    applyMemoize(i, 'inc')

    i.inc(1)
    i.inc(2)
    i.inc(3)

    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('разные экземпляры имеют отдельные кэши', () => {
    const spy = vi.fn((x) => x)

    class Service {
      process(x) { return spy(x) }
    }

    const s1 = new Service()
    const s2 = new Service()
    applyMemoize(s1, 'process')
    applyMemoize(s2, 'process')

    s1.process(10)
    s2.process(10)

    // Каждый экземпляр вычисляет независимо
    expect(spy).toHaveBeenCalledTimes(2)
  })
})
