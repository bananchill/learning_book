// Задание: создай типобезопасную систему событий (EventEmitter)
//
// Система должна гарантировать, что:
// - Можно подписаться только на известные события
// - Callback получает правильные аргументы для каждого события
// - emit вызывает callback с правильными типами аргументов

// 1. Создай интерфейс AppEvents — карту событий приложения:
//    - "click": аргументы [x: number, y: number]
//    - "change": аргументы [value: string]
//    - "error": аргументы [code: number, message: string]
//    - "load": аргументы [] (без аргументов)

// export interface AppEvents { ... }

// 2. Создай generic-класс TypedEmitter<TEvents>,
//    параметризованный картой событий.
//
//    Карта событий — это интерфейс, где ключ = имя события,
//    значение = массив (кортеж) типов аргументов.
//
//    Класс должен иметь:
//    - private listeners: частичный объект, где для каждого ключа K из TEvents
//      хранится массив функций, принимающих аргументы типа TEvents[K]
//    - on<K extends keyof TEvents>(event: K, callback: (...args: TEvents[K]) => void): void
//      — подписка на событие
//    - off<K extends keyof TEvents>(event: K, callback: (...args: TEvents[K]) => void): void
//      — отписка от события
//    - emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): void
//      — вызов всех подписчиков события с аргументами
//
//    Подсказка по типу listeners:
//    Partial<{ [K in keyof TEvents]: Array<(...args: TEvents[K]) => void> }>
//    Но для этого TEvents[K] должен быть массивом.
//    Добавь ограничение: TEvents extends Record<string, any[]>

// export class TypedEmitter<TEvents extends Record<string, any[]>> { ... }

// 3. Напиши функцию createAppEmitter, которая возвращает
//    TypedEmitter<AppEvents>

// export function createAppEmitter(): TypedEmitter<AppEvents> { ... }
