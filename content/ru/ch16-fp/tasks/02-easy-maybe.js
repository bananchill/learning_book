// Задача: реализовать Maybe монаду для безопасной работы с null
// Maybe.of(value)      — создаёт обёртку
// .map(fn)             — применяет fn если value != null, иначе Maybe.of(null)
// .getOrElse(default)  — возвращает value или default

export class Maybe {
  constructor(value) {
    this._value = value
  }

  static of(value) {
    // твой код здесь
  }

  map(fn) {
    // твой код здесь
  }

  getOrElse(defaultValue) {
    // твой код здесь
  }
}
