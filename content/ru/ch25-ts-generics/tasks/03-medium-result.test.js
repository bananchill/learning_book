import { describe, it, expect } from 'vitest'
import { ok, err, map, mapError, getOrDefault } from './03-medium-result.js'

describe('ok', () => {
  it('создаёт объект с ok: true', () => {
    const result = ok(42)
    expect(result.ok).toBe(true)
    expect(result.value).toBe(42)
  })

  it('работает с любым значением', () => {
    expect(ok('строка').value).toBe('строка')
    expect(ok(null).value).toBeNull()
    expect(ok([1, 2]).value).toEqual([1, 2])
  })
})

describe('err', () => {
  it('создаёт объект с ok: false', () => {
    const result = err('ошибка')
    expect(result.ok).toBe(false)
    expect(result.error).toBe('ошибка')
  })
})

describe('map', () => {
  it('применяет функцию к успешному результату', () => {
    const result = ok(5)
    const doubled = map(result, x => x * 2)
    expect(doubled.ok).toBe(true)
    expect(doubled.value).toBe(10)
  })

  it('не изменяет результат с ошибкой', () => {
    const result = err('ошибка')
    const mapped = map(result, x => x * 2)
    expect(mapped.ok).toBe(false)
    expect(mapped.error).toBe('ошибка')
  })
})

describe('mapError', () => {
  it('применяет функцию к ошибке', () => {
    const result = err('не найдено')
    const mapped = mapError(result, msg => `Ошибка: ${msg}`)
    expect(mapped.ok).toBe(false)
    expect(mapped.error).toBe('Ошибка: не найдено')
  })

  it('не изменяет успешный результат', () => {
    const result = ok(42)
    const mapped = mapError(result, msg => `Ошибка: ${msg}`)
    expect(mapped.ok).toBe(true)
    expect(mapped.value).toBe(42)
  })
})

describe('getOrDefault', () => {
  it('возвращает value для успешного результата', () => {
    expect(getOrDefault(ok(42), 0)).toBe(42)
  })

  it('возвращает defaultValue для результата с ошибкой', () => {
    expect(getOrDefault(err('ошибка'), 0)).toBe(0)
  })
})
