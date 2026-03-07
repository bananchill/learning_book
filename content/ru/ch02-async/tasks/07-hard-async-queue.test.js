import { describe, it, expect } from 'vitest'
import { createAsyncQueue } from './07-hard-async-queue'

describe('createAsyncQueue', () => {
  it('выполняет задачи последовательно', async () => {
    const queue = createAsyncQueue()
    const order = []
    queue.enqueue(async () => {
      await new Promise(r => setTimeout(r, 30))
      order.push(1)
    })
    queue.enqueue(async () => {
      order.push(2)
    })
    await queue.enqueue(async () => {
      order.push(3)
    })
    expect(order).toEqual([1, 2, 3])
  })

  it('возвращает результат задачи', async () => {
    const queue = createAsyncQueue()
    const result = await queue.enqueue(async () => 42)
    expect(result).toBe(42)
  })

  it('пробрасывает ошибки, но не ломает очередь', async () => {
    const queue = createAsyncQueue()
    let error
    try {
      await queue.enqueue(async () => { throw new Error('oops') })
    } catch (e) {
      error = e
    }
    expect(error.message).toBe('oops')

    const result = await queue.enqueue(async () => 'ok')
    expect(result).toBe('ok')
  })
})
