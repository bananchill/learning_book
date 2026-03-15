// Задание: добавь типы коллбэков с помощью Function Type Expressions
// Замени any на правильные типы функций

// 1. Функция принимает коллбэк, который получает строку и ничего не возвращает
export function greetUser(name: string, callback: any) {
  callback(`Привет, ${name}!`);
}

// 2. Функция принимает коллбэк-фильтр, который получает число и возвращает boolean
export function filterNumbers(numbers: number[], predicate: any): number[] {
  return numbers.filter(predicate);
}

// 3. Функция принимает коллбэк-преобразователь, который получает строку и индекс, возвращает строку
export function mapStrings(strings: string[], transform: any): string[] {
  return strings.map(transform);
}

// 4. Функция принимает коллбэк для сравнения двух чисел, возвращает число (для sort)
export function sortNumbers(numbers: number[], comparator: any): number[] {
  return [...numbers].sort(comparator);
}
