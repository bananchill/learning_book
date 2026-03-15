---
title: "Индексные типы доступа T[K]"
parent: "ch35-ts-type-operators"
order: 3
---

## Доступ к типу свойства

**Индексный тип доступа** (indexed access type) позволяет обратиться к типу конкретного свойства другого типа. Синтаксис похож на обращение к свойству объекта, но работает на уровне типов:

```ts
type Person = { age: number; name: string; alive: boolean };

// number
type Age = Person["age"];
```

`Person["age"]` возвращает тип свойства `age` — то есть `number`. Индексом является **тип**, а не значение.

## Индексация с union-типом

В качестве индекса можно использовать union — тогда результат тоже будет union:

```ts
type Person = { age: number; name: string; alive: boolean };

// string | number
type I1 = Person["age" | "name"];

// string | number | boolean
type I2 = Person[keyof Person];
```

`Person[keyof Person]` — это union типов **всех** свойств `Person`.

## Индексация с typeof

Ещё один полезный паттерн — `typeof` в сочетании с индексным доступом:

```ts
const MyArray = [
  { name: "Алиса", age: 30 },
  { name: "Боб", age: 25 },
];

// { name: string; age: number }
type Item = (typeof MyArray)[number];
```

Здесь `typeof MyArray` даёт тип массива, а `[number]` обращается к типу элемента по числовому индексу.

## Индексация с number для массивов

Для массивов и кортежей `[number]` возвращает тип элемента:

```ts
const roles = ["admin", "editor", "viewer"] as const;

// "admin" | "editor" | "viewer"
type Role = (typeof roles)[number];
```

Без `as const` тип `roles` был бы `string[]`, и `(typeof roles)[number]` вернул бы просто `string`. С `as const` TypeScript сохраняет литеральные типы, и результат — union конкретных строк.

## Использование с интерфейсами

Индексный доступ работает и с интерфейсами:

```ts
interface ApiResponse {
  data: {
    users: { id: number; name: string }[];
    meta: { total: number; page: number };
  };
  status: number;
}

// { users: { id: number; name: string }[]; meta: { total: number; page: number } }
type Data = ApiResponse["data"];

// { id: number; name: string }
type User = ApiResponse["data"]["users"][number];

// { total: number; page: number }
type Meta = ApiResponse["data"]["meta"];
```

Цепочка индексов позволяет «провалиться» на любой уровень вложенности.

## Ограничение: только существующие ключи

TypeScript не позволит обратиться к несуществующему свойству:

```ts
type Person = { age: number; name: string; alive: boolean };

// Ошибка: Property 'alpipiee' does not exist on type 'Person'
type Invalid = Person["alpipiee"];
```

## Использование в дженериках

Индексный доступ особенно мощен в дженериках:

```ts
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Алиса", admin: true };

// Тип: string
const name = getProperty(user, "name");

// Тип: boolean
const isAdmin = getProperty(user, "admin");
```

Возвращаемый тип `T[K]` меняется в зависимости от переданного ключа. TypeScript знает, что `getProperty(user, "name")` возвращает `string`, а `getProperty(user, "admin")` — `boolean`.

## Индексный доступ и условные типы

Индексный доступ можно комбинировать с условными типами для создания гибких утилит:

```ts
type HasProperty<T, K extends string> =
  K extends keyof T ? T[K] : never;

// string
type UserName = HasProperty<{ name: string; age: number }, "name">;

// never
type UserEmail = HasProperty<{ name: string; age: number }, "email">;
```

## Итоги

| Выражение | Результат |
|-----------|-----------|
| `Person["age"]` | Тип свойства `age` |
| `Person["age" \| "name"]` | Union типов указанных свойств |
| `Person[keyof Person]` | Union типов всех свойств |
| `(typeof arr)[number]` | Тип элемента массива |
| `T[K]` в дженерике | Тип свойства `K` объекта `T` |
