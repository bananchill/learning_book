// Задание: DeepPartial и типобезопасный deepMerge
//
// 1. Реализуй тип DeepPartial<T>, который рекурсивно делает все свойства
//    (включая вложенные объекты) необязательными.
//
// 2. Напиши функцию deepMerge(target, source), которая:
//    - Принимает объект target типа T
//    - Принимает source типа DeepPartial<T>
//    - Рекурсивно объединяет source в target
//    - Возвращает новый объект типа T (не мутирует оригинал)
//    - Для вложенных объектов вызывает себя рекурсивно
//    - Для примитивов и массивов — просто заменяет значение

// Реализуй рекурсивный тип DeepPartial
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? T[P] extends any[]
      ? T[P]  // массивы не разворачиваем — заменяем целиком
      : DeepPartial<T[P]>
    : T[P]
}

export interface AppConfig {
  server: {
    host: string
    port: number
    ssl: {
      enabled: boolean
      cert: string
    }
  }
  database: {
    host: string
    port: number
    name: string
  }
  features: string[]
}

export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: DeepPartial<T>
): T {
  // твой код здесь
  return target
}
