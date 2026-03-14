import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { withRetry } from './03-medium-with-retry'

describe('withRetry', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('возвращает результат при успехе с первой попытки', async () => {
    const fn = vi.fn().mockResolvedValue('успех')
    const result = await withRetry(fn, 3, 100)
    expect(result).toBe('успех')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('повторяет при ошибке', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('попытка 1'))
      .mockRejectedValueOnce(new Error('попытка 2'))
      .mockResolvedValue('успех на третий раз')

    const promise = withRetry(fn, 3, 100)
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result).toBe('успех на третий раз')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('бросает последнюю ошибку после всех попыток', async () => {
    const lastError = new Error('последняя ошибка')
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('ошибка 1'))
      .mockRejectedValueOnce(new Error('ошибка 2'))
      .mockRejectedValue(lastError)

    const promise = withRetry(fn, 3, 100)
    await vi.runAllTimersAsync()

    await expect(promise).rejects.toThrow('последняя ошибка')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('использует задержку между попытками', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('первая ошибка'))
      .mockResolvedValue('успех')

    const promise = withRetry(fn, 3, 500)

    expect(fn).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(499)
    expect(fn).toHaveBeenCalledTimes(1) // ещё не повторял

    await vi.advanceTimersByTimeAsync(1)
    expect(fn).toHaveBeenCalledTimes(2)

    await promise
  })
})
