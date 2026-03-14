/**
 * Задача: Result<T, E> — явная обработка ошибок
 *
 * Реализуйте:
 * - ok(value) — создаёт успешный Result
 * - err(error) — создаёт Result с ошибкой
 * - map(result, fn) — применяет fn к value если result.ok === true
 * - mapError(result, fn) — применяет fn к error если result.ok === false
 * - getOrDefault(result, defaultValue) — возвращает value или defaultValue
 */

/**
 * Создаёт успешный результат
 * @param {T} value
 * @returns {{ ok: true, value: T }}
 */
export function ok(value) {
  // TODO: реализуйте
}

/**
 * Создаёт результат с ошибкой
 * @param {E} error
 * @returns {{ ok: false, error: E }}
 */
export function err(error) {
  // TODO: реализуйте
}

/**
 * Применяет функцию к значению успешного результата
 * @param {{ ok: boolean, value?: T, error?: E }} result
 * @param {(value: T) => U} fn
 * @returns {{ ok: boolean, value?: U, error?: E }}
 */
export function map(result, fn) {
  // TODO: если result.ok === true, верните ok(fn(result.value))
  // иначе верните result без изменений
}

/**
 * Применяет функцию к ошибке
 * @param {{ ok: boolean, value?: T, error?: E }} result
 * @param {(error: E) => F} fn
 * @returns {{ ok: boolean, value?: T, error?: F }}
 */
export function mapError(result, fn) {
  // TODO: если result.ok === false, верните err(fn(result.error))
  // иначе верните result без изменений
}

/**
 * Возвращает значение или дефолт
 * @param {{ ok: boolean, value?: T }} result
 * @param {T} defaultValue
 * @returns {T}
 */
export function getOrDefault(result, defaultValue) {
  // TODO: реализуйте
}
