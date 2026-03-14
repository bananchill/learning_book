/**
 * Задача: Мемоизация
 *
 * Напишите функцию memoize, которая принимает функцию fn
 * и возвращает мемоизированную версию.
 *
 * Мемоизированная функция:
 * - При первом вызове с определёнными аргументами — вычисляет и кэширует результат
 * - При повторном вызове с теми же аргументами — возвращает кэшированный результат
 *   без повторного вызова fn
 *
 * Для ключа кэша используйте JSON.stringify(args).
 *
 * Примеры:
 * let callCount = 0;
 * const expensiveFn = (n) => { callCount++; return n * 2; };
 * const memoized = memoize(expensiveFn);
 *
 * memoized(5);  // 10, callCount = 1
 * memoized(5);  // 10, callCount = 1 (кэш!)
 * memoized(3);  // 6, callCount = 2
 * memoized(3);  // 6, callCount = 2 (кэш!)
 */

/**
 * Возвращает мемоизированную версию функции
 * @param {Function} fn - Чистая функция для мемоизации
 * @returns {Function} Мемоизированная функция
 */
export function memoize(fn) {
  // TODO: реализуйте используя Map для кэша
}
