// Задание: создай систему типов для сущностей с метаданными

// 1. Создай интерфейс Entity с полем:
//    - readonly id: number

// export interface Entity { ... }

// 2. Создай тип WithTimestamps<T>, который добавляет к T поля:
//    - createdAt: Date
//    - updatedAt: Date
//    Используй пересечение (&)

// export type WithTimestamps<T> = ...

// 3. Создай тип SoftDeletable<T>, который добавляет к T поля:
//    - deletedAt: Date | null (null — не удалён)

// export type SoftDeletable<T> = ...

// 4. Создай интерфейс User, который расширяет Entity через extends:
//    - name: string
//    - email: string

// export interface User extends Entity { ... }

// 5. Создай тип FullUser, который комбинирует User + WithTimestamps + SoftDeletable.
//    Результат: объект с id, name, email, createdAt, updatedAt, deletedAt

// export type FullUser = ...

// 6. Напиши функцию createUser, которая принимает name и email,
//    и возвращает FullUser с автоматически заполненными полями:
//    - id: Math.floor(Math.random() * 10000)  — для простоты
//    - createdAt и updatedAt: new Date()
//    - deletedAt: null

// export function createUser(name: string, email: string): FullUser { ... }

// 7. Напиши функцию softDelete, которая принимает FullUser
//    и возвращает новый FullUser с deletedAt = new Date() и обновлённым updatedAt

// export function softDelete(user: FullUser): FullUser { ... }

// 8. Напиши функцию isDeleted, которая принимает SoftDeletable<unknown>
//    и возвращает boolean

// export function isDeleted(entity: SoftDeletable<unknown>): boolean { ... }
