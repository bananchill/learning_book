/**
 * Задача: Бесконечный счётчик
 *
 * Реализуй класс InfiniteCounter, который:
 * - Принимает в конструктор start (начало, по умолчанию 0) и step (шаг, по умолчанию 1)
 * - Реализует Symbol.iterator, делая экземпляр итерируемым
 * - Итерация бесконечна — никогда не возвращает done: true
 * - Каждый новый for...of начинает с начала (start)
 *
 * Примеры:
 *   const counter = new InfiniteCounter(10, 5)
 *   const iter = counter[Symbol.iterator]()
 *   iter.next().value  // 10
 *   iter.next().value  // 15
 *   iter.next().value  // 20
 *
 *   // Взять первые 3 элемента
 *   const first3 = []
 *   for (const n of new InfiniteCounter(1, 2)) {
 *     first3.push(n)
 *     if (first3.length === 3) break
 *   }
 *   // first3 → [1, 3, 5]
 */

export class InfiniteCounter {
  constructor(start = 0, step = 1) {
    // твой код здесь
  }

  [Symbol.iterator]() {
    // твой код здесь
  }
}
