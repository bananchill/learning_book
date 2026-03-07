import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRateLimiter } from './08-hard-rate-limiter'

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('позволяет вызвать fn maxCalls раз', () => {
    const fn = vi.fn((x) => x * 2)
    const limited = createRateLimiter(fn, 3, 1000)
    expect(limited(1)).toBe(2)
    expect(limited(2)).toBe(4)
    expect(limited(3)).toBe(6)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('блокирует вызовы сверх лимита', () => {
    const fn = vi.fn(() => 'ok')
    const limited = createRateLimiter(fn, 2, 1000)
    limited()
    limited()
    expect(limited()).toBeUndefined()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('сбрасывает счётчик после интервала', () => {
    const fn = vi.fn(() => 'ok')
    const limited = createRateLimiter(fn, 1, 1000)
    limited()
    expect(limited()).toBeUndefined()

    vi.advanceTimersByTime(1000)
    expect(limited()).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
