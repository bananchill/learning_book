/**
 * Задача: Настройка ESLint конфига
 *
 * Создайте функцию createEslintConfig, которая принимает объект опций
 * и возвращает корректный объект конфигурации ESLint.
 *
 * Параметры options:
 * - strict: boolean — если true, ошибки вместо предупреждений
 * - allowConsole: boolean — если true, console.log разрешён
 * - es6: boolean — если true, включить правила ES6+
 *
 * Пример:
 * createEslintConfig({ strict: false, allowConsole: true, es6: true })
 * // =>
 * {
 *   env: { es6: true, node: true, browser: true },
 *   rules: {
 *     'no-unused-vars': 'warn',
 *     'no-console': 'off',
 *     'no-var': 'warn',
 *     'prefer-const': 'warn'
 *   }
 * }
 */

/**
 * Создаёт объект конфигурации ESLint на основе переданных опций
 * @param {Object} options - Опции конфигурации
 * @param {boolean} options.strict - Использовать 'error' вместо 'warn'
 * @param {boolean} options.allowConsole - Разрешить console.log
 * @param {boolean} options.es6 - Включить правила ES6
 * @returns {Object} Объект конфигурации ESLint
 */
export function createEslintConfig(options = {}) {
  // TODO: реализуйте функцию
}
