import { describe, it, expect } from 'vitest'
import { readonly } from './01-easy-readonly.js'

describe('readonly decorator', () => {
  it('применяет readonly к свойству', () => {
    class Config {
      constructor() {
        this.API_URL = 'https://api.example.com'
        readonly(Config.prototype, 'API_URL')
      }
    }

    const config = new Config()
    expect(config.API_URL).toBe('https://api.example.com')
  })

  it('запрещает изменение свойства в strict mode', () => {
    class Config {}
    Config.prototype.VERSION = '1.0'
    readonly(Config.prototype, 'VERSION')

    const config = new Config()
    expect(() => {
      'use strict'
      config.VERSION = '2.0'
    }).toThrow()
  })

  it('свойство не configurable после readonly', () => {
    class Service {}
    Service.prototype.MAX_RETRIES = 3
    readonly(Service.prototype, 'MAX_RETRIES')

    const descriptor = Object.getOwnPropertyDescriptor(Service.prototype, 'MAX_RETRIES')
    expect(descriptor?.configurable).toBe(false)
    expect(descriptor?.writable).toBe(false)
  })
})
