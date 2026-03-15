import { describe, it, expect } from 'vitest'
import { ok, fail, map, getOrElse, type Result, type Success, type Failure } from './04-medium-generic-container'

describe('ok', () => {
  it('создаёт успешный результат', () => {
    const result = ok(42)
    expect(result).toEqual({ ok: true, value: 42 })
  })

  it('создаёт успешный результат со строкой', () => {
    const result = ok('привет')
    expect(result).toEqual({ ok: true, value: 'привет' })
  })
})

describe('fail', () => {
  it('создаёт ошибочный результат', () => {
    const result = fail('не найдено')
    expect(result).toEqual({ ok: false, error: 'не найдено' })
  })

  it('создаёт ошибочный результат с числом', () => {
    const result = fail(404)
    expect(result).toEqual({ ok: false, error: 404 })
  })
})

describe('map', () => {
  it('трансформирует значение успешного результата', () => {
    const result: Result<number, string> = ok(10)
    const mapped = map(result, (x) => x * 2)
    expect(mapped).toEqual({ ok: true, value: 20 })
  })

  it('не трансформирует ошибочный результат', () => {
    const result: Result<number, string> = fail('ошибка')
    const mapped = map(result, (x) => x * 2)
    expect(mapped).toEqual({ ok: false, error: 'ошибка' })
  })

  it('может менять тип значения', () => {
    const result: Result<number, string> = ok(42)
    const mapped = map(result, (x) => String(x))
    expect(mapped).toEqual({ ok: true, value: '42' })
  })
})

describe('getOrElse', () => {
  it('возвращает значение при успехе', () => {
    const result: Result<number, string> = ok(42)
    expect(getOrElse(result, 0)).toBe(42)
  })

  it('возвращает значение по умолчанию при ошибке', () => {
    const result: Result<number, string> = fail('ошибка')
    expect(getOrElse(result, 0)).toBe(0)
  })

  it('работает со строками', () => {
    const result: Result<string, number> = fail(404)
    expect(getOrElse(result, 'по умолчанию')).toBe('по умолчанию')
  })
})

describe('типы', () => {
  it('Success содержит ok: true и value', () => {
    const s: Success<string> = { ok: true, value: 'тест' }
    expect(s.ok).toBe(true)
    expect(s.value).toBe('тест')
  })

  it('Failure содержит ok: false и error', () => {
    const f: Failure<string> = { ok: false, error: 'ошибка' }
    expect(f.ok).toBe(false)
    expect(f.error).toBe('ошибка')
  })
})
