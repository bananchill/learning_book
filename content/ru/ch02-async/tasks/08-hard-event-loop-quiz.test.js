import { describe, it, expect } from 'vitest'
import { getExecutionOrder } from './08-hard-event-loop-quiz'

describe('getExecutionOrder', () => {
  it('возвращает правильный порядок [1, 2, 3, 4, 5, 6]', async () => {
    const order = await getExecutionOrder()
    expect(order).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('возвращает массив из 6 элементов', async () => {
    const order = await getExecutionOrder()
    expect(order).toHaveLength(6)
  })
})
