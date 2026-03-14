/**
 * Задача: Композиция функций
 *
 * Напишите функцию compose, которая принимает две функции f и g
 * и возвращает новую функцию h, такую что h(x) = f(g(x)).
 *
 * Другими словами: сначала применяется g, затем f к результату.
 *
 * Примеры:
 * const double = x => x * 2;
 * const addOne = x => x + 1;
 *
 * const doubleAfterAdd = compose(double, addOne);
 * doubleAfterAdd(5); // double(addOne(5)) = double(6) = 12
 *
 * const addAfterDouble = compose(addOne, double);
 * addAfterDouble(5); // addOne(double(5)) = addOne(10) = 11
 *
 * const square = x => x ** 2;
 * const negate = x => -x;
 * compose(negate, square)(3); // negate(square(3)) = negate(9) = -9
 */

/**
 * Компонирует две функции: возвращает функцию f(g(x))
 * @param {Function} f - Внешняя функция
 * @param {Function} g - Внутренняя функция
 * @returns {Function} Составная функция
 */
export function compose(f, g) {
  // TODO: реализуйте (одна строка!)
}
