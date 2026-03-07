import { describe, it, expect, vi } from 'vitest'
import { createEventEmitter } from './07-hard-event-emitter'

describe('createEventEmitter', () => {
  it('on + emit вызывает обработчик', () => {
    const emitter = createEventEmitter()
    const handler = vi.fn()
    emitter.on('click', handler)
    emitter.emit('click', 'data')
    expect(handler).toHaveBeenCalledWith('data')
  })

  it('off удаляет обработчик', () => {
    const emitter = createEventEmitter()
    const handler = vi.fn()
    emitter.on('click', handler)
    emitter.off('click', handler)
    emitter.emit('click')
    expect(handler).not.toHaveBeenCalled()
  })

  it('once вызывает обработчик только один раз', () => {
    const emitter = createEventEmitter()
    const handler = vi.fn()
    emitter.once('load', handler)
    emitter.emit('load')
    emitter.emit('load')
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('несколько обработчиков на одно событие', () => {
    const emitter = createEventEmitter()
    const h1 = vi.fn()
    const h2 = vi.fn()
    emitter.on('event', h1)
    emitter.on('event', h2)
    emitter.emit('event')
    expect(h1).toHaveBeenCalled()
    expect(h2).toHaveBeenCalled()
  })

  it('emit передаёт несколько аргументов', () => {
    const emitter = createEventEmitter()
    const handler = vi.fn()
    emitter.on('data', handler)
    emitter.emit('data', 1, 2, 3)
    expect(handler).toHaveBeenCalledWith(1, 2, 3)
  })
})
