/**
 * Задача: on() — делегированный обработчик событий
 *
 * Реализуйте функцию on(el, event, selector, handler):
 * - el: родительский элемент (контейнер)
 * - event: тип события ('click', 'input' и т.д.)
 * - selector: CSS-селектор целевых элементов
 * - handler: обработчик, вызываемый с context = найденный элемент
 *
 * Возвращает функцию для снятия обработчика.
 *
 * @param {Element} el
 * @param {string} event
 * @param {string} selector
 * @param {(e: Event) => void} handler
 * @returns {() => void} функция отписки
 */
export function on(el, event, selector, handler) {
  // TODO: реализуйте делегированный обработчик
}
