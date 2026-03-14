/**
 * Задача: Async-пагинация
 *
 * Реализуй async-генератор paginate(fetchFn, pageSize), который:
 * - Вызывает fetchFn(page, pageSize), где page начинается с 1
 * - Выдаёт (yield) каждую страницу данных (массив элементов)
 * - Останавливается, когда fetchFn вернула пустой массив []
 *   или массив с меньшим количеством элементов, чем pageSize
 *
 * Сигнатура fetchFn: (page: number, pageSize: number) => Promise<T[]>
 *
 * Пример использования:
 *   async function mockFetch(page, size) {
 *     if (page > 3) return []
 *     return Array.from({ length: size }, (_, i) => (page - 1) * size + i + 1)
 *   }
 *
 *   for await (const items of paginate(mockFetch, 5)) {
 *     console.log(items) // [1,2,3,4,5], затем [6,7,8,9,10], затем [11,12,13,14,15]
 *   }
 */

export async function* paginate(fetchFn, pageSize) {
  // твой код здесь
}
