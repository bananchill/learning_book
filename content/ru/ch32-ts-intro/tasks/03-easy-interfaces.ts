// Задание: создай интерфейсы и используй их

// 1. Создай интерфейс Product с полями:
//    - name (строка)
//    - price (число)
//    - inStock (булево)
//    - category (строка, необязательное)

// твой интерфейс здесь

// 2. Напиши функцию, которая принимает Product и возвращает строку с описанием
// Формат: "Товар: {name}, цена: {price} руб."
// Если есть category, добавь: ", категория: {category}"
export function describeProduct(product: any): string {
  // твой код здесь
  return "";
}

// 3. Напиши функцию, которая принимает массив Product
// и возвращает только те, что есть в наличии (inStock === true)
export function getAvailable(products: any[]): any[] {
  // твой код здесь
  return [];
}
