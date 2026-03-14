import { describe, it, expect, vi } from 'vitest'
import { TypedEventEmitter } from './03-medium-event-map.js'

describe('TypedEventEmitter', () => {
  it('on подписывается на событие', () => {
    const emitter = new TypedEventEmitter()
    const handler = vi.fn()
    emitter.on('click', handler)
    emitter.emit('click', { x: 10, y: 20 })
    expect(handler).toHaveBeenCalledWith({ x: 10, y: 20 })
  })

  it('несколько обработчиков вызываются все', () => {
    const emitter = new TypedEventEmitter()
    const h1 = vi.fn()
    const h2 = vi.fn()
    emitter.on('data', h1)
    emitter.on('data', h2)
    emitter.emit('data', 42)
    expect(h1).toHaveBeenCalledWith(42)
    expect(h2).toHaveBeenCalledWith(42)
  })

  it('off отписывает конкретный обработчик', () => {
    const emitter = new TypedEventEmitter()
    const h1 = vi.fn()
    const h2 = vi.fn()
    emitter.on('event', h1)
    emitter.on('event', h2)
    emitter.off('event', h1)
    emitter.emit('event', null)
    expect(h1).not.toHaveBeenCalled()
    expect(h2).toHaveBeenCalled()
  })

  it('once вызывается только один раз', () => {
    const emitter = new TypedEventEmitter()
    const handler = vi.fn()
    emitter.once('tick', handler)
    emitter.emit('tick', 1)
    emitter.emit('tick', 2)
    emitter.emit('tick', 3)
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(1)
  })

  it('emit без обработчиков не бросает ошибку', () => {
    const emitter = new TypedEventEmitter()
    expect(() => emitter.emit('unknown', null)).not.toThrow()
  })

  it('разные события не мешают друг другу', () => {
    const emitter = new TypedEventEmitter()
    const clickHandler = vi.fn()
    const keyHandler = vi.fn()
    emitter.on('click', clickHandler)
    emitter.on('keydown', keyHandler)
    emitter.emit('click', {})
    expect(clickHandler).toHaveBeenCalledTimes(1)
    expect(keyHandler).not.toHaveBeenCalled()
  })
})
