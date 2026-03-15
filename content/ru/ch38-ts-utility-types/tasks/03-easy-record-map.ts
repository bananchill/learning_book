// Задание: словарь разрешений с Record
//
// 1. Определи тип Role = 'admin' | 'editor' | 'viewer'
// 2. Определи интерфейс Permission с полями: read, write, delete (все boolean)
// 3. Создай константу permissions типа Record<Role, Permission> с разрешениями:
//    - admin: всё true
//    - editor: read и write true, delete false
//    - viewer: только read true
// 4. Напиши функцию canPerform(role, action), которая проверяет разрешение

export type Role = 'admin' | 'editor' | 'viewer'

export interface Permission {
  read: boolean
  write: boolean
  delete: boolean
}

export type Action = keyof Permission

// Заполни словарь разрешений
export const permissions: Record<Role, Permission> = {
  admin: { read: false, write: false, delete: false },
  editor: { read: false, write: false, delete: false },
  viewer: { read: false, write: false, delete: false }
}

export function canPerform(role: Role, action: Action): boolean {
  // твой код здесь
  return false
}
