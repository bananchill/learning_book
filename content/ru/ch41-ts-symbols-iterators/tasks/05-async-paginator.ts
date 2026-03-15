// Задача: Асинхронный пагинатор
// Сложность: hard
//
// Создайте асинхронный генератор-пагинатор, который загружает данные постранично
// и отдаёт элементы по одному через AsyncIterable. Потребитель не знает о пагинации —
// он просто итерирует элементы через for await...of.
//
// Требования:
// 1. Определите интерфейс Page<T> с полями: items: T[], nextCursor: string | null
// 2. Определите тип FetchPage<T> — функция (cursor: string | null) => Promise<Page<T>>
// 3. Реализуйте async function* paginate<T>(fetchPage: FetchPage<T>): AsyncGenerator<T>
//    - Вызывает fetchPage с текущим курсором
//    - Отдаёт элементы страницы по одному через yield
//    - Если nextCursor !== null — загружает следующую страницу
//    - Если nextCursor === null — завершает итерацию
// 4. Реализуйте класс AsyncPaginator<T> implements AsyncIterable<T>
//    - Конструктор принимает FetchPage<T>
//    - Метод [Symbol.asyncIterator]() возвращает paginate()
//    - Метод async toArray(): Promise<T[]> — собирает все элементы
//    - Метод async take(n: number): Promise<T[]> — собирает первые n элементов

// TODO: Определите интерфейсы и типы
// export interface Page<T> { ... }
// export type FetchPage<T> = ...

// TODO: Реализуйте async генератор paginate
// export async function* paginate<T>(fetchPage: FetchPage<T>): AsyncGenerator<T> { ... }

// TODO: Реализуйте класс AsyncPaginator
// export class AsyncPaginator<T> implements AsyncIterable<T> { ... }

export {};
