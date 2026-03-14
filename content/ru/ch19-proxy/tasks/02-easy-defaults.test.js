import { describe, it, expect } from 'vitest'
import { withDefaults } from './02-easy-defaults.js'

describe('withDefaults', () => {
  it('возвращает значение из obj когда оно есть', () => {
    const proxy = withDefaults({ port: 8080 }, { port: 3000 })
    expect(proxy.port).toBe(8080)
  })

  it('возвращает значение из defaults когда его нет в obj', () => {
    const proxy = withDefaults({}, { port: 3000, debug: false })
    expect(proxy.port).toBe(3000)
    expect(proxy.debug).toBe(false)
  })

  it('возвращает undefined когда нет нигде', () => {
    const proxy = withDefaults({ a: 1 }, { b: 2 })
    expect(proxy.c).toBeUndefined()
  })

  it('запись идёт в obj а не в defaults', () => {
    const obj = {}
    const defaults = { port: 3000 }
    const proxy = withDefaults(obj, defaults)
    proxy.port = 8080
    expect(obj.port).toBe(8080)       // записалось в obj
    expect(defaults.port).toBe(3000)  // defaults не изменился
  })

  it('после записи возвращает новое значение из obj', () => {
    const proxy = withDefaults({}, { x: 1 })
    expect(proxy.x).toBe(1) // из defaults
    proxy.x = 99
    expect(proxy.x).toBe(99) // теперь из obj
  })

  it('значение false в obj не заменяется default', () => {
    const proxy = withDefaults({ debug: false }, { debug: true })
    expect(proxy.debug).toBe(false) // false из obj, не true из defaults
  })
})
