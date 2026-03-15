import { describe, it, expect } from 'vitest'
import { deepMerge, type AppConfig, type DeepPartial } from './06-hard-deep-partial'

describe('deepMerge', () => {
  const defaultConfig: AppConfig = {
    server: {
      host: 'localhost',
      port: 3000,
      ssl: {
        enabled: false,
        cert: ''
      }
    },
    database: {
      host: 'localhost',
      port: 5432,
      name: 'mydb'
    },
    features: ['auth', 'logging']
  }

  it('мержит вложенные свойства', () => {
    const overrides: DeepPartial<AppConfig> = {
      server: {
        port: 8080,
        ssl: {
          enabled: true
        }
      }
    }

    const result = deepMerge(defaultConfig, overrides)

    expect(result.server.host).toBe('localhost')      // не менялся
    expect(result.server.port).toBe(8080)              // обновлён
    expect(result.server.ssl.enabled).toBe(true)       // обновлён
    expect(result.server.ssl.cert).toBe('')            // не менялся
  })

  it('не мутирует оригинальный объект', () => {
    const overrides: DeepPartial<AppConfig> = {
      database: { name: 'production' }
    }

    deepMerge(defaultConfig, overrides)

    expect(defaultConfig.database.name).toBe('mydb')
  })

  it('заменяет массивы целиком', () => {
    const overrides: DeepPartial<AppConfig> = {
      features: ['auth', 'logging', 'metrics']
    }

    const result = deepMerge(defaultConfig, overrides)
    expect(result.features).toEqual(['auth', 'logging', 'metrics'])
  })

  it('обрабатывает пустой source', () => {
    const result = deepMerge(defaultConfig, {})
    expect(result).toEqual(defaultConfig)
    expect(result).not.toBe(defaultConfig)
  })

  it('мержит несколько уровней вложенности', () => {
    const overrides: DeepPartial<AppConfig> = {
      server: {
        ssl: {
          cert: '/path/to/cert.pem'
        }
      },
      database: {
        host: 'db.example.com',
        port: 5433
      }
    }

    const result = deepMerge(defaultConfig, overrides)

    expect(result.server.ssl.cert).toBe('/path/to/cert.pem')
    expect(result.server.ssl.enabled).toBe(false)
    expect(result.database.host).toBe('db.example.com')
    expect(result.database.port).toBe(5433)
    expect(result.database.name).toBe('mydb')
  })
})
