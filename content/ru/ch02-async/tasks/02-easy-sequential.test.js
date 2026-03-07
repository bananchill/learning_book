import { describe, it, expect } from 'vitest'
import { sequential } from './02-easy-sequential'

describe('sequential', () => {
  it('выполняет задачи последовательно', async () => {
    const order = []
    const tasks = [
      () => new Promise(r => { order.push(1); r('a') }),
      () => new Promise(r => { order.push(2); r('b') }),
      () => new Promise(r => { order.push(3); r('c') }),
    ]
    await sequential(tasks)
    expect(order).toEqual([1, 2, 3])
  })

  it('возвращает массив результатов', async () => {
    const tasks = [
      () => Promise.resolve(10),
      () => Promise.resolve(20),
      () => Promise.resolve(30),
    ]
    const results = await sequential(tasks)
    expect(results).toEqual([10, 20, 30])
  })

  it('работает с пустым массивом', async () => {
    const results = await sequential([])
    expect(results).toEqual([])
  })
})
