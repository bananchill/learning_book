import { describe, it, expect, vi } from 'vitest'
import { TypedEmitter } from './06-hard-event-emitter'

// Определяем типы событий для тестов
interface TestEvents {
  click: (x: number, y: number) => void
  keypress: (key: string) => void
  resize: (width: number, height: number) => void
  close: () => void
}

describe('TypedEmitter', () => {
  it('вызывает обработчик при emit', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('click', handler)
    emitter.emit('click', 10, 20)

    expect(handler).toHaveBeenCalledWith(10, 20)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('поддерживает несколько обработчиков одного события', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on('keypress', handler1)
    emitter.on('keypress', handler2)
    emitter.emit('keypress', 'Enter')

    expect(handler1).toHaveBeenCalledWith('Enter')
    expect(handler2).toHaveBeenCalledWith('Enter')
  })

  it('не вызывает обработчик после off', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('click', handler)
    emitter.off('click', handler)
    emitter.emit('click', 5, 5)

    expect(handler).not.toHaveBeenCalled()
  })

  it('emit без подписчиков не вызывает ошибку', () => {
    const emitter = new TypedEmitter<TestEvents>()
    expect(() => emitter.emit('close')).not.toThrow()
  })

  it('поддерживает события без аргументов', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('close', handler)
    emitter.emit('close')

    expect(handler).toHaveBeenCalledWith()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('разные события не пересекаются', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const clickHandler = vi.fn()
    const keypressHandler = vi.fn()

    emitter.on('click', clickHandler)
    emitter.on('keypress', keypressHandler)

    emitter.emit('click', 1, 2)

    expect(clickHandler).toHaveBeenCalledTimes(1)
    expect(keypressHandler).not.toHaveBeenCalled()
  })

  it('listenerCount возвращает количество подписчиков', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    expect(emitter.listenerCount('click')).toBe(0)

    emitter.on('click', handler1)
    expect(emitter.listenerCount('click')).toBe(1)

    emitter.on('click', handler2)
    expect(emitter.listenerCount('click')).toBe(2)

    emitter.off('click', handler1)
    expect(emitter.listenerCount('click')).toBe(1)
  })

  it('off удаляет только указанный обработчик', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on('resize', handler1)
    emitter.on('resize', handler2)

    emitter.off('resize', handler1)
    emitter.emit('resize', 800, 600)

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).toHaveBeenCalledWith(800, 600)
  })

  it('повторный off не вызывает ошибку', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('close', handler)
    emitter.off('close', handler)
    expect(() => emitter.off('close', handler)).not.toThrow()
  })
})
