import { describe, it, expect } from 'vitest'
import { getProperty } from './01-easy-get-property'

describe('getProperty', () => {
  const user = { name: 'Алиса', age: 30, admin: true }

  it('возвращает строковое свойство', () => {
    expect(getProperty(user, 'name')).toBe('Алиса')
  })

  it('возвращает числовое свойство', () => {
    expect(getProperty(user, 'age')).toBe(30)
  })

  it('возвращает булевое свойство', () => {
    expect(getProperty(user, 'admin')).toBe(true)
  })

  it('работает с объектом другой формы', () => {
    const config = { host: 'localhost', port: 3000 }
    expect(getProperty(config, 'host')).toBe('localhost')
    expect(getProperty(config, 'port')).toBe(3000)
  })

  it('работает с вложенным объектом как значением', () => {
    const data = { meta: { total: 100 }, items: [1, 2, 3] }
    expect(getProperty(data, 'meta')).toEqual({ total: 100 })
    expect(getProperty(data, 'items')).toEqual([1, 2, 3])
  })
})
