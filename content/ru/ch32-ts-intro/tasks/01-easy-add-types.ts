// Задание: добавь аннотации типов к параметрам и возвращаемому значению каждой функции

// 1. Функция складывает два числа
export function add(a, b) {
  return a + b;
}

// 2. Функция приветствует пользователя по имени
export function greet(name) {
  return `Привет, ${name}!`;
}

// 3. Функция проверяет, является ли число чётным
export function isEven(n) {
  return n % 2 === 0;
}

// 4. Функция возвращает длину строки
export function getLength(str) {
  return str.length;
}

// 5. Функция форматирует дату
export function formatDate(date) {
  return date.toLocaleDateString("ru-RU");
}
