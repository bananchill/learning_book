/**
 * Задача: Безопасное приведение типов в TSX
 *
 * В .tsx файлах нельзя использовать angle-bracket синтаксис (<Type>value).
 * Реализуйте функции приведения типов, используя оператор as.
 */

/**
 * Приводит unknown значение к string.
 * Если значение не является строкой — возвращает String(value).
 *
 * @param value - значение для приведения
 * @returns строковое представление
 */
export function castToString(value: unknown): string {
  // TODO: реализуйте функцию
}

/**
 * Приводит unknown значение к number.
 * Если значение не является числом — возвращает NaN.
 *
 * @param value - значение для приведения
 * @returns числовое значение или NaN
 */
export function castToNumber(value: unknown): number {
  // TODO: реализуйте функцию
}

/**
 * Парсит JSON-строку и приводит результат к типу T.
 * Используйте оператор as для приведения типа.
 *
 * @param json - JSON-строка
 * @returns распарсенный объект типа T
 */
export function parseJsonAs<T>(json: string): T {
  // TODO: реализуйте функцию
}
