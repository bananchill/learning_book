/**
 * Задача: Ленивый загрузчик модулей
 *
 * Реализуй функцию createLazyLoader(importFn), которая:
 * - Принимает importFn: () => Promise<T> — функцию динамического импорта
 * - Возвращает объект с методом load(): Promise<T>
 * - load() загружает модуль только при первом вызове (lazy)
 * - Все последующие вызовы load() возвращают закэшированный результат
 * - Параллельные вызовы load() не должны вызывать importFn несколько раз
 *
 * Сигнатура:
 *   createLazyLoader<T>(importFn: () => Promise<T>): { load(): Promise<T> }
 *
 * Примеры:
 *   const heavyLib = createLazyLoader(() => import('./heavy-lib.js'))
 *
 *   // Первый вызов — загружает модуль
 *   const lib1 = await heavyLib.load()
 *
 *   // Второй вызов — возвращает кэш, importFn не вызывается снова
 *   const lib2 = await heavyLib.load()
 *   lib1 === lib2 // true
 *
 *   // Параллельные вызовы — importFn вызывается только ОДИН раз
 *   const [a, b, c] = await Promise.all([
 *     heavyLib.load(),
 *     heavyLib.load(),
 *     heavyLib.load()
 *   ])
 *   // importFn был вызван 1 раз, не 3
 */

export function createLazyLoader(importFn) {
  // твой код здесь
}
