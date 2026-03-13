// Исправь ошибки типов в этом коде:
// 1. Замени все any на корректные типы
// 2. Добавь проверки для unknown
// 3. Исправь несовместимые присваивания

// ❌ Плохо: any отключает проверку типов
export function parseData(input: any): any {
  return input.toUpperCase()
}

// ❌ Плохо: any вместо конкретного типа
export function formatUser(user: any): string {
  return `${user.name} (${user.age})`
}

// ❌ Плохо: нет проверки типа для unknown
export function safeStringLength(value: unknown): number {
  return value.length
}

// ❌ Плохо: неправильный тип возврата
export function divide(a: number, b: number): number {
  if (b === 0) return 'ошибка деления на ноль'
  return a / b
}
