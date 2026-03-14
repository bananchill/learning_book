import { describe, it, expect } from 'vitest'
import { processOrders } from './03-medium-refactor-fp'

const orders = [
  { id: 1, status: 'active', items: [{ price: 100, qty: 2 }, { price: 50, qty: 1 }], currency: 'RUB' },
  { id: 2, status: 'cancelled', items: [{ price: 200, qty: 1 }], currency: 'RUB' },
  { id: 3, status: 'active', items: [{ price: 500, qty: 3 }], currency: 'USD' },
  { id: 4, status: 'active', items: [{ price: 10, qty: 10 }], currency: 'RUB' },
  { id: 5, status: 'active', items: [{ price: 300, qty: 2 }], currency: 'RUB' },
  { id: 6, status: 'active', items: [{ price: 75, qty: 4 }], currency: 'EUR' },
  { id: 7, status: 'active', items: [{ price: 1000, qty: 1 }], currency: 'USD' },
]

describe('processOrders', () => {
  it('возвращает только активные заказы', () => {
    const result = processOrders(orders)
    result.forEach(order => {
      expect(order).not.toHaveProperty('status', 'cancelled')
    })
  })

  it('преобразует в формат { id, total, currency }', () => {
    const result = processOrders(orders)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('total')
    expect(result[0]).toHaveProperty('currency')
  })

  it('вычисляет total как сумму price * qty', () => {
    const result = processOrders(orders)
    const order1 = result.find(o => o.id === 1)
    if (order1) expect(order1.total).toBe(250) // 100*2 + 50*1
  })

  it('сортирует по total убыванию', () => {
    const result = processOrders(orders)
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].total).toBeGreaterThanOrEqual(result[i].total)
    }
  })

  it('возвращает не более 5 заказов', () => {
    const result = processOrders(orders)
    expect(result.length).toBeLessThanOrEqual(5)
  })

  it('не мутирует входной массив', () => {
    const copy = JSON.parse(JSON.stringify(orders))
    processOrders(orders)
    expect(orders).toEqual(copy)
  })
})
