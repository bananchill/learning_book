import { describe, it, expect } from 'vitest'
import { createRateLimiter } from './08-hard-rate-limiter'

describe('createRateLimiter', () => {
  it('позволяет вызвать fn maxCalls раз', () => {
    let callCount = 0
    const fn = (x) => { callCount++; return x * 2 }
    const limited = createRateLimiter(fn, 3, 1000)
    expect(limited(1)).toBe(2)
    expect(limited(2)).toBe(4)
    expect(limited(3)).toBe(6)
    expect(callCount).toBe(3)
  })

  it('блокирует вызовы сверх лимита', () => {
    let callCount = 0
    const fn = () => { callCount++; return 'ok' }
    const limited = createRateLimiter(fn, 2, 1000)
    limited()
    limited()
    expect(limited()).toBeUndefined()
    expect(callCount).toBe(2)
  })

  it('сбрасывает счётчик после интервала', async () => {
    let callCount = 0
    const fn = () => { callCount++; return 'ok' }
    // Короткий интервал для теста
    const limited = createRateLimiter(fn, 1, 50)
    limited()
    expect(limited()).toBeUndefined()

    // Ждём сброс интервала
    await new Promise(resolve => setTimeout(resolve, 60))
    expect(limited()).toBe('ok')
    expect(callCount).toBe(2)
  })
})
