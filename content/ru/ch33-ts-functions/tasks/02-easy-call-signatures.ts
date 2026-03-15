// Задание: создай тип Validator с Call Signature
// Validator — это функция, которую можно вызвать с аргументом string,
// и она возвращает boolean. У неё также есть свойство errorMessage: string.

// 1. Опиши тип Validator с помощью Call Signature
// Замени any на правильный тип
export type Validator = any;

// 2. Создай функцию createValidator, которая принимает паттерн (RegExp)
//    и сообщение об ошибке, возвращает объект типа Validator
export function createValidator(pattern: RegExp, errorMessage: string): Validator {
  // Создай функцию-валидатор и добавь ей свойство errorMessage
  // твой код здесь
}

// 3. Опиши тип MathOperation с Call Signature
// MathOperation — функция, принимающая два числа и возвращающая число.
// У неё есть свойство symbol: string (например, "+" или "-").
// Замени any на правильный тип
export type MathOperation = any;

// 4. Создай функцию createOperation
export function createOperation(
  symbol: string,
  operation: (a: number, b: number) => number
): MathOperation {
  // твой код здесь
}
