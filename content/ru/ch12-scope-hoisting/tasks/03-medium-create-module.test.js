import { describe, it, expect } from 'vitest'
import { createModule } from './03-medium-create-module'

describe('createModule', () => {
  it('add добавляет элемент', () => {
    const m = createModule()
    m.add('a')
    expect(m.count()).toBe(1)
    expect(m.getAll()).toContain('a')
  })

  it('remove удаляет первое вхождение', () => {
    const m = createModule()
    m.add('a')
    m.add('b')
    m.add('a')
    m.remove('a')
    expect(m.count()).toBe(2)
    expect(m.getAll()).toEqual(['b', 'a'])
  })

  it('getAll возвращает копию массива', () => {
    const m = createModule()
    m.add('x')
    const arr = m.getAll()
    arr.push('внешнее изменение')
    // внутренний массив не должен измениться
    expect(m.count()).toBe(1)
  })

  it('count возвращает количество элементов', () => {
    const m = createModule()
    expect(m.count()).toBe(0)
    m.add('a')
    m.add('b')
    expect(m.count()).toBe(2)
  })

  it('разные экземпляры независимы', () => {
    const m1 = createModule()
    const m2 = createModule()
    m1.add('только в m1')
    expect(m2.count()).toBe(0)
  })

  it('remove несуществующего элемента не ломает модуль', () => {
    const m = createModule()
    m.add('a')
    m.remove('нет такого')
    expect(m.count()).toBe(1)
  })
})
