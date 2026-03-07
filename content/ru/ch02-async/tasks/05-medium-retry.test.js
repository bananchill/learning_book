import { describe, it, expect } from 'vitest'
import { retry } from './05-medium-retry'

describe('retry', () => {
  it('возвращает результат при успехе', async () => {
    const fn = () => Promise.resolve(42)
    const result = await retry(fn, 3, 10)
    expect(result).toBe(42)
  })

  it('повторяет при ошибке и возвращает результат', async () => {
    let attempts = 0
    const fn = () => {
      attempts++
      if (attempts < 3) throw new Error('fail')
      return Promise.resolve('ok')
    }
    const result = await retry(fn, 5, 10)
    expect(result).toBe('ok')
    expect(attempts).toBe(3)
  })

  it('выбрасывает ошибку после maxAttempts', async () => {
    const fn = () => { throw new Error('always fail') }
    let error
    try {
      await retry(fn, 3, 10)
    } catch (e) {
      error = e
    }
    expect(error.message).toBe('always fail')
  })
})
