import { describe, it, expect } from 'vitest'
import { getBuildOrder, getAffectedProjects } from './05-hard-build-order'

describe('getBuildOrder', () => {
  it('линейная цепочка: shared → core → app', () => {
    const graph = {
      shared: [],
      core: ['shared'],
      app: ['core', 'shared'],
    }
    const result = getBuildOrder(graph)
    expect(result.hasCycle).toBe(false)
    expect(result.order.length).toBe(3)

    // shared должен быть перед core, core перед app
    const idx = (name: string) => result.order.indexOf(name)
    expect(idx('shared')).toBeLessThan(idx('core'))
    expect(idx('core')).toBeLessThan(idx('app'))
  })

  it('независимые проекты', () => {
    const graph = {
      a: [],
      b: [],
      c: [],
    }
    const result = getBuildOrder(graph)
    expect(result.hasCycle).toBe(false)
    expect(result.order.length).toBe(3)
    expect(result.order).toContain('a')
    expect(result.order).toContain('b')
    expect(result.order).toContain('c')
  })

  it('два независимых + один зависимый', () => {
    const graph = {
      a: [],
      b: [],
      c: ['a', 'b'],
    }
    const result = getBuildOrder(graph)
    expect(result.hasCycle).toBe(false)

    const idx = (name: string) => result.order.indexOf(name)
    expect(idx('a')).toBeLessThan(idx('c'))
    expect(idx('b')).toBeLessThan(idx('c'))
  })

  it('цикл: a → b → a', () => {
    const graph = {
      a: ['b'],
      b: ['a'],
    }
    const result = getBuildOrder(graph)
    expect(result.hasCycle).toBe(true)
    expect(result.order).toEqual([])
  })

  it('цикл из трёх: a → b → c → a', () => {
    const graph = {
      a: ['c'],
      b: ['a'],
      c: ['b'],
    }
    const result = getBuildOrder(graph)
    expect(result.hasCycle).toBe(true)
    expect(result.order).toEqual([])
  })

  it('один проект без зависимостей', () => {
    const graph = { solo: [] }
    const result = getBuildOrder(graph)
    expect(result.hasCycle).toBe(false)
    expect(result.order).toEqual(['solo'])
  })

  it('пустой граф', () => {
    const result = getBuildOrder({})
    expect(result.hasCycle).toBe(false)
    expect(result.order).toEqual([])
  })

  it('сложный граф монорепо', () => {
    const graph = {
      shared: [],
      i18n: ['shared'],
      ui: ['shared'],
      core: ['shared', 'ui', 'i18n'],
      app: ['core', 'ui', 'shared'],
    }
    const result = getBuildOrder(graph)
    expect(result.hasCycle).toBe(false)
    expect(result.order.length).toBe(5)

    const idx = (name: string) => result.order.indexOf(name)
    // shared перед всеми
    expect(idx('shared')).toBeLessThan(idx('i18n'))
    expect(idx('shared')).toBeLessThan(idx('ui'))
    expect(idx('shared')).toBeLessThan(idx('core'))
    // ui и i18n перед core
    expect(idx('ui')).toBeLessThan(idx('core'))
    expect(idx('i18n')).toBeLessThan(idx('core'))
    // core перед app
    expect(idx('core')).toBeLessThan(idx('app'))
  })
})

describe('getAffectedProjects', () => {
  const graph = {
    shared: [],
    core: ['shared'],
    app: ['core'],
    tests: ['app'],
    admin: ['core'],
  }

  it('изменение shared — затрагивает всё', () => {
    const affected = getAffectedProjects(graph, 'shared')
    expect(affected).toContain('shared')
    expect(affected).toContain('core')
    expect(affected).toContain('app')
    expect(affected).toContain('tests')
    expect(affected).toContain('admin')
  })

  it('изменение core — затрагивает core, app, tests, admin', () => {
    const affected = getAffectedProjects(graph, 'core')
    expect(affected).toContain('core')
    expect(affected).toContain('app')
    expect(affected).toContain('tests')
    expect(affected).toContain('admin')
    expect(affected).not.toContain('shared')
  })

  it('изменение app — затрагивает app и tests', () => {
    const affected = getAffectedProjects(graph, 'app')
    expect(affected).toContain('app')
    expect(affected).toContain('tests')
    expect(affected).not.toContain('core')
    expect(affected).not.toContain('shared')
  })

  it('изменение tests — затрагивает только tests', () => {
    const affected = getAffectedProjects(graph, 'tests')
    expect(affected).toEqual(['tests'])
  })

  it('порядок: от изменённого к зависимым', () => {
    const affected = getAffectedProjects(graph, 'shared')
    const idx = (name: string) => affected.indexOf(name)
    expect(idx('shared')).toBeLessThan(idx('core'))
    expect(idx('core')).toBeLessThan(idx('app'))
    expect(idx('app')).toBeLessThan(idx('tests'))
  })
})
