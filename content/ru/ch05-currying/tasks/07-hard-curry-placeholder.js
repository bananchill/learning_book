// Реализуй curry с поддержкой плейсхолдера _
//
// Плейсхолдер позволяет пропустить аргумент и передать его позже:
//   curryWithPlaceholder(fn)(_, 2)(1)     === fn(1, 2)
//   curryWithPlaceholder(fn)(_, _, 3)(1)(2) === fn(1, 2, 3)
//   curryWithPlaceholder(fn)(1)(2)(3)     === fn(1, 2, 3)
//
// Пример:
//   const sub = (a, b) => a - b
//   const curried = curryWithPlaceholder(sub)
//   curried(10)(3)    // 7  — обычное каррирование
//   curried(_, 3)(10) // 7  — пропустили первый аргумент

export const _ = Symbol('placeholder')

export function curryWithPlaceholder(fn) {
  // твой код здесь
}
