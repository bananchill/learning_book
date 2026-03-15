---
title: "Шпаргалка: Объектные типы"
parent: "ch34-ts-object-types"
---

## Объявление объектных типов

```ts
// Интерфейс
interface User {
  name: string;
  age: number;
}

// Псевдоним типа
type User = {
  name: string;
  age: number;
};

// Анонимный тип в параметре
function greet(user: { name: string; age: number }) {}
```

## Optional-свойства

```ts
interface Config {
  host: string;
  port?: number;       // number | undefined
  debug?: boolean;     // boolean | undefined
}

const config: Config = { host: "localhost" }; // OK
const port = config.port ?? 3000;             // Значение по умолчанию
```

## readonly

```ts
interface Point {
  readonly x: number;
  readonly y: number;
}

const p: Point = { x: 10, y: 20 };
// p.x = 5; // Ошибка: read-only
```

## Индексные сигнатуры

```ts
// Строковые ключи
interface Dictionary {
  [key: string]: string;
}

// Числовые ключи
interface StringArray {
  [index: number]: string;
}

// Комбинация: явные свойства + индекс
interface Config {
  name: string;
  [key: string]: string;     // Все свойства должны возвращать string
}

// readonly индекс
interface ReadonlyDict {
  readonly [key: string]: number;
}
```

## Расширение (extends)

```ts
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// Множественное наследование
interface Pet extends Animal, Dog {
  owner: string;
}
```

## Пересечение (&)

```ts
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type UserWithTimestamps = User & Timestamped;
```

## extends vs &

```ts
// extends — конфликт = ошибка компиляции
interface A { id: number; }
// interface B extends A { id: string; } // Ошибка!

// & — конфликт = never
type A = { id: number };
type B = A & { id: string }; // id: never
```

## Generic-объекты

```ts
interface Box<T> {
  contents: T;
}

type Pair<A, B> = {
  first: A;
  second: B;
};

const box: Box<string> = { contents: "привет" };
const pair: Pair<string, number> = { first: "возраст", second: 25 };
```

## Array и ReadonlyArray

```ts
// Array<T> ≡ T[]
const nums: Array<number> = [1, 2, 3];
const nums2: number[] = [1, 2, 3];

// ReadonlyArray<T> ≡ readonly T[]
const ro: ReadonlyArray<string> = ["a", "b"];
const ro2: readonly string[] = ["a", "b"];
// ro.push("c"); // Ошибка
```

## Кортежи (Tuples)

```ts
// Базовый кортеж
type Pair = [string, number];
const p: Pair = ["возраст", 25];

// Необязательный элемент
type Coord = [number, number, number?]; // 2D или 3D

// Rest-элемент
type CSV = [string, ...number[]];
const row: CSV = ["data", 1, 2, 3];

// readonly кортеж
const point = [3, 4] as const; // readonly [3, 4]

// Деструктуризация
const [name, age]: [string, number] = ["Анна", 25];
```

## Excess Property Checks

```ts
interface Options {
  width: number;
}

// Ошибка: лишнее свойство в литерале
// const opts: Options = { width: 10, height: 20 };

// OK: через переменную
const raw = { width: 10, height: 20 };
const opts: Options = raw;
```
