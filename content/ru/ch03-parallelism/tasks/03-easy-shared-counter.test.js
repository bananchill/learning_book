import { describe, it, expect } from 'vitest'
import { atomicIncrement } from './03-easy-shared-counter'

describe('atomicIncrement', () => {
  it('увеличивает значение на 1', () => {
    const sab = new SharedArrayBuffer(4)
    const view = new Int32Array(sab)
    view[0] = 0

    const result = atomicIncrement(view, 0)
    expect(result).toBe(1)
    expect(Atomics.load(view, 0)).toBe(1)
  })

  it('возвращает новое значение', () => {
    const sab = new SharedArrayBuffer(4)
    const view = new Int32Array(sab)
    Atomics.store(view, 0, 10)

    const result = atomicIncrement(view, 0)
    expect(result).toBe(11)
  })

  it('работает с разными индексами', () => {
    const sab = new SharedArrayBuffer(16)
    const view = new Int32Array(sab)

    atomicIncrement(view, 0)
    atomicIncrement(view, 0)
    atomicIncrement(view, 2)

    expect(Atomics.load(view, 0)).toBe(2)
    expect(Atomics.load(view, 1)).toBe(0)
    expect(Atomics.load(view, 2)).toBe(1)
  })

  it('корректно инкрементирует последовательно', () => {
    const sab = new SharedArrayBuffer(4)
    const view = new Int32Array(sab)

    for (let i = 0; i < 100; i++) {
      atomicIncrement(view, 0)
    }

    expect(Atomics.load(view, 0)).toBe(100)
  })
})
