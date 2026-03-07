import { describe, it, expect } from 'vitest'
import { promiseAll } from './04-medium-promise-all'

describe('promiseAll', () => {
  it('резолвит массив результатов', async () => {
    const result = await promiseAll([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ])
    expect(result).toEqual([1, 2, 3])
  })

  it('сохраняет порядок результатов', async () => {
    const result = await promiseAll([
      new Promise(r => setTimeout(() => r('slow'), 50)),
      Promise.resolve('fast'),
    ])
    expect(result).toEqual(['slow', 'fast'])
  })

  it('реджектится при первой ошибке', async () => {
    let error
    try {
      await promiseAll([
        Promise.resolve(1),
        Promise.reject(new Error('fail')),
        Promise.resolve(3),
      ])
    } catch (e) {
      error = e
    }
    expect(error.message).toBe('fail')
  })

  it('работает с пустым массивом', async () => {
    const result = await promiseAll([])
    expect(result).toEqual([])
  })
})
