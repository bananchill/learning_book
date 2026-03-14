/**
 * Задача: animateValue — анимация числового значения через rAF
 *
 * Реализуйте функцию animateValue(element, from, to, duration):
 * - element: DOM элемент, в котором нужно анимировать значение
 * - from: начальное число
 * - to: конечное число
 * - duration: длительность анимации в мс
 *
 * Функция должна:
 * 1. Использовать requestAnimationFrame для плавной анимации
 * 2. Обновлять element.textContent каждый кадр
 * 3. Значение должно быть округлено до целого числа
 * 4. Возвращать функцию отмены анимации
 *
 * @param {HTMLElement} element
 * @param {number} from
 * @param {number} to
 * @param {number} duration
 * @returns {() => void} функция отмены
 */
export function animateValue(element, from, to, duration) {
  // TODO: реализуйте анимацию через requestAnimationFrame
}
