// Задание: напиши полноценный .d.ts для UMD-библиотеки "data-store"
//
// Библиотека представляет типобезопасное хранилище данных.
// Работает и как модуль (import), и как глобальная переменная (DataStore).
//
// API:
//
// === Типы ===
//
// Интерфейс StoreOptions<T>:
//   initialData?: T
//   persist?: boolean
//   name?: string
//
// Тип Subscriber<T> = (newValue: T, oldValue: T) => void
//
// Тип Selector<T, R> = (state: T) => R
//
// Тип Middleware<T> = (next: T, prev: T) => T | undefined
//   Если middleware возвращает undefined, обновление отменяется
//
// === Класс Store<T> ===
//
// Конструктор: (options: StoreOptions<T>)
//
// Методы:
//   get(): T
//     Возвращает текущее значение
//
//   set(value: T): void
//     Устанавливает новое значение
//
//   update(updater: (current: T) => T): void
//     Обновляет значение через функцию
//
//   subscribe(subscriber: Subscriber<T>): () => void
//     Подписка. Возвращает функцию отписки.
//
//   select<R>(selector: Selector<T, R>): R
//     Выбирает часть состояния
//
//   use(middleware: Middleware<T>): this
//     Добавляет middleware. Возвращает this.
//
//   reset(): void
//     Сбросить к initialData
//
//   destroy(): void
//     Очистить подписки и middleware
//
// Статические методы:
//   static create<T>(options: StoreOptions<T>): Store<T>
//   static combine<A, B>(a: Store<A>, b: Store<B>): Store<[A, B]>
//     Перегрузка для 3 аргументов:
//   static combine<A, B, C>(a: Store<A>, b: Store<B>, c: Store<C>): Store<[A, B, C]>
//
// === Функция createStore ===
//
// Экспортируемая функция-фабрика:
//   createStore<T>(options: StoreOptions<T>): Store<T>
//
// === UMD ===
//
// Библиотека доступна глобально как DataStore (export as namespace DataStore)
//
// === Default export ===
//
// Default export -- объект с полями:
//   Store: typeof Store
//   createStore: typeof createStore
//
// Напиши declare module "data-store" { ... } со всеми типами:

// declare module "data-store" {
//   ...
// }
