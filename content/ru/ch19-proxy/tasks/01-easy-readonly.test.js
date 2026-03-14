import { describe, it, expect } from 'vitest'
import { readonly } from './01-easy-readonly.js'

describe('readonly', () => {
  it('разрешает чтение свойств', () => {
    const obj = readonly({ x: 1, y: 'hello', z: true })
    expect(obj.x).toBe(1)
    expect(obj.y).toBe('hello')
    expect(obj.z).toBe(true)
  })

  it('запрещает запись свойств — бросает TypeError', () => {
    const obj = readonly({ x: 1 })
    expect(() => { obj.x = 5 }).toThrow(TypeError)
  })

  it('запрещает добавление новых свойств — бросает TypeError', () => {
    const obj = readonly({})
    expect(() => { obj.newProp = 'value' }).toThrow(TypeError)
  })

  it('запрещает удаление свойств — бросает TypeError', () => {
    const obj = readonly({ x: 1 })
    expect(() => { delete obj.x }).toThrow(TypeError)
  })

  it('не изменяет оригинальный объект при попытке записи', () => {
    const original = { x: 1 }
    const proxy = readonly(original)
    try { proxy.x = 99 } catch {}
    expect(original.x).toBe(1) // оригинал не изменён
  })

  it('сообщение ошибки содержит имя свойства', () => {
    const obj = readonly({ name: 'test' })
    expect(() => { obj.name = 'other' }).toThrow(/name/)
  })
})
