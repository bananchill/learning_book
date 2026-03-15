// Задача: Ленивый конвейер на генераторах
// Сложность: medium
//
// Создайте класс Lazy<T>, который оборачивает Iterable<T> и предоставляет
// ленивые операции map, filter, take. Все операции реализованы через генераторы
// и не создают промежуточных массивов. Вычисление происходит только при итерации.
//
// Требования:
// 1. Класс Lazy<T> реализует Iterable<T>
// 2. Статический метод from<T>(iterable: Iterable<T>): Lazy<T>
// 3. map<U>(fn: (item: T) => U): Lazy<U> — ленивое преобразование
// 4. filter(predicate: (item: T) => boolean): Lazy<T> — ленивая фильтрация
// 5. take(count: number): Lazy<T> — ленивое ограничение количества
// 6. toArray(): T[] — материализация в массив
// 7. Методы должны быть чейнящимися: Lazy.from([...]).map(...).filter(...).take(5).toArray()

// TODO: Реализуйте класс Lazy<T>
// export class Lazy<T> implements Iterable<T> {
//   private constructor(private source: Iterable<T>) {}
//
//   static from<T>(iterable: Iterable<T>): Lazy<T> { ... }
//
//   map<U>(fn: (item: T) => U): Lazy<U> { ... }
//
//   filter(predicate: (item: T) => boolean): Lazy<T> { ... }
//
//   take(count: number): Lazy<T> { ... }
//
//   toArray(): T[] { ... }
//
//   [Symbol.iterator](): Iterator<T> { ... }
// }

export {};
