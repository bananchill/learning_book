import { describe, it, expect } from 'vitest'
import { Stack } from './02-easy-stack.js'

describe('Stack', () => {
  it('создаётся пустым', () => {
    const stack = new Stack()
    expect(stack.size).toBe(0)
    expect(stack.isEmpty()).toBe(true)
  })

  it('push добавляет элементы', () => {
    const stack = new Stack()
    stack.push(1)
    stack.push(2)
    expect(stack.size).toBe(2)
  })

  it('pop возвращает верхний элемент и удаляет его', () => {
    const stack = new Stack()
    stack.push('первый')
    stack.push('второй')
    expect(stack.pop()).toBe('второй')
    expect(stack.size).toBe(1)
  })

  it('pop возвращает undefined для пустого стека', () => {
    const stack = new Stack()
    expect(stack.pop()).toBeUndefined()
  })

  it('peek возвращает верхний элемент без удаления', () => {
    const stack = new Stack()
    stack.push(10)
    stack.push(20)
    expect(stack.peek()).toBe(20)
    expect(stack.size).toBe(2) // размер не изменился
  })

  it('peek возвращает undefined для пустого стека', () => {
    const stack = new Stack()
    expect(stack.peek()).toBeUndefined()
  })

  it('LIFO порядок — последний пришёл, первый ушёл', () => {
    const stack = new Stack()
    stack.push(1)
    stack.push(2)
    stack.push(3)
    expect(stack.pop()).toBe(3)
    expect(stack.pop()).toBe(2)
    expect(stack.pop()).toBe(1)
    expect(stack.isEmpty()).toBe(true)
  })
})
