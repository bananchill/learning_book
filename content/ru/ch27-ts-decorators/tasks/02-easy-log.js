/**
 * Задача: @log декоратор для методов
 *
 * Реализуйте фабрику декоратора log(prefix), которая:
 * 1. Логирует вызов метода: `[prefix] Вызов methodName(arg1, arg2, ...)`
 * 2. Вызывает оригинальный метод
 * 3. Логирует результат: `[prefix] Результат methodName: result`
 * 4. Возвращает оригинальный результат
 *
 * @param {string} prefix - префикс для логов
 * @returns декоратор метода
 */
export function log(prefix) {
  return function (target, propertyKey, descriptor) {
    // TODO: реализуйте обёртку вокруг descriptor.value
    // Не забудьте вернуть descriptor
  }
}
