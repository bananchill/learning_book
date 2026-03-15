// Задание: создай модуль с именованными экспортами
// Каждая функция, интерфейс и константа должны быть экспортированы

// 1. Экспортируй интерфейс Product с полями:
//    - id: number
//    - name: string
//    - price: number

// 2. Экспортируй константу TAX_RATE = 0.2

// 3. Экспортируй функцию formatPrice, которая принимает number и возвращает string
//    Формат: "1 234.50 ₽" (число с двумя знаками после запятой + " ₽")
export function formatPrice(price: number): string {
  // Реализуй здесь
}

// 4. Экспортируй функцию calculateTotal, которая принимает Product[]
//    и возвращает итоговую сумму с учётом TAX_RATE
export function calculateTotal(products: any[]): number {
  // Реализуй здесь
}

// 5. Экспортируй функцию createProduct, которая принимает id, name, price
//    и возвращает объект Product
export function createProduct(id: any, name: any, price: any): any {
  // Реализуй здесь
}
