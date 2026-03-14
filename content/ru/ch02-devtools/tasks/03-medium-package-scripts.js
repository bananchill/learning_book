/**
 * Задача: Генератор scripts для package.json
 *
 * Создайте функцию generatePackageScripts, которая принимает конфигурацию
 * проекта и возвращает объект scripts для package.json.
 *
 * Параметры config:
 * - linter: 'eslint' | 'biome' — линтер проекта
 * - formatter: 'prettier' | 'biome' — форматтер
 * - testRunner: 'vitest' | 'jest' — тестовый фреймворк
 * - srcDir: string — директория с исходниками (по умолчанию 'src')
 * - typescript: boolean — проект на TypeScript
 *
 * Должен возвращать scripts с командами:
 * - lint: команда запуска линтера
 * - lint:fix: команда линтера с автоисправлением
 * - format: команда форматтера
 * - test: команда запуска тестов
 * - test:watch: команда тестов в watch режиме
 * - typecheck: команда проверки типов (только если typescript: true)
 *
 * Пример:
 * generatePackageScripts({ linter: 'eslint', formatter: 'prettier', testRunner: 'vitest', srcDir: 'src', typescript: true })
 * // =>
 * {
 *   lint: 'eslint src/',
 *   'lint:fix': 'eslint src/ --fix',
 *   format: 'prettier --write src/',
 *   test: 'vitest run',
 *   'test:watch': 'vitest',
 *   typecheck: 'tsc --noEmit'
 * }
 */

/**
 * Генерирует объект scripts для package.json
 * @param {Object} config - Конфигурация проекта
 * @returns {Object} Объект scripts
 */
export function generatePackageScripts(config = {}) {
  // TODO: реализуйте функцию
}
