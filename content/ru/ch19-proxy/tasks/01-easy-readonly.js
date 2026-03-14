/**
 * Задача: Иммутабельный объект
 *
 * Реализуй функцию readonly(obj), которая возвращает Proxy-обёртку,
 * запрещающую любые изменения объекта:
 * - запись свойств должна бросать TypeError
 * - удаление свойств должна бросать TypeError
 * - чтение работает нормально
 *
 * Примеры:
 *   const obj = readonly({ x: 1, y: 2 })
 *   obj.x          // 1 — чтение работает
 *   obj.x = 5      // TypeError: Cannot set property 'x' on readonly object
 *   delete obj.y   // TypeError: Cannot delete property 'y' on readonly object
 */

export function readonly(obj) {
  // твой код здесь
}
