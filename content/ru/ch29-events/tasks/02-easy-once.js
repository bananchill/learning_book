/**
 * Задача: once() — одноразовый обработчик событий
 *
 * Реализуйте функцию once(el, event, handler):
 * Обработчик должен сработать только один раз, после чего
 * автоматически удалиться.
 *
 * Возвращает функцию для принудительного удаления обработчика.
 *
 * @param {Element | EventTarget} el
 * @param {string} event
 * @param {(e: Event) => void} handler
 * @returns {() => void} функция принудительной отписки
 */
export function once(el, event, handler) {
  // TODO: реализуйте одноразовый обработчик
}
