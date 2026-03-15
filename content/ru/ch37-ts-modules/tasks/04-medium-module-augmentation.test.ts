import { describe, it, expect, vi } from 'vitest'
import { EventBus } from './04-medium-module-augmentation'
import type { EventMap } from './04-medium-module-augmentation'

describe('EventMap declaration merging', () => {
  it('EventMap содержит событие user:login', () => {
    // Проверяем, что тип существует через создание объекта
    const data: EventMap['user:login'] = { userId: 1, timestamp: new Date() }
    expect(data.userId).toBe(1)
    expect(data.timestamp).toBeInstanceOf(Date)
  })

  it('EventMap содержит событие user:logout', () => {
    const data: EventMap['user:logout'] = { userId: 42 }
    expect(data.userId).toBe(42)
  })

  it('EventMap содержит событие message:new', () => {
    const data: EventMap['message:new'] = { id: 1, text: 'Привет', from: 'Алиса' }
    expect(data.id).toBe(1)
    expect(data.text).toBe('Привет')
    expect(data.from).toBe('Алиса')
  })

  it('EventMap содержит событие message:read', () => {
    const data: EventMap['message:read'] = { id: 1, readAt: new Date() }
    expect(data.id).toBe(1)
    expect(data.readAt).toBeInstanceOf(Date)
  })
})

describe('EventBus', () => {
  it('emit вызывает обработчик on', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    bus.on('user:login', handler)
    bus.emit('user:login', { userId: 1, timestamp: new Date() })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 1 })
    )
  })

  it('поддерживает несколько обработчиков', () => {
    const bus = new EventBus()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    bus.on('message:new', handler1)
    bus.on('message:new', handler2)
    bus.emit('message:new', { id: 1, text: 'Тест', from: 'Боб' })

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
  })

  it('off удаляет обработчик', () => {
    const bus = new EventBus()
    const handler = vi.fn()

    bus.on('user:logout', handler)
    bus.off('user:logout', handler)
    bus.emit('user:logout', { userId: 1 })

    expect(handler).not.toHaveBeenCalled()
  })

  it('разные события не пересекаются', () => {
    const bus = new EventBus()
    const loginHandler = vi.fn()
    const logoutHandler = vi.fn()

    bus.on('user:login', loginHandler)
    bus.on('user:logout', logoutHandler)
    bus.emit('user:login', { userId: 1, timestamp: new Date() })

    expect(loginHandler).toHaveBeenCalledTimes(1)
    expect(logoutHandler).not.toHaveBeenCalled()
  })
})
