// Задача: Итерируемый диапазон с шагом
// Сложность: easy
//
// Реализуйте класс StepRange, который итерирует числа от start до end с шагом step.
// Класс должен реализовать Iterable<number> для работы с for...of, spread и деструктуризацией.
//
// Требования:
// 1. Конструктор принимает start, end и необязательный step (по умолчанию 1)
// 2. Если step > 0, итерация идёт от start до end включительно (по возрастанию)
// 3. Если step < 0, итерация идёт от start до end включительно (по убыванию)
// 4. Если step === 0, выбрасывайте ошибку в конструкторе
// 5. Класс реализует Iterable<number>

// TODO: Реализуйте класс StepRange
// export class StepRange implements Iterable<number> {
//   constructor(
//     public readonly start: number,
//     public readonly end: number,
//     public readonly step: number = 1,
//   ) {
//     // Валидация step
//   }
//
//   [Symbol.iterator](): Iterator<number> {
//     // Реализация итератора
//   }
// }

export {};
