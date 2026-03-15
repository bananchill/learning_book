// Задание: создай типизированный словарь и функции для работы с ним

// 1. Создай интерфейс Dictionary, где ключи — строки, значения — числа.
//    Используй индексную сигнатуру.

// export interface Dictionary { ... }

// 2. Напиши функцию createDictionary, которая принимает массив пар [string, number]
//    и возвращает Dictionary.
//
//    Пример: createDictionary([["a", 1], ["b", 2]]) → { a: 1, b: 2 }

// export function createDictionary(pairs: [string, number][]): Dictionary { ... }

// 3. Напиши функцию getValueOrDefault, которая принимает Dictionary, ключ и значение по умолчанию.
//    Возвращает значение по ключу или значение по умолчанию, если ключа нет.

// export function getValueOrDefault(dict: Dictionary, key: string, defaultValue: number): number { ... }

// 4. Напиши функцию sumValues, которая принимает Dictionary
//    и возвращает сумму всех значений.

// export function sumValues(dict: Dictionary): number { ... }
