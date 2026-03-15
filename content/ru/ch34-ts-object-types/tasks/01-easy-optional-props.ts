// Задание: создай интерфейс Product и функцию для отображения товара

// 1. Создай интерфейс Product со следующими свойствами:
//    - readonly id: number (нельзя менять после создания)
//    - name: string (обязательное)
//    - price: number (обязательное)
//    - description?: string (необязательное)
//    - discount?: number (необязательное, процент скидки)

// Напиши интерфейс здесь:
// export interface Product { ... }

// 2. Напиши функцию formatProduct, которая принимает Product
//    и возвращает строку вида:
//    "Товар: <name>, Цена: <price>₽"
//    Если есть description, добавь: " — <description>"
//    Если есть discount, добавь: " (скидка <discount>%)"
//
//    Примеры:
//    { id: 1, name: "Книга", price: 500 }
//      → "Товар: Книга, Цена: 500₽"
//    { id: 2, name: "Ручка", price: 100, description: "Синяя" }
//      → "Товар: Ручка, Цена: 100₽ — Синяя"
//    { id: 3, name: "Тетрадь", price: 200, discount: 10 }
//      → "Товар: Тетрадь, Цена: 200₽ (скидка 10%)"
//    { id: 4, name: "Ластик", price: 50, description: "Белый", discount: 5 }
//      → "Товар: Ластик, Цена: 50₽ — Белый (скидка 5%)"

// export function formatProduct(product: Product): string { ... }

// 3. Напиши функцию getFinalPrice, которая принимает Product
//    и возвращает цену с учётом скидки.
//    Если скидки нет, возвращает исходную цену.

// export function getFinalPrice(product: Product): number { ... }
