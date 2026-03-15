import { describe, it, expect } from 'vitest'

// Эти тесты проверяют, что глобальные декларации написаны правильно.
// Тесты компилируются только если .d.ts корректен.

describe('глобальные декларации', () => {
  it('APP_VERSION -- строка', () => {
    // Проверяем, что тип объявлен как string
    const version: string = APP_VERSION
    expect(typeof version).toBe('string')
  })

  it('DEBUG -- boolean', () => {
    const debug: boolean = DEBUG
    expect(typeof debug).toBe('boolean')
  })

  it('formatCurrency принимает число и строку, возвращает строку', () => {
    const result: string = formatCurrency(100, 'USD')
    expect(typeof result).toBe('string')
  })

  it('getConfig возвращает string | undefined', () => {
    const result: string | undefined = getConfig('apiUrl')
    // Значение может быть строкой или undefined
    expect(result === undefined || typeof result === 'string').toBe(true)
  })

  it('AppSettings имеет методы get, set, reset', () => {
    const value: unknown = AppSettings.get('theme')
    AppSettings.set('theme', 'dark')
    AppSettings.reset()
    expect(true).toBe(true) // Компиляция -- основная проверка
  })
})
