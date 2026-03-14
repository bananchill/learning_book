import { describe, it, expect } from 'vitest'
import { Stack } from './02-easy-stack-class'

describe('Stack', () => {
  it('начально пуст', () => {
    const s = new Stack()
    expect(s.isEmpty()).toBe(true)
    expect(s.size).toBe(0)
  })

  it('push добавляет элемент', () => {
    const s = new Stack()
    s.push(1)
    expect(s.size).toBe(1)
    expect(s.isEmpty()).toBe(false)
  })

  it('pop возвращает и удаляет верхний элемент', () => {
    const s = new Stack()
    s.push('a')
    s.push('b')
    expect(s.pop()).toBe('b')
    expect(s.size).toBe(1)
  })

  it('pop пустого стека возвращает undefined', () => {
    const s = new Stack()
    expect(s.pop()).toBeUndefined()
  })

  it('peek возвращает верхний элемент без удаления', () => {
    const s = new Stack()
    s.push(42)
    expect(s.peek()).toBe(42)
    expect(s.size).toBe(1)  // не удалился
  })

  it('LIFO порядок', () => {
    const s = new Stack()
    s.push(1)
    s.push(2)
    s.push(3)
    expect(s.pop()).toBe(3)
    expect(s.pop()).toBe(2)
    expect(s.pop()).toBe(1)
  })

  it('isEmpty после pop последнего элемента', () => {
    const s = new Stack()
    s.push('x')
    s.pop()
    expect(s.isEmpty()).toBe(true)
  })
})
