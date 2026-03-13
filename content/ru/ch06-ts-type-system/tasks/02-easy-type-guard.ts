// Напиши type guard isNotNull, который:
// 1. Принимает значение типа T | null
// 2. Возвращает true, если значение не null
// 3. Корректно сужает тип (type predicate)
//
// Затем используй его в функции filterNulls
// для фильтрации null-значений из массива

export function isNotNull<T>(value: T | null): boolean {
  // Исправь возвращаемый тип на type predicate
  // твой код здесь
  return false
}

export function filterNulls<T>(arr: (T | null)[]): T[] {
  // Используй isNotNull с Array.filter
  // твой код здесь
  return []
}
