import { describe, it, expect, vi } from 'vitest'
import {
  PluginManager,
  createLoggerPlugin,
  createCachePlugin,
  createAuthPlugin,
} from './06-hard-plugin-system'
import type { PluginRegistry, Plugin } from './06-hard-plugin-system'

describe('PluginRegistry типы', () => {
  it('logger имеет правильный тип', () => {
    const logger: PluginRegistry['logger'] = {
      log: (msg: string) => {},
      level: 'info',
    }
    expect(logger.level).toBe('info')
  })

  it('cache имеет правильный тип', () => {
    const cache: PluginRegistry['cache'] = {
      get: (key: string) => null,
      set: (key: string, value: unknown) => {},
      clear: () => {},
    }
    expect(typeof cache.get).toBe('function')
    expect(typeof cache.set).toBe('function')
    expect(typeof cache.clear).toBe('function')
  })

  it('auth имеет правильный тип', () => {
    const auth: PluginRegistry['auth'] = {
      login: (user: string, pass: string) => true,
      logout: () => {},
      isAuthenticated: false,
    }
    expect(typeof auth.login).toBe('function')
    expect(auth.isAuthenticated).toBe(false)
  })
})

describe('PluginManager', () => {
  it('register и get работают', () => {
    const manager = new PluginManager()
    const loggerPlugin = createLoggerPlugin('info')

    manager.register('logger', loggerPlugin)
    const retrieved = manager.get('logger')

    expect(retrieved).toBeDefined()
    expect(retrieved!.name).toBe('logger')
    expect(retrieved!.instance.level).toBe('info')
  })

  it('get возвращает undefined для незарегистрированного плагина', () => {
    const manager = new PluginManager()
    expect(manager.get('logger')).toBeUndefined()
  })

  it('has возвращает true для зарегистрированного плагина', () => {
    const manager = new PluginManager()
    manager.register('cache', createCachePlugin())
    expect(manager.has('cache')).toBe(true)
  })

  it('has возвращает false для незарегистрированного плагина', () => {
    const manager = new PluginManager()
    expect(manager.has('auth')).toBe(false)
  })

  it('getAll возвращает все плагины', () => {
    const manager = new PluginManager()
    manager.register('logger', createLoggerPlugin('debug'))
    manager.register('cache', createCachePlugin())
    manager.register('auth', createAuthPlugin())

    const all = manager.getAll()
    expect(all).toHaveLength(3)
  })
})

describe('createLoggerPlugin', () => {
  it('создаёт плагин логгера', () => {
    const plugin = createLoggerPlugin('warn')
    expect(plugin.name).toBe('logger')
    expect(plugin.version).toBeTruthy()
    expect(plugin.instance.level).toBe('warn')
    expect(typeof plugin.instance.log).toBe('function')
  })
})

describe('createCachePlugin', () => {
  it('создаёт плагин кэша', () => {
    const plugin = createCachePlugin()
    expect(plugin.name).toBe('cache')
    expect(typeof plugin.instance.get).toBe('function')
    expect(typeof plugin.instance.set).toBe('function')
    expect(typeof plugin.instance.clear).toBe('function')
  })

  it('set/get работают', () => {
    const plugin = createCachePlugin()
    plugin.instance.set('key', 'value')
    expect(plugin.instance.get('key')).toBe('value')
  })

  it('clear очищает кэш', () => {
    const plugin = createCachePlugin()
    plugin.instance.set('key', 'value')
    plugin.instance.clear()
    expect(plugin.instance.get('key')).toBeUndefined()
  })
})

describe('createAuthPlugin', () => {
  it('создаёт плагин авторизации', () => {
    const plugin = createAuthPlugin()
    expect(plugin.name).toBe('auth')
    expect(plugin.instance.isAuthenticated).toBe(false)
  })

  it('login/logout работают', () => {
    const plugin = createAuthPlugin()
    const result = plugin.instance.login('admin', 'password')
    expect(result).toBe(true)
    expect(plugin.instance.isAuthenticated).toBe(true)

    plugin.instance.logout()
    expect(plugin.instance.isAuthenticated).toBe(false)
  })

  it('login с неверным паролем возвращает false', () => {
    const plugin = createAuthPlugin()
    const result = plugin.instance.login('admin', 'wrong')
    expect(result).toBe(false)
    expect(plugin.instance.isAuthenticated).toBe(false)
  })
})
