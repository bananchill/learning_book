/**
 * Задача: Агрегирующий модуль
 *
 * Представь, что у нас есть три подмодуля (они замоканы ниже).
 * Реализуй агрегирующий модуль, который реэкспортирует из них:
 *
 * Из 'mathUtils':
 *   - add → экспортировать как add
 *   - multiply → экспортировать как multiply
 *
 * Из 'stringUtils':
 *   - capitalize → экспортировать как capitalize
 *   - trim → экспортировать как trimStr (переименование!)
 *
 * Из 'dateUtils':
 *   - default export (функция formatDate) → экспортировать как formatDate
 *
 * В реальном проекте это были бы:
 *   export { add, multiply } from './mathUtils.js'
 *   export { capitalize, trim as trimStr } from './stringUtils.js'
 *   export { default as formatDate } from './dateUtils.js'
 *
 * Для тестирования — реализуй функции напрямую в этом файле:
 */

// Функции из mathUtils
export function add(a, b) {
  // твой код здесь
}

export function multiply(a, b) {
  // твой код здесь
}

// Функции из stringUtils
export function capitalize(str) {
  // Первую букву — заглавную, остальные — строчные
  // твой код здесь
}

export function trimStr(str) {
  // твой код здесь
}

// Функция из dateUtils (default → named)
export function formatDate(date) {
  // Формат: 'YYYY-MM-DD'
  // твой код здесь
}
