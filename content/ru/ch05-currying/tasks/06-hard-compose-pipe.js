// Реализуй функции compose и pipe
//
// compose(f, g, h)(x) === f(g(h(x))) — справа налево
// pipe(f, g, h)(x) === h(g(f(x)))    — слева направо
//
// Пример:
//   const double = x => x * 2
//   const addOne = x => x + 1
//   const square = x => x * x
//
//   compose(addOne, double)(5)  // addOne(double(5)) = addOne(10) = 11
//   pipe(double, addOne)(5)     // addOne(double(5)) = addOne(10) = 11

export function compose(...fns) {
  // твой код здесь
}

export function pipe(...fns) {
  // твой код здесь
}
