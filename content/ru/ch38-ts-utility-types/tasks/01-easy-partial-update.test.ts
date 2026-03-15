import { describe, it, expect } from 'vitest'
import { updateProduct, type Product } from './01-easy-partial-update'

describe('updateProduct', () => {
  const original: Product = {
    id: 1,
    name: 'Ноутбук',
    price: 75000,
    inStock: true
  }

  it('обновляет одно поле', () => {
    const result = updateProduct(original, { price: 69999 })
    expect(result).toEqual({ id: 1, name: 'Ноутбук', price: 69999, inStock: true })
  })

  it('обновляет несколько полей', () => {
    const result = updateProduct(original, { name: 'Ноутбук Pro', price: 99000 })
    expect(result).toEqual({ id: 1, name: 'Ноутбук Pro', price: 99000, inStock: true })
  })

  it('не изменяет оригинальный объект', () => {
    updateProduct(original, { price: 0 })
    expect(original.price).toBe(75000)
  })

  it('возвращает копию при пустом updates', () => {
    const result = updateProduct(original, {})
    expect(result).toEqual(original)
    expect(result).not.toBe(original)
  })
})
