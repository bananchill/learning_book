// Типизируй API-ответ с discriminated union и type guards
//
// 1. Создай generic тип ApiResponse<T> — discriminated union:
//    - { status: 'success', data: T }
//    - { status: 'error', code: number, message: string }
//    - { status: 'loading' }
//
// 2. Напиши type guards:
//    - isSuccess(response) — сужает до success-варианта
//    - isError(response) — сужает до error-варианта
//
// 3. Напиши функцию getDataOrDefault, которая возвращает данные
//    из успешного ответа или значение по умолчанию

export type ApiResponse<T> = unknown // замени на discriminated union

export function isSuccess<T>(response: ApiResponse<T>): boolean {
  // Исправь возвращаемый тип на type predicate
  return false
}

export function isError<T>(response: ApiResponse<T>): boolean {
  // Исправь возвращаемый тип на type predicate
  return false
}

export function getDataOrDefault<T>(response: ApiResponse<T>, defaultValue: T): T {
  // Используй type guard для безопасного доступа к data
  return defaultValue
}
