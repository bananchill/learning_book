// Задание: создай generic-тип Result<T, E> для представления результата операции

// 1. Создай тип Success<T> — объект с полями:
//    - ok: true (литеральный тип)
//    - value: T

// export type Success<T> = { ... }

// 2. Создай тип Failure<E> — объект с полями:
//    - ok: false (литеральный тип)
//    - error: E

// export type Failure<E> = { ... }

// 3. Создай объединённый тип Result<T, E> = Success<T> | Failure<E>

// export type Result<T, E> = ...

// 4. Напиши функцию-конструктор ok<T>, которая принимает значение
//    и возвращает Success<T>

// export function ok<T>(value: T): Success<T> { ... }

// 5. Напиши функцию-конструктор fail<E>, которая принимает ошибку
//    и возвращает Failure<E>

// export function fail<E>(error: E): Failure<E> { ... }

// 6. Напиши функцию map, которая принимает Result<T, E> и функцию-трансформер (T) => U.
//    Если результат ok — применяет трансформер к value и возвращает новый Success<U>.
//    Если результат не ok — возвращает Failure<E> без изменений.

// export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> { ... }

// 7. Напиши функцию getOrElse, которая принимает Result<T, E> и значение по умолчанию.
//    Если результат ok — возвращает value.
//    Если результат не ok — возвращает значение по умолчанию.

// export function getOrElse<T, E>(result: Result<T, E>, defaultValue: T): T { ... }
