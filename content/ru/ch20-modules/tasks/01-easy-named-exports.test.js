import { describe, it, expect } from 'vitest'
import { LOCALE, formatDate, formatCurrency } from './01-easy-named-exports.js'

describe('LOCALE', () => {
  it('равна "ru-RU"', () => {
    expect(LOCALE).toBe('ru-RU')
  })
})

describe('formatDate', () => {
  it('форматирует дату в русский формат по умолчанию', () => {
    const date = new Date('2024-01-15T12:00:00')
    const result = formatDate(date)
    // Проверяем наличие ключевых частей (точный формат зависит от окружения)
    expect(result).toContain('2024')
    expect(result).toMatch(/январ/i) // январь или января
    expect(result).toContain('15')
  })

  it('принимает кастомную локаль', () => {
    const date = new Date('2024-06-01T12:00:00')
    const result = formatDate(date, 'en-US')
    expect(result).toContain('2024')
    expect(result).toMatch(/june/i)
  })

  it('работает с текущей датой без ошибок', () => {
    expect(() => formatDate(new Date())).not.toThrow()
  })
})

describe('formatCurrency', () => {
  it('форматирует рубли по умолчанию', () => {
    const result = formatCurrency(1500)
    expect(result).toContain('1')
    expect(result).toContain('500')
    // Символ рубля или 'RUB'
    expect(result).toMatch(/₽|RUB/)
  })

  it('форматирует доллары с другой локалью', () => {
    const result = formatCurrency(100, 'USD', 'en-US')
    expect(result).toContain('100')
    expect(result).toMatch(/\$|USD/)
  })

  it('форматирует нулевое значение', () => {
    expect(() => formatCurrency(0)).not.toThrow()
  })
})
