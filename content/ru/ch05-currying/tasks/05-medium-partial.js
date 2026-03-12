// Реализуй функцию partial(fn, ...fixedArgs),
// которая фиксирует первые аргументы функции
//
// partial(fn, a)(b, c) === fn(a, b, c)
// partial(fn, a, b)(c) === fn(a, b, c)
//
// Пример:
//   const add3 = (a, b, c) => a + b + c
//   partial(add3, 1)(2, 3)    // 6
//   partial(add3, 1, 2)(3)    // 6
//   partial(add3, 1, 2, 3)()  // 6

export function partial(fn, ...fixedArgs) {
  // твой код здесь
}
