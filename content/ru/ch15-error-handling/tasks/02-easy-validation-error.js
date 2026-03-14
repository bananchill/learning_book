// Задача: создать кастомный класс ошибки для валидации
// ValidationError extends Error:
//   constructor(message, field)
//   this.name === 'ValidationError'
//   this.field — название поля с ошибкой
//   instanceof Error === true
//   instanceof ValidationError === true

export class ValidationError extends Error {
  // твой код здесь
}
