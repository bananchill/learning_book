import { describe, it, expect } from 'vitest'
import { delay } from './01-easy-delay'

describe('delay', () => {
  it('возвращает промис', () => {
    const result = delay(10)
    expect(result).toBeDefined()
    expect(typeof result.then).toBe('function')
  })

  it('резолвится через указанное время', async () => {
    const start = Date.now()
    await delay(50)
    const elapsed = Date.now() - start
    expect(elapsed >= 40).toBe(true)
  })

  it('резолвится с undefined', async () => {
    const result = await delay(10)
    expect(result).toBeUndefined()
  })
})
