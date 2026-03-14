/**
 * Задача: Чтение аргументов командной строки
 *
 * Создайте функцию parseArgs, которая принимает массив аргументов
 * (как process.argv.slice(2)) и возвращает объект с разобранными аргументами.
 *
 * Поддерживаемые форматы:
 * - --key=value  => { key: 'value' }
 * - --flag       => { flag: true }
 * - позиционные аргументы (без --) собираются в массив _
 *
 * Пример:
 * parseArgs(['--host=localhost', '--port=3000', '--verbose', 'file.js'])
 * // => { host: 'localhost', port: '3000', verbose: true, _: ['file.js'] }
 *
 * parseArgs(['--name=World'])
 * // => { name: 'World', _: [] }
 */

/**
 * Парсит массив аргументов командной строки
 * @param {string[]} argv - Массив аргументов (обычно process.argv.slice(2))
 * @returns {Object} Разобранные аргументы
 */
export function parseArgs(argv = []) {
  // TODO: реализуйте функцию
}
