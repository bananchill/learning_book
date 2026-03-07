import { describe, it, expect } from 'vitest'
import { createIdGenerator } from './03-easy-id-generator'

describe('createIdGenerator', () => {
  it('генерирует ID с префиксом', () => {
    const gen = createIdGenerator('user')
    expect(gen()).toBe('user-1')
    expect(gen()).toBe('user-2')
  })

  it('генераторы с разными префиксами независимы', () => {
    const userGen = createIdGenerator('user')
    const postGen = createIdGenerator('post')
    userGen()
    userGen()
    expect(postGen()).toBe('post-1')
    expect(userGen()).toBe('user-3')
  })
})
