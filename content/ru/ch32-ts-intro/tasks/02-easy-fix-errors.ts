// Задание: исправь вызовы функций так, чтобы типы были правильными
// Менять сигнатуры функций НЕЛЬЗЯ — исправляй только вызовы

export function multiply(a: number, b: number): number {
  return a * b;
}

export function createGreeting(name: string, date: Date): string {
  return `Привет, ${name}! Сегодня ${date.toLocaleDateString("ru-RU")}`;
}

export function repeat(str: string, times: number): string {
  return str.repeat(times);
}

// Исправь вызовы ниже:

// 1. Передана строка вместо числа
export const result1 = multiply("5", 3);

// 2. Date() без new возвращает строку
export const result2 = createGreeting("Алиса", Date());

// 3. Аргументы перепутаны местами
export const result3 = repeat(3, "ха");
