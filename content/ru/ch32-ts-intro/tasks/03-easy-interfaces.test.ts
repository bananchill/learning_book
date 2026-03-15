import { describe, it, expect } from 'vitest'
import { describeProduct, getAvailable } from './03-easy-interfaces'

const laptop = {
  name: 'Ноутбук',
  price: 50000,
  inStock: true,
  category: 'Электроника',
}

const mouse = {
  name: 'Мышь',
  price: 1500,
  inStock: false,
}

const keyboard = {
  name: 'Клавиатура',
  price: 3000,
  inStock: true,
}

describe('describeProduct', () => {
  it('описывает товар без категории', () => {
    expect(describeProduct(mouse)).toBe('Товар: Мышь, цена: 1500 руб.')
  })

  it('описывает товар с категорией', () => {
    expect(describeProduct(laptop)).toBe(
      'Товар: Ноутбук, цена: 50000 руб., категория: Электроника'
    )
  })
})

describe('getAvailable', () => {
  it('возвращает только товары в наличии', () => {
    const result = getAvailable([laptop, mouse, keyboard])
    expect(result).toHaveLength(2)
    expect(result).toContainEqual(laptop)
    expect(result).toContainEqual(keyboard)
  })

  it('возвращает пустой массив, если ничего нет в наличии', () => {
    expect(getAvailable([mouse])).toHaveLength(0)
  })
})
