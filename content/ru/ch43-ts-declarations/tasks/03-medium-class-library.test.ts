import { describe, it, expect } from 'vitest'

// Тесты проверяют корректность деклараций для модуля "event-emitter".
// Главная проверка -- компиляция типов.

describe('модуль event-emitter', () => {
  it('EventEmitter принимает дженерик EventMap', () => {
    type EE = import('event-emitter').EventEmitter<{
      click: [x: number, y: number]
      error: [message: string]
    }>

    // Проверяем, что тип существует
    const check: EE | null = null
    expect(check).toBeNull()
  })

  it('on возвращает this для цепочки', () => {
    type Events = { data: [payload: string]; end: [] }
    type EE = import('event-emitter').EventEmitter<Events>

    // Проверяем, что on возвращает this (тот же тип)
    type OnResult = ReturnType<EE['on']>
    const isThis: OnResult extends EE ? true : false = true
    expect(isThis).toBe(true)
  })

  it('emit возвращает boolean', () => {
    type Events = { data: [payload: string] }
    type EE = import('event-emitter').EventEmitter<Events>

    type EmitResult = ReturnType<EE['emit']>
    const check: EmitResult = true
    expect(typeof check).toBe('boolean')
  })

  it('listenerCount возвращает number', () => {
    type Events = { click: [] }
    type EE = import('event-emitter').EventEmitter<Events>

    type CountResult = ReturnType<EE['listenerCount']>
    const count: CountResult = 0
    expect(typeof count).toBe('number')
  })

  it('create -- статический метод, возвращающий экземпляр', () => {
    type EE = typeof import('event-emitter').EventEmitter
    // Статический метод create должен существовать
    type CreateFn = EE['create']
    const check: CreateFn | null = null
    expect(check).toBeNull()
  })
})
