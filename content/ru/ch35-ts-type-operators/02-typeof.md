---
title: "typeof: получение типа из значения"
parent: "ch35-ts-type-operators"
order: 2
---

## typeof в JavaScript vs TypeScript

В JavaScript `typeof` — рантайм-оператор, возвращающий строку `"string"`, `"number"`, `"boolean"` и так далее:

```js
// Рантайм — возвращает строку
console.log(typeof "hello"); // "string"
```

В TypeScript `typeof` можно использовать **в контексте типов** — и тогда он возвращает **TypeScript-тип** выражения:

```ts
const s = "hello";

// В контексте типов — возвращает TypeScript-тип
type S = typeof s; // "hello" (строковый литеральный тип)
```

Важно: `typeof` в контексте типов можно применять только к **именам переменных** и их свойствам. Нельзя писать `typeof` от произвольных выражений:

```ts
// Ошибка: нельзя использовать typeof от вызова функции
type Result = typeof getMessage();
//                  ~~~~~~~~~~~~ ← ошибка
```

## typeof с переменными и объектами

`typeof` особенно полезен, когда нужно получить тип существующего объекта, не описывая его вручную:

```ts
const config = {
  host: "localhost",
  port: 3000,
  debug: true,
};

// { host: string; port: number; debug: boolean }
type Config = typeof config;
```

Если бы объект `config` имел десятки полей, повторное описание интерфейса вручную было бы утомительным и ненадёжным. `typeof` извлекает тип автоматически.

## typeof и ReturnType

Утилитный тип `ReturnType<T>` принимает **тип функции** и возвращает тип её результата. Но нельзя передать в него имя функции напрямую — только тип:

```ts
function buildUser() {
  return { name: "Алиса", age: 30 };
}

// Ошибка: 'buildUser' refers to a value, but is being used as a type
type BadResult = ReturnType<buildUser>;
```

`buildUser` — это значение (функция), а не тип. Нужен `typeof`:

```ts
// OK — typeof превращает значение в тип
type UserResult = ReturnType<typeof buildUser>;
// { name: string; age: number }
```

Это один из самых частых паттернов: `ReturnType<typeof fn>`.

## typeof с вложенными свойствами

Можно обращаться к свойствам объекта:

```ts
const response = {
  data: {
    users: [{ id: 1, name: "Алиса" }],
    total: 100,
  },
  status: 200,
};

// { users: { id: number; name: string }[]; total: number }
type Data = typeof response.data;

// number
type Status = typeof response.status;
```

## Ограничения typeof

TypeScript намеренно ограничивает `typeof` в контексте типов:

1. **Только имена переменных и их свойства** — нельзя применять к произвольным выражениям:

```ts
const arr = [1, 2, 3];

// OK
type Arr = typeof arr;

// Ошибка — нельзя от вызова метода
type Len = typeof arr.length; // OK — свойство
type Mapped = typeof arr.map(x => x * 2); // Ошибка — вызов
```

2. **Нельзя от вызова функции** — используйте `ReturnType<typeof fn>` вместо `typeof fn()`.

3. **Выведенные типы могут быть шире ожидаемых** — `typeof` работает с выведенным типом, а не с рантайм-значением:

```ts
let count = 0;
type Count = typeof count; // number (не 0, потому что let)

const fixed = 0;
type Fixed = typeof fixed; // 0 (литеральный тип, потому что const)
```

## Предсказание результатов typeof

Чтобы предсказать, что вернёт `typeof`, нужно понимать, какой тип вывел TypeScript:

```ts
// const → литеральный тип
const greeting = "hello";
type G = typeof greeting; // "hello"

// let → расширенный тип
let message = "hello";
type M = typeof message; // string

// as const → глубокий readonly с литеральными типами
const colors = ["red", "green", "blue"] as const;
type C = typeof colors; // readonly ["red", "green", "blue"]
```

## Итоги

| Контекст | Результат typeof |
|----------|-----------------|
| `typeof "hello"` (рантайм) | `"string"` (строка) |
| `type S = typeof s` (тип) | TypeScript-тип переменной `s` |
| `ReturnType<typeof fn>` | Тип возвращаемого значения функции |
| `typeof obj.prop` | Тип конкретного свойства |
| `typeof fn()` | Ошибка — нельзя от вызова |
