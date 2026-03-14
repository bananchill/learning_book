/**
 * Задача: Парсинг конфигурации с деструктуризацией
 *
 * Напишите функцию parseConfig, которая принимает объект конфигурации
 * и возвращает нормализованный конфиг с дефолтными значениями.
 *
 * Используйте деструктуризацию с дефолтными значениями.
 *
 * Дефолтные значения:
 * - host: 'localhost'
 * - port: 3000
 * - ssl: false
 * - timeout: 5000
 * - retries: 3
 *
 * Функция должна:
 * 1. Принимать частичный конфиг (некоторые поля могут отсутствовать)
 * 2. Заполнять отсутствующие поля дефолтами
 * 3. Возвращать полный объект конфигурации
 * 4. НЕ мутировать входной объект
 *
 * Примеры:
 * parseConfig({})
 * // => { host: 'localhost', port: 3000, ssl: false, timeout: 5000, retries: 3 }
 *
 * parseConfig({ port: 8080, ssl: true })
 * // => { host: 'localhost', port: 8080, ssl: true, timeout: 5000, retries: 3 }
 *
 * parseConfig({ host: 'api.example.com', port: 443, ssl: true, timeout: 10000, retries: 5 })
 * // => { host: 'api.example.com', port: 443, ssl: true, timeout: 10000, retries: 5 }
 */

/**
 * Нормализует конфиг, применяя дефолтные значения
 * @param {Object} config - Частичный конфиг
 * @returns {{ host: string, port: number, ssl: boolean, timeout: number, retries: number }}
 */
export function parseConfig(config = {}) {
  // TODO: используйте деструктуризацию с дефолтными значениями
  // const { host = 'localhost', ... } = config;
}
