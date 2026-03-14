/**
 * Задача: Сравнение примитивных значений с поддержкой NaN
 *
 * Напишите функцию deepEqual, которая строго сравнивает два значения.
 *
 * Особые случаи:
 * - NaN должен быть равен NaN (в отличие от ===, где NaN !== NaN)
 * - +0 и -0 должны быть НЕ равны (в отличие от ===, где +0 === -0)
 * - Для примитивов — строгое сравнение
 *
 * Подсказка: используйте Object.is() — он правильно обрабатывает NaN и -0
 *
 * Примеры:
 * deepEqual(1, 1)         // true
 * deepEqual(1, 2)         // false
 * deepEqual(NaN, NaN)     // true  ← отличие от ===
 * deepEqual(+0, -0)       // false ← отличие от ===
 * deepEqual('a', 'a')     // true
 * deepEqual(null, null)   // true
 * deepEqual(null, undefined) // false
 * deepEqual(1, '1')       // false
 */

/**
 * Строго сравнивает два значения, корректно обрабатывая NaN и -0
 * @param {*} a - Первое значение
 * @param {*} b - Второе значение
 * @returns {boolean}
 */
export function deepEqual(a, b) {
  // TODO: реализуйте функцию
  // Подсказка: Object.is(a, b) — это именно то, что нужно
}
