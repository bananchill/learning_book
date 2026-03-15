---
title: "keyof: получение ключей типа"
parent: "ch35-ts-type-operators"
order: 1
---

## Что делает keyof

Оператор `keyof` принимает объектный тип и возвращает **union строковых или числовых литеральных типов** его ключей:

```ts
type Point = { x: number; y: number };

// "x" | "y"
type P = keyof Point;
```

Тип `P` эквивалентен `"x" | "y"`. Теперь можно использовать `P` везде, где нужен один из ключей `Point`.

## keyof и индексные сигнатуры

Если тип имеет индексную сигнатуру (`string` или `number`), `keyof` вернёт тип индекса:

```ts
type Arrayish = { [n: number]: unknown };

// number
type A = keyof Arrayish;
```

```ts
type Mapish = { [k: string]: boolean };

// string | number
type M = keyof Mapish;
```

Почему `M` равен `string | number`, а не просто `string`? Потому что в JavaScript ключи объекта всегда приводятся к строке: `obj[0]` — то же самое, что `obj["0"]`. Поэтому числовой ключ тоже валиден для объекта со строковой индексной сигнатурой.

## keyof с интерфейсами

`keyof` работает одинаково с `type` и `interface`:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// "id" | "name" | "email"
type UserKey = keyof User;
```

## keyof в дженериках

Одно из главных применений `keyof` — ограничение параметров дженериков. Классический пример из Handbook — типобезопасная функция доступа к свойству:

```ts
function getProperty<Type, Key extends keyof Type>(obj: Type, key: Key) {
  return obj[key];
}

const person = { name: "Алиса", age: 30, admin: true };

// OK — "name" входит в keyof typeof person
const name = getProperty(person, "name"); // string

// Ошибка: Argument of type '"email"' is not assignable
// to parameter of type '"name" | "age" | "admin"'
const email = getProperty(person, "email");
```

`Key extends keyof Type` гарантирует, что второй аргумент — это реальный ключ первого аргумента. TypeScript не допустит опечатку или несуществующее свойство.

## keyof с union и intersection

Полезно понимать, как `keyof` взаимодействует с объединениями и пересечениями типов:

```ts
type A = { x: number; y: number };
type B = { y: number; z: number };

// keyof (A & B) = keyof A | keyof B = "x" | "y" | "z"
type KeysOfIntersection = keyof (A & B);

// keyof (A | B) = keyof A & keyof B = "y"
type KeysOfUnion = keyof (A | B);
```

Для пересечения (`&`) — ключи объединяются. Для объединения (`|`) — остаются только общие ключи (те, которые гарантированно есть в любом варианте).

## Итоги

| Выражение | Результат |
|-----------|-----------|
| `keyof { a: string; b: number }` | `"a" \| "b"` |
| `keyof { [n: number]: unknown }` | `number` |
| `keyof { [k: string]: boolean }` | `string \| number` |
| `keyof (A & B)` | `keyof A \| keyof B` |
| `keyof (A \| B)` | `keyof A & keyof B` |
