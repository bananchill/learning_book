// Задание: обёртка функции с Parameters и ReturnType
//
// Напиши функцию withLogging, которая:
// 1. Принимает имя (string) и любую функцию fn
// 2. Возвращает новую функцию с теми же параметрами и типом возврата
// 3. Новая функция логирует вызов (записывает в массив logs) и вызывает оригинал
//
// Также напиши функцию getLogs, которая возвращает массив логов,
// и clearLogs, которая очищает его.

// Хранилище логов
const logs: string[] = []

export function getLogs(): string[] {
  return [...logs]
}

export function clearLogs(): void {
  logs.length = 0
}

// Напиши функцию withLogging
// Она должна:
// - Записать в logs строку: "Вызов <name> с аргументами: <arg1>, <arg2>, ..."
// - Вызвать оригинальную функцию с теми же аргументами
// - Записать в logs строку: "Результат <name>: <result>"
// - Вернуть результат
export function withLogging<T extends (...args: any[]) => any>(
  name: string,
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  // твой код здесь
  return fn
}
