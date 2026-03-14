import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { debounce } from './01-easy-debounce.js'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('не вызывает функцию сразу', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    expect(fn).not.toHaveBeenCalled()
  })

  it('вызывает функцию после задержки', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('сбрасывает таймер при повторном вызове', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    vi.advanceTimersByTime(200)
    debounced()  // сброс таймера
    vi.advanceTimersByTime(200)  // 200 < 300, не должна вызваться

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)  // теперь 300 мс прошло с последнего вызова
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('вызывает только один раз при многократных вызовах', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('передаёт аргументы в оригинальную функцию', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('hello', 42)
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith('hello', 42)
  })
})
