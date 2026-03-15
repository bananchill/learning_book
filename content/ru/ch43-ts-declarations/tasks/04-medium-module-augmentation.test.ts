import { describe, it, expect } from 'vitest'

// Тесты проверяют корректность module augmentation и global augmentation.

describe('module augmentation', () => {
  it('Array имеет метод shuffle, возвращающий массив того же типа', () => {
    // Проверяем, что тип shuffle существует на массиве
    type ShuffleResult = ReturnType<Array<number>['shuffle']>
    const result: ShuffleResult = [1, 2, 3]
    expect(Array.isArray(result)).toBe(true)
  })

  it('shuffle сохраняет тип элементов', () => {
    type StringShuffle = ReturnType<Array<string>['shuffle']>
    const result: StringShuffle = ['a', 'b']
    expect(typeof result[0]).toBe('string')
  })
})

describe('global augmentation', () => {
  it('Window имеет свойство __APP_STATE__', () => {
    type AppState = Window['__APP_STATE__']
    const state: AppState = { user: 'admin', theme: 'dark' }
    expect(state.theme).toBe('dark')
  })

  it('__APP_STATE__.user может быть null', () => {
    type AppState = Window['__APP_STATE__']
    const state: AppState = { user: null, theme: 'light' }
    expect(state.user).toBeNull()
  })

  it('__APP_STATE__.theme принимает только light или dark', () => {
    type Theme = Window['__APP_STATE__']['theme']
    const light: Theme = 'light'
    const dark: Theme = 'dark'
    expect(light).toBe('light')
    expect(dark).toBe('dark')
  })
})

describe('wildcard declare module', () => {
  it('*.yaml экспортирует Record<string, unknown>', () => {
    type YamlImport = typeof import('*.yaml')
    // Проверяем, что default -- Record<string, unknown>
    const check: YamlImport['default'] extends Record<string, unknown> ? true : false = true
    expect(check).toBe(true)
  })

  it('*.graphql экспортирует строку', () => {
    type GqlImport = typeof import('*.graphql')
    const check: GqlImport['default'] extends string ? true : false = true
    expect(check).toBe(true)
  })
})
