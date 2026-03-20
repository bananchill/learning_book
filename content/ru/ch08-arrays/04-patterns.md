import { Callout, DeepDive } from '@book/ui'

# Паттерны работы с массивами

## Chaining — цепочки методов

Методы, возвращающие массив (`filter`, `map`, `toSorted`), можно объединять в цепочки — каждый следующий метод получает результат предыдущего. Цепочка читается сверху вниз как описание трансформации: «отфильтруй → отсортируй → извлеки поля»:

```javascript
const users = [
  { name: 'Иван', age: 25, role: 'admin', active: true },
  { name: 'Мария', age: 30, role: 'user', active: false },
  { name: 'Пётр', age: 22, role: 'user', active: true },
  { name: 'Анна', age: 35, role: 'admin', active: true },
];

// Найти имена активных юзеров старше 24, отсортировать по имени
const result = users
  .filter(u => u.active)          // убрать неактивных
  .filter(u => u.age > 24)        // убрать молодых
  .sort((a, b) => a.name.localeCompare(b.name, 'ru')) // сортировка
  .map(u => u.name);              // извлечь имена

// result = ['Анна', 'Иван']
```

<Callout type="tip">
Каждый метод в цепочке получает результат предыдущего. Цепочка читается сверху вниз — это декларативное описание трансформации.
</Callout>

## Иммутабельность

В современном JavaScript (особенно с React, Vue, Redux) предпочтительно работать с данными **иммутабельно** — не изменять оригинал, а создавать новую копию с нужными изменениями. Это предотвращает неожиданные побочные эффекты: если на массив ссылаются несколько компонентов, мутация одного повлияет на все остальные. Иммутабельный подход также упрощает отслеживание изменений (сравнение ссылок вместо глубокого сравнения):

```javascript
const todos = [
  { id: 1, text: 'Задача 1', done: false },
  { id: 2, text: 'Задача 2', done: false },
];

// Добавить задачу (иммутабельно)
const withNew = [...todos, { id: 3, text: 'Задача 3', done: false }];

// Отметить задачу выполненной (иммутабельно)
const updated = todos.map(todo =>
  todo.id === 1 ? { ...todo, done: true } : todo
);

// Удалить задачу (иммутабельно)
const withoutFirst = todos.filter(todo => todo.id !== 1);
```

## Object.groupBy — группировка (ES2024)

```javascript
const fruits = [
  { name: 'яблоко', type: 'круглый' },
  { name: 'апельсин', type: 'круглый' },
  { name: 'банан', type: 'длинный' },
];

const grouped = Object.groupBy(fruits, fruit => fruit.type);
// {
//   'круглый': [{name: 'яблоко', ...}, {name: 'апельсин', ...}],
//   'длинный': [{name: 'банан', ...}]
// }
```

### Группировка через reduce (если groupBy недоступен)

```javascript
const groupBy = (arr, key) =>
  arr.reduce((groups, item) => {
    const group = item[key];
    groups[group] = groups[group] ?? [];
    groups[group].push(item);
    return groups;
  }, {});
```

## Уникальные значения

```javascript
// Через Set
const unique = [...new Set([1, 2, 2, 3, 3, 4])]
// [1, 2, 3, 4]

// Уникальные объекты по полю
const uniqueUsers = users.filter(
  (user, idx, arr) => arr.findIndex(u => u.id === user.id) === idx
);
```

<DeepDive title="Производительность цепочек: reduce vs multiple map/filter">

Каждый метод в цепочке проходит весь массив. `filter().map()` — два прохода. `reduce()` — один:

```javascript
// Два прохода (но читаемо)
const result = arr.filter(x => x > 0).map(x => x * 2);

// Один проход (менее читаемо, быстрее)
const result = arr.reduce((acc, x) => {
  if (x > 0) acc.push(x * 2);
  return acc;
}, []);
```

Для маленьких массивов (< 100 000 элементов) — используйте цепочки. Для больших — measure first, optimize second.

</DeepDive>
