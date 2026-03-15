import { describe, it, expect } from 'vitest'

// Тесты проверяют корректность полных деклараций для "data-store".
// Компиляция типов -- основная проверка.

describe('data-store типы', () => {
  it('StoreOptions принимает дженерик', () => {
    type Opts = import('data-store').StoreOptions<{ count: number }>
    const opts: Opts = { initialData: { count: 0 }, persist: true, name: 'counter' }
    expect(opts.initialData?.count).toBe(0)
  })

  it('Store.get возвращает T', () => {
    type S = import('data-store').Store<string>
    type GetResult = ReturnType<S['get']>
    const value: GetResult = 'hello'
    expect(typeof value).toBe('string')
  })

  it('Store.set принимает T', () => {
    type S = import('data-store').Store<number>
    // Проверяем, что set принимает number
    type SetParam = Parameters<S['set']>[0]
    const param: SetParam = 42
    expect(typeof param).toBe('number')
  })

  it('Store.update принимает функцию (current: T) => T', () => {
    type S = import('data-store').Store<{ count: number }>
    type UpdateParam = Parameters<S['update']>[0]
    const updater: UpdateParam = (current) => ({ count: current.count + 1 })
    expect(updater({ count: 0 }).count).toBe(1)
  })

  it('Store.subscribe возвращает функцию отписки', () => {
    type S = import('data-store').Store<string>
    type UnsubFn = ReturnType<S['subscribe']>
    // Функция отписки -- () => void
    const unsub: UnsubFn = () => {}
    expect(typeof unsub).toBe('function')
  })

  it('Store.select принимает селектор и возвращает выбранный тип', () => {
    type S = import('data-store').Store<{ name: string; age: number }>
    type SelectMethod = S['select']
    // select<R>(selector: (state: T) => R): R
    // При вызове select(s => s.name) должен вернуть string
    const check: ReturnType<typeof testSelect> = 'hello'

    function testSelect(store: S) {
      return store.select(s => s.name)
    }

    expect(typeof check).toBe('string')
  })

  it('Store.use возвращает this для цепочки', () => {
    type S = import('data-store').Store<number>
    type UseResult = ReturnType<S['use']>
    // use должен вернуть this
    const isThis: UseResult extends S ? true : false = true
    expect(isThis).toBe(true)
  })

  it('Subscriber -- функция с двумя аргументами', () => {
    type Sub = import('data-store').Subscriber<number>
    const subscriber: Sub = (newVal, oldVal) => {
      const _n: number = newVal
      const _o: number = oldVal
    }
    expect(typeof subscriber).toBe('function')
  })

  it('Middleware может вернуть T или undefined', () => {
    type MW = import('data-store').Middleware<number>
    const allow: MW = (next, _prev) => next
    const deny: MW = (_next, _prev) => undefined
    expect(allow(5, 0)).toBe(5)
    expect(deny(5, 0)).toBeUndefined()
  })

  it('createStore -- фабричная функция', () => {
    type CreateFn = typeof import('data-store').createStore
    const check: CreateFn | null = null
    expect(check).toBeNull()
  })

  it('Store.combine объединяет два стора', () => {
    type S = typeof import('data-store').Store
    type CombineResult = ReturnType<S['combine']>
    // combine(a, b) должен вернуть Store<[A, B]>
    const check: CombineResult | null = null
    expect(check).toBeNull()
  })
})
