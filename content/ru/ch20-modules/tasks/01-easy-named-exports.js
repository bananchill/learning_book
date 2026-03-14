/**
 * Задача: Именованные экспорты
 *
 * Реализуй следующие именованные экспорты:
 *
 * 1. Константа LOCALE — строка 'ru-RU'
 *
 * 2. Функция formatDate(date, locale = LOCALE) — форматирует Date в строку
 *    Используй Intl.DateTimeFormat с опциями:
 *    { year: 'numeric', month: 'long', day: 'numeric' }
 *    Пример: formatDate(new Date('2024-01-15')) → '15 января 2024 г.'
 *
 * 3. Функция formatCurrency(amount, currency = 'RUB', locale = LOCALE)
 *    Используй Intl.NumberFormat с опциями:
 *    { style: 'currency', currency }
 *    Пример: formatCurrency(1500) → '1 500,00 ₽'
 *            formatCurrency(100, 'USD', 'en-US') → '$100.00'
 */

export const LOCALE = 'ru-RU'

export function formatDate(date, locale = LOCALE) {
  // твой код здесь
}

export function formatCurrency(amount, currency = 'RUB', locale = LOCALE) {
  // твой код здесь
}
