import { describe, it, expect } from 'vitest'
import { withTimeout } from './03-easy-timeout-wrapper'

describe('withTimeout', () => {
  it('возвращает значение, если промис успевает', async () => {
    const fast = new Promise(r => setTimeout(() => r('done'), 10))
    const result = await withTimeout(fast, 100)
    expect(result).toBe('done')
  })

  it('реджектится с Timeout, если промис не успевает', async () => {
    const slow = new Promise(r => setTimeout(() => r('done'), 200))
    let error
    try {
      await withTimeout(slow, 50)
    } catch (e) {
      error = e
    }
    expect(error).toBeDefined()
    expect(error.message).toBe('Timeout')
  })

  it('пробрасывает ошибку промиса', async () => {
    const failing = Promise.reject(new Error('fail'))
    let error
    try {
      await withTimeout(failing, 100)
    } catch (e) {
      error = e
    }
    expect(error.message).toBe('fail')
  })
})
