// Задание: напиши .d.ts для библиотеки "event-emitter"
// Библиотека экспортирует класс EventEmitter с дженериками.

// API библиотеки:
//
// Тип EventMap = Record<string, unknown[]>
// Описывает карту событий: ключ -- имя события, значение -- массив аргументов callback-а
//
// Класс EventEmitter<T extends EventMap>:
//
// Конструктор: без параметров
//
// Методы:
//   on<K extends keyof T>(event: K, listener: (...args: T[K]) => void): this
//     Подписка на событие. Возвращает this для цепочки вызовов.
//
//   off<K extends keyof T>(event: K, listener: (...args: T[K]) => void): this
//     Отписка от события. Возвращает this.
//
//   emit<K extends keyof T>(event: K, ...args: T[K]): boolean
//     Вызвать все обработчики события. Возвращает true, если были обработчики.
//
//   once<K extends keyof T>(event: K, listener: (...args: T[K]) => void): this
//     Подписка на одноразовое событие. Возвращает this.
//
//   listenerCount<K extends keyof T>(event: K): number
//     Возвращает количество обработчиков для события.
//
// Статический метод:
//   static create<T extends EventMap>(): EventEmitter<T>
//     Фабричный метод для создания экземпляра.
//
// Напиши declare module "event-emitter" { ... } со всеми типами:

// declare module "event-emitter" {
//   ...
// }
