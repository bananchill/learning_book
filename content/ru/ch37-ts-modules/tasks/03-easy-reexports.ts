// Задание: создай barrel-файл с реэкспортами
//
// Представь, что у тебя есть три подмодуля (определены ниже в этом файле).
// Твоя задача — реэкспортировать всё через единую точку входа.

// === Подмодуль 1: models ===
interface User {
  id: number;
  name: string;
  email: string;
}

interface Post {
  id: number;
  title: string;
  authorId: number;
}

// === Подмодуль 2: validators ===
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidTitle(title: string): boolean {
  return title.length >= 3 && title.length <= 200;
}

// === Подмодуль 3: formatters ===
function formatUserName(user: User): string {
  return `${user.name} <${user.email}>`;
}

function formatPostTitle(post: Post): string {
  return `#${post.id}: ${post.title}`;
}

// Задание: экспортируй всё наружу
// 1. Экспортируй типы User и Post (через export type для интерфейсов)
// 2. Экспортируй функции isValidEmail, isValidTitle
// 3. Экспортируй функции formatUserName, formatPostTitle
// 4. Экспортируй все функции-валидаторы также как namespace-объект Validators
//    (подсказка: можно создать объект и экспортировать его)

// Напиши экспорты здесь:
