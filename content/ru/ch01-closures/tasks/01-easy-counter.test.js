import { describe, it, expect } from 'vitest'
import { createCounter } from './01-easy-counter'

describe('createCounter', () => {
  it('начальное значение — 0', () => {
    const counter = createCounter()
    expect(counter.getCount()).toBe(0)
  })

  it('increment увеличивает и возвращает значение', () => {
    const counter = createCounter()
    expect(counter.increment()).toBe(1)
    expect(counter.increment()).toBe(2)
  })

  it('decrement уменьшает и возвращает значение', () => {
    const counter = createCounter()
    counter.increment()
    counter.increment()
    expect(counter.decrement()).toBe(1)
  })

  it('счётчики независимы друг от друга', () => {
    const a = createCounter()
    const b = createCounter()
    a.increment()
    a.increment()
    expect(a.getCount()).toBe(2)
    expect(b.getCount()).toBe(0)
  })
})
