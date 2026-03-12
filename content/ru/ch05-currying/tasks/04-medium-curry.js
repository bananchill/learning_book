// Реализуй функцию curry(fn), которая работает с любым количеством аргументов
//
// curry(fn)(a)(b)(c) === fn(a, b, c)
// curry(fn)(a, b)(c) === fn(a, b, c)
// curry(fn)(a)(b, c) === fn(a, b, c)
// curry(fn)(a, b, c) === fn(a, b, c)
//
// Подсказка: используй fn.length для определения количества ожидаемых аргументов
//
// Пример:
//   const sum = (a, b, c) => a + b + c
//   const curriedSum = curry(sum)
//   curriedSum(1)(2)(3)   // 6
//   curriedSum(1, 2)(3)   // 6
//   curriedSum(1)(2, 3)   // 6

export function curry(fn) {
  // твой код здесь
}
