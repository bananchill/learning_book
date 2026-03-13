// Создай branded types для доменной модели
//
// 1. Реализуй generic тип Brand<T, B>, который создаёт branded type
//    (intersection примитива с phantom-свойством)
//
// 2. Создай branded types:
//    - UserId (на основе string)
//    - OrderId (на основе string)
//    - Email (на основе string)
//
// 3. Создай конструкторы с валидацией:
//    - createUserId(id: string): UserId — id не пустой, начинается с 'user_'
//    - createOrderId(id: string): OrderId — id не пустой, начинается с 'order_'
//    - createEmail(email: string): Email — содержит '@' и '.'
//
// 4. Конструкторы должны выбрасывать ошибку при невалидном вводе

// Определи Brand<T, B>
// твой код здесь

export type UserId = string   // замени на branded type
export type OrderId = string  // замени на branded type
export type Email = string    // замени на branded type

export function createUserId(id: string): UserId {
  // Валидация + создание branded значения
  return id as UserId
}

export function createOrderId(id: string): OrderId {
  // Валидация + создание branded значения
  return id as OrderId
}

export function createEmail(email: string): Email {
  // Валидация + создание branded значения
  return email as Email
}

// Эта функция принимает ТОЛЬКО UserId, не OrderId и не обычную строку
export function getUser(id: UserId): string {
  return `User: ${id}`
}

// Эта функция принимает ТОЛЬКО OrderId
export function getOrder(id: OrderId): string {
  return `Order: ${id}`
}
