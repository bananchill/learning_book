/**
 * Задача: Капитализация слов
 *
 * Реализуйте функцию capitalize(str), которая делает
 * первую букву каждого слова заглавной.
 * Слова разделены пробелами.
 *
 * Примеры:
 * capitalize('hello world')          // 'Hello World'
 * capitalize('the quick brown fox')  // 'The Quick Brown Fox'
 * capitalize('HELLO')                // 'HELLO' (уже заглавная, остальное не трогаем)
 * capitalize('hello')                // 'Hello'
 * capitalize('')                     // ''
 */

/**
 * Делает первую букву каждого слова заглавной
 * @param {string} str - Исходная строка
 * @returns {string} Строка с заглавными первыми буквами слов
 */
export function capitalize(str) {
  // TODO: реализуйте функцию
  // Подсказка: split по пробелу, для каждого слова
  // — word[0].toUpperCase() + word.slice(1), затем join
}
