/**
 * Задача: Классификация значений
 *
 * Напишите функцию classifyValue, которая принимает любое значение
 * и возвращает строку с его типом.
 *
 * Возможные возвращаемые значения:
 * - 'number'    — для числовых значений (включая NaN, Infinity)
 * - 'string'    — для строк
 * - 'boolean'   — для true/false
 * - 'null'      — для null (не 'object'!)
 * - 'undefined' — для undefined
 * - 'other'     — для всего остального (объекты, массивы, функции, символы)
 *
 * Примеры:
 * classifyValue(42)        // 'number'
 * classifyValue('hello')   // 'string'
 * classifyValue(true)      // 'boolean'
 * classifyValue(null)      // 'null'
 * classifyValue(undefined) // 'undefined'
 * classifyValue({})        // 'other'
 * classifyValue([])        // 'other'
 * classifyValue(NaN)       // 'number'
 */

/**
 * Классифицирует значение по типу
 * @param {*} value - Любое значение
 * @returns {'number'|'string'|'boolean'|'null'|'undefined'|'other'}
 */
export function classifyValue(value) {
  // TODO: реализуйте функцию
  // Подсказка: не забудьте про typeof null === 'object' (исторический баг)
}
