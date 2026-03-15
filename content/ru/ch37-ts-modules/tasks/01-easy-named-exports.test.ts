import { describe, it, expect } from 'vitest'
import {
  formatPrice,
  calculateTotal,
  createProduct,
  TAX_RATE,
} from './01-easy-named-exports'
import type { Product } from './01-easy-named-exports'

describe('TAX_RATE', () => {
  it('равна 0.2', () => {
    expect(TAX_RATE).toBe(0.2)
  })
})

describe('formatPrice', () => {
  it('форматирует целое число', () => {
    expect(formatPrice(100)).toBe('100.00 ₽')
  })

  it('форматирует дробное число', () => {
    expect(formatPrice(49.9)).toBe('49.90 ₽')
  })

  it('форматирует ноль', () => {
    expect(formatPrice(0)).toBe('0.00 ₽')
  })
})

describe('calculateTotal', () => {
  it('считает сумму с налогом для одного товара', () => {
    const products: Product[] = [{ id: 1, name: 'Книга', price: 100 }]
    expect(calculateTotal(products)).toBeCloseTo(120)
  })

  it('считает сумму с налогом для нескольких товаров', () => {
    const products: Product[] = [
      { id: 1, name: 'Книга', price: 100 },
      { id: 2, name: 'Ручка', price: 50 },
    ]
    expect(calculateTotal(products)).toBeCloseTo(180)
  })

  it('возвращает 0 для пустого массива', () => {
    expect(calculateTotal([])).toBe(0)
  })
})

describe('createProduct', () => {
  it('создаёт объект Product', () => {
    const product = createProduct(1, 'Тетрадь', 30)
    expect(product).toEqual({ id: 1, name: 'Тетрадь', price: 30 })
  })
})

describe('типы', () => {
  it('Product содержит нужные поля', () => {
    const product: Product = { id: 1, name: 'Тест', price: 10 }
    expect(product.id).toBe(1)
    expect(product.name).toBe('Тест')
    expect(product.price).toBe(10)
  })
})
