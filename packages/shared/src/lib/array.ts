/** Добавляет элемент в массив, если его там ещё нет. Возвращает true, если добавлен. */
export function addIfAbsent<T>(array: T[], item: T): boolean {
  if (array.includes(item)) return false
  array.push(item)
  return true
}
