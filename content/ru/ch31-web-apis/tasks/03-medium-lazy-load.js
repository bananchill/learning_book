/**
 * Задача: lazyLoad — ленивая загрузка изображений через IntersectionObserver
 *
 * Реализуйте функцию lazyLoad(selector = 'img[data-src]'):
 * - Создаёт IntersectionObserver с rootMargin: '100px'
 * - Когда элемент появляется в viewport:
 *   1. Копирует data-src в src
 *   2. Удаляет атрибут data-src
 *   3. Прекращает наблюдение за этим элементом
 * - Наблюдает за всеми элементами, соответствующими selector
 *
 * Возвращает функцию disconnect для прекращения всех наблюдений.
 *
 * @param {string} [selector='img[data-src]']
 * @returns {() => void} функция disconnect
 */
export function lazyLoad(selector = 'img[data-src]') {
  // TODO: реализуйте lazy loading через IntersectionObserver
}
