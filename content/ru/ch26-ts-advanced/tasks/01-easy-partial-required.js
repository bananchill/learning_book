/**
 * Задача: myPartial и myRequired
 *
 * Реализуйте вспомогательные функции:
 * - myPartial(obj) — возвращает копию объекта (все поля уже "опциональны" в JS)
 * - myRequired(obj) — проверяет что все поля определены и возвращает объект,
 *   или бросает ошибку если какое-то поле undefined
 */

/**
 * Возвращает shallow копию объекта
 * @param {T} obj
 * @returns {Partial<T>}
 */
export function myPartial(obj) {
  // TODO: верните shallow копию объекта
}

/**
 * Проверяет что все поля не undefined
 * @param {T} obj
 * @returns {Required<T>}
 * @throws {Error} если поле undefined
 */
export function myRequired(obj) {
  // TODO: проверьте каждое поле — если undefined, бросьте ошибку
  // Формат ошибки: `Поле "${key}" обязательно`
}
