import { describe, it, expect } from 'vitest'
import { createEventEmitter } from './07-hard-event-emitter'

// Простой шпион вместо vi.fn()
function createSpy(impl) {
  const spy = (...args) => {
    spy.calls.push(args)
    if (impl) return impl(...args)
  }
  spy.calls = []
  return spy
}

describe('createEventEmitter', () => {
  it('on + emit вызывает обработчик', () => {
    const emitter = createEventEmitter()
    const handler = createSpy()
    emitter.on('click', handler)
    emitter.emit('click', 'data')
    expect(handler.calls.length).toBe(1)
    expect(handler.calls[0]).toEqual(['data'])
  })

  it('off удаляет обработчик', () => {
    const emitter = createEventEmitter()
    const handler = createSpy()
    emitter.on('click', handler)
    emitter.off('click', handler)
    emitter.emit('click')
    expect(handler.calls.length).toBe(0)
  })

  it('once вызывает обработчик только один раз', () => {
    const emitter = createEventEmitter()
    const handler = createSpy()
    emitter.once('load', handler)
    emitter.emit('load')
    emitter.emit('load')
    expect(handler.calls.length).toBe(1)
  })

  it('несколько обработчиков на одно событие', () => {
    const emitter = createEventEmitter()
    const h1 = createSpy()
    const h2 = createSpy()
    emitter.on('event', h1)
    emitter.on('event', h2)
    emitter.emit('event')
    expect(h1.calls.length).toBe(1)
    expect(h2.calls.length).toBe(1)
  })

  it('emit передаёт несколько аргументов', () => {
    const emitter = createEventEmitter()
    const handler = createSpy()
    emitter.on('data', handler)
    emitter.emit('data', 1, 2, 3)
    expect(handler.calls[0]).toEqual([1, 2, 3])
  })
})
