import { describe, it, expect } from 'vitest'
import { format } from './04-medium-overloads'

describe('format (перегрузки)', () => {
  describe('format(number)', () => {
    it('форматирует целое число с двумя знаками', () => {
      expect(format(3)).toBe('3.00')
    })

    it('форматирует дробное число', () => {
      expect(format(3.14159)).toBe('3.14')
    })

    it('форматирует ноль', () => {
      expect(format(0)).toBe('0.00')
    })

    it('форматирует отрицательное число', () => {
      expect(format(-7.5)).toBe('-7.50')
    })
  })

  describe('format(Date)', () => {
    it('форматирует дату в ДД.ММ.ГГГГ', () => {
      const date = new Date(2024, 0, 15) // 15 января 2024
      expect(format(date)).toBe('15.01.2024')
    })

    it('форматирует дату с однозначными днём и месяцем', () => {
      const date = new Date(2024, 2, 5) // 5 марта 2024
      expect(format(date)).toBe('05.03.2024')
    })

    it('форматирует дату 31 декабря', () => {
      const date = new Date(2023, 11, 31) // 31 декабря 2023
      expect(format(date)).toBe('31.12.2023')
    })
  })

  describe('format(string[])', () => {
    it('объединяет строки через запятую', () => {
      expect(format(['яблоко', 'банан', 'вишня'])).toBe('яблоко, банан, вишня')
    })

    it('возвращает одну строку без запятой', () => {
      expect(format(['один'])).toBe('один')
    })

    it('возвращает пустую строку для пустого массива', () => {
      expect(format([])).toBe('')
    })
  })
})
