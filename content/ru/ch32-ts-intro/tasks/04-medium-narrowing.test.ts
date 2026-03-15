import { describe, it, expect } from 'vitest'
import { format, formatAll } from './04-medium-narrowing'

describe('format', () => {
  it('строку переводит в верхний регистр', () => {
    expect(format('hello')).toBe('HELLO')
  })

  it('число округляет и добавляет " руб."', () => {
    expect(format(99.999)).toBe('100.00 руб.')
    expect(format(42)).toBe('42.00 руб.')
  })

  it('boolean превращает в "да" / "нет"', () => {
    expect(format(true)).toBe('да')
    expect(format(false)).toBe('нет')
  })
})

describe('formatAll', () => {
  it('форматирует массив значений', () => {
    const result = formatAll(['hello', 42, true, 'world', false])
    expect(result).toEqual(['HELLO', '42.00 руб.', 'да', 'WORLD', 'нет'])
  })

  it('возвращает пустой массив для пустого входа', () => {
    expect(formatAll([])).toEqual([])
  })
})
