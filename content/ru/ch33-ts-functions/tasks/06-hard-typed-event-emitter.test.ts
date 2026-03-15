import { describe, it, expect, vi } from 'vitest'
import { TypedEmitter } from './06-hard-typed-event-emitter'

interface TestEvents {
  greet: (name: string) => void;
  calculate: (a: number, b: number) => void;
  done: () => void;
}

describe('TypedEmitter', () => {
  it('вызывает обработчик при emit', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('greet', handler)
    emitter.emit('greet', 'Алиса')

    expect(handler).toHaveBeenCalledWith('Алиса')
  })

  it('поддерживает несколько обработчиков одного события', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on('greet', handler1)
    emitter.on('greet', handler2)
    emitter.emit('greet', 'Боб')

    expect(handler1).toHaveBeenCalledWith('Боб')
    expect(handler2).toHaveBeenCalledWith('Боб')
  })

  it('передаёт несколько аргументов', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('calculate', handler)
    emitter.emit('calculate', 10, 20)

    expect(handler).toHaveBeenCalledWith(10, 20)
  })

  it('поддерживает события без аргументов', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on('done', handler)
    emitter.emit('done')

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith()
  })

  it('off удаляет конкретный обработчик', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on('greet', handler1)
    emitter.on('greet', handler2)
    emitter.off('greet', handler1)
    emitter.emit('greet', 'Карл')

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).toHaveBeenCalledWith('Карл')
  })

  it('emit без подписчиков не падает', () => {
    const emitter = new TypedEmitter<TestEvents>()
    expect(() => emitter.emit('greet', 'тест')).not.toThrow()
  })

  it('разные события независимы', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const greetHandler = vi.fn()
    const doneHandler = vi.fn()

    emitter.on('greet', greetHandler)
    emitter.on('done', doneHandler)

    emitter.emit('greet', 'Алиса')
    expect(greetHandler).toHaveBeenCalledTimes(1)
    expect(doneHandler).not.toHaveBeenCalled()

    emitter.emit('done')
    expect(doneHandler).toHaveBeenCalledTimes(1)
  })

  it('off для несуществующего обработчика не падает', () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()
    expect(() => emitter.off('greet', handler)).not.toThrow()
  })
})
