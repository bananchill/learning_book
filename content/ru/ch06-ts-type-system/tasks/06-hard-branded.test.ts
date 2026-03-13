import { describe, it, expect } from 'vitest'
import {
  createUserId,
  createOrderId,
  createEmail,
  getUser,
  getOrder
} from './06-hard-branded'

describe('createUserId', () => {
  it('создаёт UserId из валидного id', () => {
    const id = createUserId('user_123')
    expect(getUser(id)).toBe('User: user_123')
  })

  it('выбрасывает ошибку для пустой строки', () => {
    expect(() => createUserId('')).toThrow()
  })

  it('выбрасывает ошибку для id без префикса user_', () => {
    expect(() => createUserId('123')).toThrow()
    expect(() => createUserId('order_123')).toThrow()
  })
})

describe('createOrderId', () => {
  it('создаёт OrderId из валидного id', () => {
    const id = createOrderId('order_456')
    expect(getOrder(id)).toBe('Order: order_456')
  })

  it('выбрасывает ошибку для id без префикса order_', () => {
    expect(() => createOrderId('user_123')).toThrow()
    expect(() => createOrderId('')).toThrow()
  })
})

describe('createEmail', () => {
  it('создаёт Email из валидного адреса', () => {
    const email = createEmail('alex@example.com')
    expect(String(email)).toBe('alex@example.com')
  })

  it('выбрасывает ошибку для невалидного email', () => {
    expect(() => createEmail('not-an-email')).toThrow()
    expect(() => createEmail('missing@dot')).toThrow()
    expect(() => createEmail('')).toThrow()
  })
})

describe('type safety', () => {
  it('UserId и OrderId несовместимы в рантайме через валидацию', () => {
    const userId = createUserId('user_1')
    const orderId = createOrderId('order_1')

    // Эти вызовы работают корректно
    expect(getUser(userId)).toBe('User: user_1')
    expect(getOrder(orderId)).toBe('Order: order_1')
  })
})
