import { describe, it, expect } from 'vitest'
import { createStack } from './06-hard-private-stack'

describe('createStack', () => {
  it('push и pop работают по LIFO', () => {
    const stack = createStack()
    stack.push(1)
    stack.push(2)
    stack.push(3)
    expect(stack.pop()).toBe(3)
    expect(stack.pop()).toBe(2)
  })

  it('peek возвращает верхний элемент без удаления', () => {
    const stack = createStack()
    stack.push('a')
    expect(stack.peek()).toBe('a')
    expect(stack.size()).toBe(1)
  })

  it('size и isEmpty', () => {
    const stack = createStack()
    expect(stack.isEmpty()).toBe(true)
    expect(stack.size()).toBe(0)
    stack.push(1)
    expect(stack.isEmpty()).toBe(false)
    expect(stack.size()).toBe(1)
  })

  it('toArray возвращает копию', () => {
    const stack = createStack()
    stack.push(1)
    stack.push(2)
    const arr = stack.toArray()
    expect(arr).toEqual([1, 2])
    arr.push(3)
    expect(stack.size()).toBe(2)
  })

  it('внутренний массив недоступен снаружи', () => {
    const stack = createStack()
    stack.push(1)
    const keys = Object.keys(stack)
    const hasArray = keys.some(k => Array.isArray(stack[k]))
    expect(hasArray).toBe(false)
  })
})
