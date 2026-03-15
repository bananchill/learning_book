import { describe, it, expect } from 'vitest'
import { validateConfig, createLogger } from './02-easy-import-type'
import type { Config, LogLevel } from './02-easy-import-type'

describe('validateConfig', () => {
  it('возвращает true для валидного конфига', () => {
    const config: Config = { host: 'localhost', port: 3000, debug: true }
    expect(validateConfig(config)).toBe(true)
  })

  it('возвращает false для null', () => {
    expect(validateConfig(null)).toBe(false)
  })

  it('возвращает false для объекта без host', () => {
    expect(validateConfig({ port: 3000, debug: true })).toBe(false)
  })

  it('возвращает false для объекта с неправильным типом port', () => {
    expect(validateConfig({ host: 'localhost', port: '3000', debug: true })).toBe(false)
  })

  it('возвращает false для объекта без debug', () => {
    expect(validateConfig({ host: 'localhost', port: 3000 })).toBe(false)
  })
})

describe('createLogger', () => {
  it('создаёт логгер уровня debug', () => {
    const logger = createLogger('debug')
    expect(logger('тестовое сообщение')).toBe('[DEBUG] тестовое сообщение')
  })

  it('создаёт логгер уровня error', () => {
    const logger = createLogger('error')
    expect(logger('что-то сломалось')).toBe('[ERROR] что-то сломалось')
  })

  it('создаёт логгер уровня info', () => {
    const logger = createLogger('info')
    expect(logger('запуск')).toBe('[INFO] запуск')
  })

  it('создаёт логгер уровня warn', () => {
    const logger = createLogger('warn')
    expect(logger('внимание')).toBe('[WARN] внимание')
  })
})

describe('типы', () => {
  it('Config имеет нужные поля', () => {
    const config: Config = { host: 'localhost', port: 8080, debug: false }
    expect(config.host).toBe('localhost')
    expect(config.port).toBe(8080)
    expect(config.debug).toBe(false)
  })

  it('LogLevel — это union строковых литералов', () => {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error']
    expect(levels).toHaveLength(4)
  })
})
