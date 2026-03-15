// Задание: напиши функцию updateProduct
//
// Дан интерфейс Product. Функция updateProduct принимает:
// 1. product — объект Product
// 2. updates — объект с частичными изменениями (не все поля обязательны)
//
// Функция возвращает новый объект Product с применёнными изменениями.

export interface Product {
  id: number
  name: string
  price: number
  inStock: boolean
}

export function updateProduct(product: Product, updates: Partial<Product>): Product {
  // твой код здесь
  return product
}
