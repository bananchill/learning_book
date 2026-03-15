/**
 * Задача 3: Система прав доступа (medium)
 *
 * Создайте enum Permission с битовыми флагами:
 * None = 0, Read = 1, Write = 2, Execute = 4, Delete = 8,
 * ReadWrite = Read | Write, Admin = Read | Write | Execute | Delete
 *
 * Реализуйте функции:
 *
 * 1. hasPermission(userPerms, checkPerm) -- проверяет, есть ли у пользователя
 *    конкретное право (возвращает boolean)
 *
 * 2. addPermission(currentPerms, newPerm) -- добавляет право к текущим
 *    (возвращает новую комбинацию Permission)
 *
 * 3. removePermission(currentPerms, removePerm) -- убирает право из текущих
 *    (возвращает новую комбинацию Permission)
 *
 * 4. listPermissions(perms) -- возвращает массив строковых имён отдельных прав
 *    (без None, ReadWrite, Admin -- только базовые: Read, Write, Execute, Delete)
 */

// Ваш код здесь:

export enum Permission {
  // Задайте члены enum с битовыми флагами
}

export function hasPermission(userPerms: Permission, checkPerm: Permission): boolean {
  throw new Error("Не реализовано");
}

export function addPermission(currentPerms: Permission, newPerm: Permission): Permission {
  throw new Error("Не реализовано");
}

export function removePermission(currentPerms: Permission, removePerm: Permission): Permission {
  throw new Error("Не реализовано");
}

export function listPermissions(perms: Permission): string[] {
  throw new Error("Не реализовано");
}
