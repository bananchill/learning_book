// Задание: раздели импорты на типовые и обычные
//
// В этом файле нужно:
// 1. Определить интерфейс Config (только тип, не значение)
// 2. Определить функцию-валидатор validateConfig (значение)
// 3. Определить type alias LogLevel (только тип)
// 4. Определить функцию createLogger (значение), которая использует LogLevel

// Задача: реализуй экспорты так, чтобы при использовании
// потребитель мог отделить типовые импорты от импортов значений:
//
// import type { Config, LogLevel } from './02-easy-import-type';
// import { validateConfig, createLogger } from './02-easy-import-type';

// 1. Экспортируй интерфейс Config с полями:
//    - host: string
//    - port: number
//    - debug: boolean

// 2. Экспортируй type alias LogLevel = "debug" | "info" | "warn" | "error"

// 3. Экспортируй функцию validateConfig(config: unknown): config is Config
//    Проверяет, что объект имеет поля host (string), port (number), debug (boolean)
export function validateConfig(config: unknown): boolean {
  // Реализуй здесь — верни true если config соответствует Config
}

// 4. Экспортируй функцию createLogger(level: LogLevel): (msg: string) => string
//    Возвращает функцию, которая форматирует сообщение: "[LEVEL] сообщение"
export function createLogger(level: any): (msg: string) => string {
  // Реализуй здесь
}
