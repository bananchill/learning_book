import { describe, it, expect } from 'vitest'
import { formatProduct, getFinalPrice, type Product } from './01-easy-optional-props'

describe('Product interface', () => {
  it('принимает объект с обязательными полями', () => {
    const product: Product = { id: 1, name: 'Книга', price: 500 }
    expect(product.name).toBe('Книга')
  })

  it('принимает объект с optional полями', () => {
    const product: Product = {
      id: 2,
      name: 'Ручка',
      price: 100,
      description: 'Синяя',
      discount: 10,
    }
    expect(product.description).toBe('Синяя')
    expect(product.discount).toBe(10)
  })
})

describe('formatProduct', () => {
  it('форматирует товар без optional полей', () => {
    const product: Product = { id: 1, name: 'Книга', price: 500 }
    expect(formatProduct(product)).toBe('Товар: Книга, Цена: 500₽')
  })

  it('добавляет описание', () => {
    const product: Product = { id: 2, name: 'Ручка', price: 100, description: 'Синяя' }
    expect(formatProduct(product)).toBe('Товар: Ручка, Цена: 100₽ — Синяя')
  })

  it('добавляет скидку', () => {
    const product: Product = { id: 3, name: 'Тетрадь', price: 200, discount: 10 }
    expect(formatProduct(product)).toBe('Товар: Тетрадь, Цена: 200₽ (скидка 10%)')
  })

  it('добавляет и описание, и скидку', () => {
    const product: Product = {
      id: 4,
      name: 'Ластик',
      price: 50,
      description: 'Белый',
      discount: 5,
    }
    expect(formatProduct(product)).toBe('Товар: Ластик, Цена: 50₽ — Белый (скидка 5%)')
  })
})

describe('getFinalPrice', () => {
  it('возвращает исходную цену без скидки', () => {
    const product: Product = { id: 1, name: 'Книга', price: 500 }
    expect(getFinalPrice(product)).toBe(500)
  })

  it('применяет скидку 10%', () => {
    const product: Product = { id: 2, name: 'Ручка', price: 200, discount: 10 }
    expect(getFinalPrice(product)).toBe(180)
  })

  it('применяет скидку 50%', () => {
    const product: Product = { id: 3, name: 'Тетрадь', price: 1000, discount: 50 }
    expect(getFinalPrice(product)).toBe(500)
  })

  it('скидка 0% — цена не меняется', () => {
    const product: Product = { id: 4, name: 'Ластик', price: 100, discount: 0 }
    expect(getFinalPrice(product)).toBe(100)
  })
})
