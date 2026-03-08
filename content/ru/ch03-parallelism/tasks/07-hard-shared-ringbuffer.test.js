import { describe, it, expect } from 'vitest'
import { RingBuffer } from './07-hard-shared-ringbuffer'

describe('RingBuffer', () => {
  it('push и pop одного элемента', () => {
    const rb = new RingBuffer(4)
    expect(rb.push(42)).toBe(true)
    expect(rb.pop()).toBe(42)
  })

  it('FIFO порядок', () => {
    const rb = new RingBuffer(4)
    rb.push(1)
    rb.push(2)
    rb.push(3)
    expect(rb.pop()).toBe(1)
    expect(rb.pop()).toBe(2)
    expect(rb.pop()).toBe(3)
  })

  it('pop из пустого буфера возвращает undefined', () => {
    const rb = new RingBuffer(4)
    expect(rb.pop()).toBeUndefined()
  })

  it('push в полный буфер возвращает false', () => {
    const rb = new RingBuffer(3)
    expect(rb.push(1)).toBe(true)
    expect(rb.push(2)).toBe(true)
    expect(rb.push(3)).toBe(true)
    expect(rb.push(4)).toBe(false) // буфер полон
  })

  it('size отражает текущее количество элементов', () => {
    const rb = new RingBuffer(4)
    expect(rb.size).toBe(0)
    rb.push(1)
    expect(rb.size).toBe(1)
    rb.push(2)
    expect(rb.size).toBe(2)
    rb.pop()
    expect(rb.size).toBe(1)
    rb.pop()
    expect(rb.size).toBe(0)
  })

  it('wraparound: буфер переиспользуется после чтения', () => {
    const rb = new RingBuffer(3)
    rb.push(1)
    rb.push(2)
    rb.push(3)
    rb.pop() // освободили 1 слот
    expect(rb.push(4)).toBe(true) // wraparound
    expect(rb.pop()).toBe(2)
    expect(rb.pop()).toBe(3)
    expect(rb.pop()).toBe(4)
  })

  it('многократный wraparound', () => {
    const rb = new RingBuffer(2)
    for (let i = 0; i < 10; i++) {
      expect(rb.push(i)).toBe(true)
      expect(rb.pop()).toBe(i)
    }
  })
})
