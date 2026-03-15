import { describe, it, expect } from 'vitest'
import {
  createUser,
  softDelete,
  isDeleted,
  type Entity,
  type User,
  type FullUser,
  type WithTimestamps,
  type SoftDeletable,
} from './05-medium-intersection'

describe('createUser', () => {
  it('создаёт пользователя с обязательными полями', () => {
    const user = createUser('Анна', 'anna@example.com')
    expect(user.name).toBe('Анна')
    expect(user.email).toBe('anna@example.com')
  })

  it('устанавливает id как число', () => {
    const user = createUser('Борис', 'boris@example.com')
    expect(typeof user.id).toBe('number')
  })

  it('устанавливает временные метки', () => {
    const before = new Date()
    const user = createUser('Вера', 'vera@example.com')
    const after = new Date()

    expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(user.createdAt.getTime()).toBeLessThanOrEqual(after.getTime())
    expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(before.getTime())
    expect(user.updatedAt.getTime()).toBeLessThanOrEqual(after.getTime())
  })

  it('устанавливает deletedAt в null', () => {
    const user = createUser('Глеб', 'gleb@example.com')
    expect(user.deletedAt).toBeNull()
  })
})

describe('softDelete', () => {
  it('устанавливает deletedAt в дату', () => {
    const user = createUser('Дина', 'dina@example.com')
    const deleted = softDelete(user)
    expect(deleted.deletedAt).toBeInstanceOf(Date)
  })

  it('обновляет updatedAt', () => {
    const user = createUser('Егор', 'egor@example.com')
    const originalUpdatedAt = user.updatedAt
    const deleted = softDelete(user)
    expect(deleted.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime())
  })

  it('не изменяет исходный объект (возвращает новый)', () => {
    const user = createUser('Жанна', 'zhanna@example.com')
    const deleted = softDelete(user)
    expect(user.deletedAt).toBeNull()
    expect(deleted.deletedAt).not.toBeNull()
  })

  it('сохраняет остальные поля', () => {
    const user = createUser('Захар', 'zakhar@example.com')
    const deleted = softDelete(user)
    expect(deleted.name).toBe('Захар')
    expect(deleted.email).toBe('zakhar@example.com')
    expect(deleted.id).toBe(user.id)
  })
})

describe('isDeleted', () => {
  it('возвращает false для не удалённой сущности', () => {
    const user = createUser('Ира', 'ira@example.com')
    expect(isDeleted(user)).toBe(false)
  })

  it('возвращает true для удалённой сущности', () => {
    const user = createUser('Кирилл', 'kirill@example.com')
    const deleted = softDelete(user)
    expect(isDeleted(deleted)).toBe(true)
  })
})

describe('типы', () => {
  it('Entity имеет readonly id', () => {
    const entity: Entity = { id: 1 }
    expect(entity.id).toBe(1)
  })

  it('User расширяет Entity', () => {
    const user: User = { id: 1, name: 'Тест', email: 'test@test.com' }
    expect(user.id).toBe(1)
    expect(user.name).toBe('Тест')
  })

  it('WithTimestamps добавляет временные метки', () => {
    const item: WithTimestamps<{ name: string }> = {
      name: 'тест',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    expect(item.createdAt).toBeInstanceOf(Date)
  })

  it('SoftDeletable добавляет deletedAt', () => {
    const item: SoftDeletable<{ name: string }> = {
      name: 'тест',
      deletedAt: null,
    }
    expect(item.deletedAt).toBeNull()
  })
})
