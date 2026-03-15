/**
 * Задача 2: HTTP-статусы (easy)
 *
 * Создайте числовой enum HttpStatus с кодами:
 * Ok = 200, Created = 201, MovedPermanently = 301,
 * BadRequest = 400, NotFound = 404, InternalServerError = 500.
 *
 * Реализуйте функцию classifyStatus, которая принимает HttpStatus
 * и возвращает категорию:
 * - 200-299 -> "success"
 * - 300-399 -> "redirect"
 * - 400-499 -> "client_error"
 * - 500-599 -> "server_error"
 *
 * Реализуйте функцию getStatusName, которая использует reverse mapping
 * и возвращает имя статуса по его числовому значению.
 * Например: getStatusName(404) -> "NotFound"
 */

// Ваш код здесь:

export enum HttpStatus {
  // Задайте члены enum
}

export type StatusCategory = "success" | "redirect" | "client_error" | "server_error";

export function classifyStatus(status: HttpStatus): StatusCategory {
  // Реализуйте функцию
  throw new Error("Не реализовано");
}

export function getStatusName(code: number): string | undefined {
  // Используйте reverse mapping
  throw new Error("Не реализовано");
}
