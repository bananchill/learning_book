import { describe, it, expect } from 'vitest'
import { Maybe } from './02-easy-maybe'

describe('Maybe', () => {
  it('of создаёт Maybe с значением', () => {
    const m = Maybe.of(42)
    expect(m.getOrElse(0)).toBe(42)
  })

  it('map применяет функцию к значению', () => {
    const result = Maybe.of(5).map(x => x * 2).getOrElse(0)
    expect(result).toBe(10)
  })

  it('map пропускается для null', () => {
    const result = Maybe.of(null).map(x => x * 2).getOrElse(99)
    expect(result).toBe(99)
  })

  it('map пропускается для undefined', () => {
    const result = Maybe.of(undefined).map(x => x.name).getOrElse('default')
    expect(result).toBe('default')
  })

  it('цепочка map на null не падает', () => {
    const result = Maybe.of(null)
      .map(x => x.profile)
      .map(p => p.address)
      .map(a => a.city)
      .getOrElse('Неизвестно')
    expect(result).toBe('Неизвестно')
  })

  it('цепочка map работает с вложенным объектом', () => {
    const user = { profile: { city: 'Москва' } }
    const city = Maybe.of(user)
      .map(u => u.profile)
      .map(p => p.city)
      .getOrElse('Неизвестно')
    expect(city).toBe('Москва')
  })

  it('getOrElse возвращает значение если не null', () => {
    expect(Maybe.of(0).getOrElse(99)).toBe(0)
    expect(Maybe.of('').getOrElse('default')).toBe('')
  })
})
