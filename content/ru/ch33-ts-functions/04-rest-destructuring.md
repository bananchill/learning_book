---
title: "Rest-параметры и деструктуризация"
parent: "ch33-ts-functions"
order: 4
---

## Rest-параметры (Rest Parameters)

Rest-параметры позволяют функции принимать неограниченное количество аргументов. В TypeScript тип rest-параметра -- всегда массив или кортеж:

```ts
// Rest-параметр типа number[]
function multiply(n: number, ...m: number[]): number[] {
  return m.map((x) => n * x);
}

const result = multiply(10, 1, 2, 3, 4); // [10, 20, 30, 40]
```

Rest-параметр должен быть **последним** в списке параметров. TypeScript выведет тип как массив:

```ts
function concat(...strings: string[]): string {
  return strings.join("");
}

concat("Привет", ", ", "мир", "!"); // "Привет, мир!"
```

## Rest-аргументы (Rest Arguments)

TypeScript позволяет передавать массив как набор аргументов через spread-оператор. Но есть нюанс -- TypeScript не гарантирует иммутабельность массива:

```ts
const args = [8, 5];
// ❌ Ошибка: spread-аргумент должен быть кортежем или передан в rest-параметр
// Math.atan2(...args);
```

Проблема: TypeScript выводит тип `args` как `number[]` (массив произвольной длины), а `Math.atan2` принимает ровно 2 аргумента. Решения:

```ts
// Решение 1: const assertion — массив становится readonly кортежем
const args1 = [8, 5] as const;
Math.atan2(...args1); // ✅ OK: тип readonly [8, 5]

// Решение 2: явный кортежный тип
const args2: [number, number] = [8, 5];
Math.atan2(...args2); // ✅ OK
```

`as const` превращает массив в `readonly` кортеж с литеральными типами. Это самый простой и надёжный способ.

## Деструктуризация параметров (Parameter Destructuring)

Деструктуризация параметров позволяет "распаковать" объект, переданный как аргумент, в отдельные переменные. Типы указываются **после** деструктуризации:

```ts
// Тип указывается после паттерна деструктуризации
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}

sum({ a: 10, b: 3, c: 9 }); // 22
```

Можно вынести тип в именованный alias для читаемости:

```ts
type ABC = { a: number; b: number; c: number };

function sum({ a, b, c }: ABC) {
  console.log(a + b + c);
}
```

### Деструктуризация с опциональными полями

```ts
interface Options {
  width: number;
  height: number;
  color?: string;
  title?: string;
}

function createWidget({ width, height, color = "blue", title = "Виджет" }: Options) {
  console.log(`${title}: ${width}x${height}, цвет: ${color}`);
}

createWidget({ width: 100, height: 200 }); // "Виджет: 100x200, цвет: blue"
createWidget({ width: 50, height: 50, color: "red", title: "Кнопка" });
```

### Деструктуризация массивов

Массивы тоже можно деструктурировать с типами:

```ts
function firstTwo([first, second]: [string, string]): string {
  return `${first} и ${second}`;
}

firstTwo(["Алиса", "Боб"]); // "Алиса и Боб"
```

### Вложенная деструктуризация

```ts
interface Config {
  server: {
    host: string;
    port: number;
  };
  debug: boolean;
}

function startApp({ server: { host, port }, debug }: Config) {
  console.log(`Запуск на ${host}:${port}, отладка: ${debug}`);
}

startApp({
  server: { host: "localhost", port: 3000 },
  debug: true,
});
```

## Комбинация rest и деструктуризации

Rest-параметры можно комбинировать с обычными параметрами и деструктуризацией:

```ts
function tag(
  strings: TemplateStringsArray,
  ...values: (string | number)[]
): string {
  return strings.reduce((result, str, i) => {
    return result + str + (values[i] ?? "");
  }, "");
}

const name = "мир";
const count = 42;
tag`Привет, ${name}! Ответ: ${count}.`;
```

## Распространённые ошибки

### Забыл тип у деструктуризации

```ts
// ❌ Неправильно: TypeScript видит { a: number } как переименование a -> number
function bad({ a: number }) {
  // number — это локальная переменная, а не тип!
}

// ✅ Правильно: тип идёт после деструктуризации
function good({ a }: { a: number }) {
  console.log(a);
}
```

### Spread массива без const assertion

```ts
function add(a: number, b: number) {
  return a + b;
}

const nums = [1, 2];
// add(...nums); // ❌ Ошибка

const numsFixed = [1, 2] as const;
add(...numsFixed); // ✅ OK
```

## Итого

| Механизм | Синтаксис | Ключевой момент |
|----------|-----------|----------------|
| Rest-параметры | `...args: T[]` | Всегда последний параметр, тип -- массив |
| Rest-аргументы | `fn(...arr)` | Используй `as const` для фиксации длины |
| Деструктуризация | `({ a, b }: Type)` | Тип после паттерна, не внутри |
| Опциональные | `{ x = default }: Type` | Значения по умолчанию работают как в JS |
| Вложенная | `{ a: { b } }: Type` | Тип описывает всю вложенную структуру |
