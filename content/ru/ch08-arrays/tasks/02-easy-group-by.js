/**
 * Задача: Группировка массива объектов по полю
 *
 * Напишите функцию groupBy, которая принимает массив объектов
 * и имя поля (или функцию-геттер), и группирует элементы по значению этого поля.
 *
 * Возвращает объект, где ключи — значения поля, значения — массивы элементов.
 *
 * Примеры:
 * groupBy([{role: 'admin', name: 'A'}, {role: 'user', name: 'B'}, {role: 'admin', name: 'C'}], 'role')
 * // { admin: [{role:'admin',name:'A'}, {role:'admin',name:'C'}], user: [{role:'user',name:'B'}] }
 *
 * groupBy([1, 2, 3, 4, 5, 6], n => n % 2 === 0 ? 'even' : 'odd')
 * // { odd: [1, 3, 5], even: [2, 4, 6] }
 *
 * groupBy([], 'type')
 * // {}
 */

/**
 * Группирует массив по ключу или функции
 * @param {Array} arr - Массив для группировки
 * @param {string|Function} keyOrFn - Поле объекта или функция-геттер ключа
 * @returns {Object} Сгруппированный объект
 */
export function groupBy(arr, keyOrFn) {
  // TODO: реализуйте через reduce
}
