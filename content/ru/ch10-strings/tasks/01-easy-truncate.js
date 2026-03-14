/**
 * Задача: Усечение строки
 *
 * Реализуйте функцию truncate(str, maxLength), которая:
 * - Если str.length <= maxLength — возвращает строку без изменений
 * - Если str.length > maxLength — обрезает до (maxLength - 3) символов
 *   и добавляет '...'
 *
 * Примеры:
 * truncate('Hello, World!', 20)  // 'Hello, World!'  (не обрезает)
 * truncate('Hello, World!', 10)  // 'Hello, ...'
 * truncate('Hello', 5)           // 'Hello'           (ровно maxLength)
 * truncate('Hello', 3)           // '...'             (maxLength <= 3)
 * truncate('Hi', 1)              // '...'             (или пустая?)
 */

/**
 * Обрезает строку до максимальной длины с добавлением '...'
 * @param {string} str - Исходная строка
 * @param {number} maxLength - Максимальная длина результата
 * @returns {string} Усечённая строка
 */
export function truncate(str, maxLength) {
  // TODO: реализуйте функцию
  // Подсказка: используйте str.slice()
}
