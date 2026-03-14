// Этот код работает без строгого режима, но СЛОМАЕТСЯ с 'use strict'
// Найди проблему и исправь её, добавив 'use strict' в начало файла
//
// Функция calculateTotal должна возвращать сумму всех чисел из массива

// TODO: добавь 'use strict' сюда

export function calculateTotal(numbers) {
  total = 0  // ← здесь проблема! переменная используется без объявления

  for (let i = 0; i < numbers.length; i++) {
    total += numbers[i]
  }

  return total
}
