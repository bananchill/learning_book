import { describe, it, expect, vi } from 'vitest'
import { logMessage, parseJSON, throwError, describeValue } from './03-easy-special-types'

describe('logMessage', () => {
  it('логирует сообщение и возвращает undefined', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const result = logMessage('тест')
    expect(spy).toHaveBeenCalledWith('[LOG] тест')
    expect(result).toBeUndefined()
    spy.mockRestore()
  })
})

describe('parseJSON', () => {
  it('парсит валидный JSON', () => {
    const result = parseJSON('{"name": "Алиса"}')
    expect(result).toEqual({ name: 'Алиса' })
  })

  it('парсит массив', () => {
    const result = parseJSON('[1, 2, 3]')
    expect(result).toEqual([1, 2, 3])
  })

  it('парсит примитивы', () => {
    expect(parseJSON('42')).toBe(42)
    expect(parseJSON('"hello"')).toBe('hello')
    expect(parseJSON('true')).toBe(true)
  })
})

describe('throwError', () => {
  it('всегда бросает ошибку', () => {
    expect(() => throwError('что-то пошло не так')).toThrow('что-то пошло не так')
  })

  it('бросает Error с правильным сообщением', () => {
    expect(() => throwError('ошибка')).toThrow(Error)
  })
})

describe('describeValue', () => {
  it('описывает строку', () => {
    expect(describeValue('привет')).toBe('строка: "привет"')
  })

  it('описывает число', () => {
    expect(describeValue(42)).toBe('число: 42')
  })

  it('описывает boolean', () => {
    expect(describeValue(true)).toBe('логическое: true')
  })

  it('описывает неизвестный тип', () => {
    expect(describeValue(null)).toBe('неизвестный тип')
    expect(describeValue(undefined)).toBe('неизвестный тип')
    expect(describeValue({ x: 1 })).toBe('неизвестный тип')
  })
})
