import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from './02-easy-throttle.js'

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('вызывает функцию при первом вызове', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 300)

    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('не вызывает повторно в период cooldown', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 300)

    throttled()
    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('вызывает снова после истечения интервала', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 300)

    throttled()
    vi.advanceTimersByTime(300)
    throttled()

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('передаёт аргументы в оригинальную функцию', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled(1, 2)
    expect(fn).toHaveBeenCalledWith(1, 2)
  })

  it('не выполняет промежуточные вызовы', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 300)

    throttled()                        // вызов 1 — выполняется
    vi.advanceTimersByTime(100)
    throttled()                        // пропускается
    vi.advanceTimersByTime(100)
    throttled()                        // пропускается
    vi.advanceTimersByTime(200)        // теперь 300 мс прошло
    throttled()                        // вызов 2 — выполняется

    expect(fn).toHaveBeenCalledTimes(2)
  })
})
