import { describe, it, expect } from 'vitest'
import { isValidColor, getColor, theme } from './02-easy-keys-union'

describe('isValidColor', () => {
  it('возвращает true для валидных цветов', () => {
    expect(isValidColor('primary')).toBe(true)
    expect(isValidColor('secondary')).toBe(true)
    expect(isValidColor('danger')).toBe(true)
    expect(isValidColor('success')).toBe(true)
    expect(isValidColor('warning')).toBe(true)
  })

  it('возвращает false для невалидных цветов', () => {
    expect(isValidColor('purple')).toBe(false)
    expect(isValidColor('red')).toBe(false)
    expect(isValidColor('')).toBe(false)
    expect(isValidColor('PRIMARY')).toBe(false)
  })
})

describe('getColor', () => {
  it('возвращает hex-значение для каждого цвета', () => {
    expect(getColor('primary')).toBe('#3490dc')
    expect(getColor('secondary')).toBe('#ffed4a')
    expect(getColor('danger')).toBe('#e3342f')
    expect(getColor('success')).toBe('#38c172')
    expect(getColor('warning')).toBe('#f6993f')
  })

  it('возвращает значение, совпадающее с объектом theme', () => {
    const keys = Object.keys(theme) as (keyof typeof theme)[]
    for (const key of keys) {
      expect(getColor(key)).toBe(theme[key])
    }
  })
})
