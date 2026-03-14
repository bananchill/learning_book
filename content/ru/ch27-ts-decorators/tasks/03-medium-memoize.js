/**
 * Задача: @memoize декоратор с кэшированием по экземпляру
 *
 * Реализуйте декоратор memoize для методов:
 * - Кэширует результаты вызовов по аргументам (JSON.stringify)
 * - Каждый экземпляр имеет свой кэш (WeakMap)
 * - При повторном вызове с теми же аргументами возвращает кэш
 *
 * @param {object} target - прототип класса
 * @param {string} propertyKey - имя метода
 * @param {PropertyDescriptor} descriptor - дескриптор
 * @returns {PropertyDescriptor} изменённый дескриптор
 */
export function memoize(target, propertyKey, descriptor) {
  // TODO: реализуйте кэширование
  // Подсказка: используйте WeakMap<object, Map<string, any>>
  // для хранения кэша отдельно для каждого экземпляра
}
