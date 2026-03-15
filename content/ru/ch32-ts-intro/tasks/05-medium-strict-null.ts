// Задание: перепиши функции так, чтобы они корректно работали с strictNullChecks
// Замени any на правильные типы, обработай null/undefined

// 1. Функция ищет пользователя по id. Может вернуть null, если не нашла.
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Алиса", email: "alice@example.com" },
  { id: 2, name: "Боб", email: "bob@example.com" },
];

export function findUser(id: number): any {
  // твой код здесь — верни User или null
  return null;
}

// 2. Функция возвращает email пользователя по id.
// Если пользователь не найден, вернуть "Пользователь не найден"
export function getUserEmail(id: number): string {
  // используй findUser
  // твой код здесь
  return "";
}

// 3. Функция принимает необязательный greeting и возвращает приветствие.
// Если greeting не передан, использовать "Привет"
export function greetUser(name: string, greeting?: string): string {
  // твой код здесь
  return "";
}
