import { describe, it, expect } from 'vitest'
import { add, multiply, subtract } from './02-easy-calculator'

describe('каррированный калькулятор', () => {
  describe('add', () => {
    it('складывает два числа', () => {
      expect(add(2)(3)).toBe(5)
    })

    it('работает с нулём', () => {
      expect(add(0)(5)).toBe(5)
    })

    it('работает с отрицательными числами', () => {
      expect(add(-3)(7)).toBe(4)
    })

    it('промежуточный вызов возвращает функцию', () => {
      const addTen = add(10)
      expect(typeof addTen).toBe('function')
      expect(addTen(5)).toBe(15)
    })
  })

  describe('multiply', () => {
    it('умножает два числа', () => {
      expect(multiply(3)(4)).toBe(12)
    })

    it('умножение на ноль', () => {
      expect(multiply(5)(0)).toBe(0)
    })

    it('промежуточный вызов создаёт множитель', () => {
      const double = multiply(2)
      expect(double(7)).toBe(14)
      expect(double(10)).toBe(20)
    })
  })

  describe('subtract', () => {
    it('вычитает второе из первого', () => {
      expect(subtract(10)(3)).toBe(7)
    })

    it('результат может быть отрицательным', () => {
      expect(subtract(3)(10)).toBe(-7)
    })

    it('вычитание нуля', () => {
      expect(subtract(5)(0)).toBe(5)
    })
  })
})
