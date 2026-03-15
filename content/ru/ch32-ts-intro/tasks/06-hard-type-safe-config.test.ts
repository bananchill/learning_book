import { describe, it, expect } from 'vitest'
import { createConfig, get, validate } from './06-hard-type-safe-config'

describe('createConfig', () => {
  it('возвращает дефолтный конфиг без overrides', () => {
    const config = createConfig({})
    expect(config.port).toBe(3000)
    expect(config.host).toBe('localhost')
    expect(config.debug).toBe(false)
    expect(config.maxRetries).toBe(3)
    expect(config.apiUrl).toBe('http://localhost:3000/api')
  })

  it('перезаписывает указанные поля', () => {
    const config = createConfig({ port: 8080, debug: true })
    expect(config.port).toBe(8080)
    expect(config.debug).toBe(true)
    expect(config.host).toBe('localhost') // остальное по умолчанию
  })
})

describe('get', () => {
  it('возвращает значение по ключу', () => {
    const config = createConfig({})
    expect(get(config, 'port')).toBe(3000)
    expect(get(config, 'host')).toBe('localhost')
    expect(get(config, 'debug')).toBe(false)
  })
})

describe('validate', () => {
  it('валидный конфиг — пустой массив ошибок', () => {
    const config = createConfig({})
    expect(validate(config)).toEqual([])
  })

  it('невалидный port', () => {
    const config = createConfig({ port: 0 })
    const errors = validate(config)
    expect(errors.length).toBeGreaterThan(0)
    expect(errors.some(e => e.includes('port'))).toBe(true)
  })

  it('пустой host', () => {
    const config = createConfig({ host: '' })
    const errors = validate(config)
    expect(errors.some(e => e.includes('host'))).toBe(true)
  })

  it('maxRetries > 10', () => {
    const config = createConfig({ maxRetries: 15 })
    const errors = validate(config)
    expect(errors.some(e => e.includes('maxRetries'))).toBe(true)
  })

  it('невалидный apiUrl', () => {
    const config = createConfig({ apiUrl: 'ftp://invalid' })
    const errors = validate(config)
    expect(errors.some(e => e.includes('apiUrl'))).toBe(true)
  })

  it('несколько ошибок одновременно', () => {
    const config = createConfig({ port: -1, host: '', maxRetries: 100 })
    const errors = validate(config)
    expect(errors.length).toBeGreaterThanOrEqual(3)
  })
})
