/**
 * Задача: Union ключей объекта
 *
 * 1. Дан объект theme с цветами. Создайте тип ThemeColor — union его ключей.
 * 2. Реализуйте функцию isValidColor(value) — type guard,
 *    проверяющий, является ли строка валидным ключом theme.
 * 3. Реализуйте функцию getColor(color: ThemeColor) — возвращает
 *    значение цвета из theme.
 */

export const theme = {
  primary: '#3490dc',
  secondary: '#ffed4a',
  danger: '#e3342f',
  success: '#38c172',
  warning: '#f6993f',
}

// TODO: создайте тип ThemeColor — union ключей theme
export type ThemeColor = string // замените на правильный тип

// TODO: реализуйте type guard
export function isValidColor(value: string): value is ThemeColor {
  // TODO: проверьте, что value — ключ theme
  return false
}

// TODO: реализуйте функцию
export function getColor(color: ThemeColor): string {
  // TODO: верните значение цвета из theme
  return ''
}
