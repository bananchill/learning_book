import { describe, it, expect } from 'vitest'
import {
  confirmOrder,
  shipOrder,
  deliverOrder,
  getStatusDescription
} from './07-hard-state-machine'
import type { DraftOrder, ConfirmedOrder, ShippedOrder } from './07-hard-state-machine'

describe('state machine transitions', () => {
  const draft: DraftOrder = {
    status: 'draft',
    items: ['Книга', 'Ручка']
  }

  it('draft → confirmed', () => {
    const confirmed = confirmOrder(draft)
    expect(confirmed.status).toBe('confirmed')
    expect(confirmed.items).toEqual(['Книга', 'Ручка'])
    expect(confirmed.confirmedAt).toBeInstanceOf(Date)
  })

  it('confirmed → shipped', () => {
    const confirmed: ConfirmedOrder = {
      status: 'confirmed',
      items: ['Книга'],
      confirmedAt: new Date()
    }
    const shipped = shipOrder(confirmed, 'TRACK-123')
    expect(shipped.status).toBe('shipped')
    expect(shipped.trackingNumber).toBe('TRACK-123')
    expect(shipped.items).toEqual(['Книга'])
  })

  it('shipped → delivered', () => {
    const shipped: ShippedOrder = {
      status: 'shipped',
      items: ['Книга'],
      confirmedAt: new Date(),
      trackingNumber: 'TRACK-123'
    }
    const delivered = deliverOrder(shipped)
    expect(delivered.status).toBe('delivered')
    expect(delivered.deliveredAt).toBeInstanceOf(Date)
    expect(delivered.trackingNumber).toBe('TRACK-123')
  })

  it('полный цикл: draft → confirmed → shipped → delivered', () => {
    const confirmed = confirmOrder(draft)
    const shipped = shipOrder(confirmed, 'TRACK-456')
    const delivered = deliverOrder(shipped)

    expect(delivered.status).toBe('delivered')
    expect(delivered.items).toEqual(['Книга', 'Ручка'])
  })
})

describe('getStatusDescription', () => {
  it('описывает draft', () => {
    expect(getStatusDescription({ status: 'draft', items: [] }))
      .toBe('Черновик')
  })

  it('описывает confirmed', () => {
    expect(getStatusDescription({
      status: 'confirmed',
      items: [],
      confirmedAt: new Date()
    })).toBe('Подтверждён')
  })

  it('описывает shipped', () => {
    expect(getStatusDescription({
      status: 'shipped',
      items: [],
      confirmedAt: new Date(),
      trackingNumber: 'TRACK-1'
    })).toBe('Отправлен')
  })

  it('описывает delivered', () => {
    expect(getStatusDescription({
      status: 'delivered',
      items: [],
      confirmedAt: new Date(),
      trackingNumber: 'TRACK-1',
      deliveredAt: new Date()
    })).toBe('Доставлен')
  })
})
