/**
 * Задача: Тип элемента массива
 *
 * 1. Дан массив ROLES. Используя as const и индексный доступ,
 *    создайте тип Role — union элементов массива.
 * 2. Реализуйте type guard isValidRole(value).
 * 3. Реализуйте функцию formatRole(role) — возвращает
 *    русское название роли.
 */

// TODO: добавьте as const
export const ROLES = ['admin', 'editor', 'viewer']

// TODO: создайте тип Role через индексный доступ
export type Role = string // замените на правильный тип

// TODO: реализуйте type guard
export function isValidRole(value: string): value is Role {
  // TODO: проверьте, что value входит в ROLES
  return false
}

// TODO: реализуйте функцию
export function formatRole(role: Role): string {
  // TODO: верните русское название роли
  // admin → "Администратор", editor → "Редактор", viewer → "Читатель"
  return ''
}
