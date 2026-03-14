import { describe, it, expect, vi } from 'vitest'
import { EventEmitter } from './03-medium-event-emitter.js'

describe('EventEmitter', () => {
  it('on/emit — базовая подписка и вызов', () => {
    const emitter = new EventEmitter()
    const handler = vi.fn()

    emitter.on('data', handler)
    emitter.emit('data', 42)

    expect(handler).toHaveBeenCalledWith(42)
  })

  it('emit передаёт несколько аргументов', () => {
    const emitter = new EventEmitter()
    const handler = vi.fn()

    emitter.on('event', handler)
    emitter.emit('event', 1, 2, 3)

    expect(handler).toHaveBeenCalledWith(1, 2, 3)
  })

  it('несколько обработчиков для одного события', () => {
    const emitter = new EventEmitter()
    const h1 = vi.fn()
    const h2 = vi.fn()

    emitter.on('event', h1)
    emitter.on('event', h2)
    emitter.emit('event')

    expect(h1).toHaveBeenCalled()
    expect(h2).toHaveBeenCalled()
  })

  it('off удаляет конкретный обработчик', () => {
    const emitter = new EventEmitter()
    const h1 = vi.fn()
    const h2 = vi.fn()

    emitter.on('event', h1)
    emitter.on('event', h2)
    emitter.off('event', h1)
    emitter.emit('event')

    expect(h1).not.toHaveBeenCalled()
    expect(h2).toHaveBeenCalled()
  })

  it('once вызывается только один раз', () => {
    const emitter = new EventEmitter()
    const handler = vi.fn()

    emitter.once('event', handler)
    emitter.emit('event')
    emitter.emit('event')
    emitter.emit('event')

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('emit возвращает true если были обработчики', () => {
    const emitter = new EventEmitter()
    emitter.on('event', () => {})
    expect(emitter.emit('event')).toBe(true)
  })

  it('emit возвращает false если не было обработчиков', () => {
    const emitter = new EventEmitter()
    expect(emitter.emit('unknown')).toBe(false)
  })

  it('removeAllListeners удаляет все обработчики конкретного события', () => {
    const emitter = new EventEmitter()
    const h1 = vi.fn()
    const h2 = vi.fn()

    emitter.on('event1', h1)
    emitter.on('event2', h2)
    emitter.removeAllListeners('event1')

    emitter.emit('event1')
    emitter.emit('event2')

    expect(h1).not.toHaveBeenCalled()
    expect(h2).toHaveBeenCalled()
  })

  it('on возвращает this для chain', () => {
    const emitter = new EventEmitter()
    expect(emitter.on('event', () => {})).toBe(emitter)
  })
})
