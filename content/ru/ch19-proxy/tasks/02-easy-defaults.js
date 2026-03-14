/**
 * Задача: Объект со значениями по умолчанию
 *
 * Реализуй функцию withDefaults(obj, defaults), которая возвращает Proxy.
 * При обращении к свойству:
 * - если свойство есть в obj — вернуть его значение
 * - если свойства нет в obj — вернуть значение из defaults
 * - если нет ни там, ни там — вернуть undefined
 *
 * Запись должна идти в оригинальный obj (не в defaults).
 *
 * Примеры:
 *   const config = withDefaults(
 *     { host: 'production.com' },
 *     { host: 'localhost', port: 3000, debug: false }
 *   )
 *   config.host   // 'production.com' — из obj
 *   config.port   // 3000 — из defaults
 *   config.debug  // false — из defaults
 *   config.other  // undefined — нет нигде
 *
 *   config.port = 8080
 *   config.port   // 8080 — записали в obj
 */

export function withDefaults(obj, defaults) {
  // твой код здесь
}
