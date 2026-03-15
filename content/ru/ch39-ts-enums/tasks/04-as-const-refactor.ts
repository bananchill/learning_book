/**
 * Задача 4: Рефакторинг enum в as const (medium)
 *
 * Перепишите следующую enum-структуру на подход с as const объектами,
 * сохранив полную типобезопасность.
 *
 * Исходный enum (НЕ изменяйте):
 * enum ApiEndpoint {
 *   Users = "/api/users",
 *   Posts = "/api/posts",
 *   Comments = "/api/comments",
 *   Auth = "/api/auth",
 * }
 *
 * Требования:
 * 1. Создайте объект API_ENDPOINT с as const (те же ключи и значения)
 * 2. Создайте тип ApiEndpoint -- объединение значений объекта
 * 3. Создайте тип ApiEndpointKey -- объединение ключей объекта
 * 4. Реализуйте функцию isValidEndpoint(value: string): value is ApiEndpoint
 *    -- type guard, проверяющий что строка является валидным эндпоинтом
 * 5. Реализуйте функцию getEndpointKey(endpoint: ApiEndpoint): ApiEndpointKey
 *    -- по значению возвращает ключ (аналог reverse mapping)
 */

// Ваш код здесь:

export const API_ENDPOINT = {
  // Задайте значения
} as const;

export type ApiEndpoint = unknown; // Замените на правильный тип

export type ApiEndpointKey = unknown; // Замените на правильный тип

export function isValidEndpoint(value: string): value is ApiEndpoint {
  throw new Error("Не реализовано");
}

export function getEndpointKey(endpoint: ApiEndpoint): ApiEndpointKey {
  throw new Error("Не реализовано");
}
