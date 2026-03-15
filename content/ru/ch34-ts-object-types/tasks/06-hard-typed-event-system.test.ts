import { describe, it, expect, vi } from 'vitest'
import { TypedEmitter, createAppEmitter, type AppEvents } from './06-hard-typed-event-system'

describe('TypedEmitter', () => {
  it('вызывает callback при emit', () => {
    const emitter = new TypedEmitter<{ test: [value: string] }>()
    const callback = vi.fn()

    emitter.on('test', callback)
    emitter.emit('test', 'привет')

    expect(callback).toHaveBeenCalledWith('привет')
  })

  it('поддерживает несколько подписчиков', () => {
    const emitter = new TypedEmitter<{ test: [value: number] }>()
    const cb1 = vi.fn()
    const cb2 = vi.fn()

    emitter.on('test', cb1)
    emitter.on('test', cb2)
    emitter.emit('test', 42)

    expect(cb1).toHaveBeenCalledWith(42)
    expect(cb2).toHaveBeenCalledWith(42)
  })

  it('off отписывает callback', () => {
    const emitter = new TypedEmitter<{ test: [value: string] }>()
    const callback = vi.fn()

    emitter.on('test', callback)
    emitter.off('test', callback)
    emitter.emit('test', 'тест')

    expect(callback).not.toHaveBeenCalled()
  })

  it('emit без подписчиков не вызывает ошибку', () => {
    const emitter = new TypedEmitter<{ test: [] }>()
    expect(() => emitter.emit('test')).not.toThrow()
  })

  it('поддерживает события без аргументов', () => {
    const emitter = new TypedEmitter<{ ping: [] }>()
    const callback = vi.fn()

    emitter.on('ping', callback)
    emitter.emit('ping')

    expect(callback).toHaveBeenCalledWith()
  })

  it('поддерживает события с несколькими аргументами', () => {
    const emitter = new TypedEmitter<{ coords: [x: number, y: number] }>()
    const callback = vi.fn()

    emitter.on('coords', callback)
    emitter.emit('coords', 10, 20)

    expect(callback).toHaveBeenCalledWith(10, 20)
  })
})

describe('createAppEmitter', () => {
  it('создаёт TypedEmitter<AppEvents>', () => {
    const emitter = createAppEmitter()
    expect(emitter).toBeInstanceOf(TypedEmitter)
  })

  it('обрабатывает событие click', () => {
    const emitter = createAppEmitter()
    const callback = vi.fn()

    emitter.on('click', callback)
    emitter.emit('click', 100, 200)

    expect(callback).toHaveBeenCalledWith(100, 200)
  })

  it('обрабатывает событие change', () => {
    const emitter = createAppEmitter()
    const callback = vi.fn()

    emitter.on('change', callback)
    emitter.emit('change', 'новое значение')

    expect(callback).toHaveBeenCalledWith('новое значение')
  })

  it('обрабатывает событие error', () => {
    const emitter = createAppEmitter()
    const callback = vi.fn()

    emitter.on('error', callback)
    emitter.emit('error', 404, 'Не найдено')

    expect(callback).toHaveBeenCalledWith(404, 'Не найдено')
  })

  it('обрабатывает событие load', () => {
    const emitter = createAppEmitter()
    const callback = vi.fn()

    emitter.on('load', callback)
    emitter.emit('load')

    expect(callback).toHaveBeenCalledWith()
  })

  it('off работает для конкретного события', () => {
    const emitter = createAppEmitter()
    const clickCb = vi.fn()
    const changeCb = vi.fn()

    emitter.on('click', clickCb)
    emitter.on('change', changeCb)

    emitter.off('click', clickCb)

    emitter.emit('click', 0, 0)
    emitter.emit('change', 'тест')

    expect(clickCb).not.toHaveBeenCalled()
    expect(changeCb).toHaveBeenCalledWith('тест')
  })
})
