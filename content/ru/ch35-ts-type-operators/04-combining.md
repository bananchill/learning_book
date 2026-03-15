---
title: "Комбинирование операторов"
parent: "ch35-ts-type-operators"
order: 4
---

## Зачем комбинировать

Каждый оператор типов по отдельности решает свою задачу. Но настоящая сила раскрывается при их комбинировании. Рассмотрим практические паттерны, которые встречаются в реальном коде.

## Паттерн: typeof + keyof

Получение ключей объекта-значения без создания отдельного интерфейса:

```ts
const theme = {
  primary: "#3490dc",
  secondary: "#ffed4a",
  danger: "#e3342f",
  success: "#38c172",
};

// "primary" | "secondary" | "danger" | "success"
type ThemeColor = keyof typeof theme;

function applyColor(color: ThemeColor) {
  document.body.style.color = theme[color];
}

applyColor("primary"); // OK
applyColor("warning"); // Ошибка — нет такого ключа
```

`keyof typeof theme` — один из самых частых паттернов. `typeof theme` даёт тип объекта, `keyof` извлекает его ключи.

## Паттерн: typeof + ReturnType

Получение типа возвращаемого значения функции-значения:

```ts
function createStore() {
  return {
    items: [] as string[],
    count: 0,
    add(item: string) {
      this.items.push(item);
      this.count++;
    },
  };
}

// { items: string[]; count: number; add(item: string): void }
type Store = ReturnType<typeof createStore>;
```

Тип `Store` всегда синхронизирован с реализацией `createStore`. Если добавить новое поле — тип обновится автоматически.

## Паттерн: typeof + T[K] + number

Извлечение типа элемента из массива-значения:

```ts
const endpoints = [
  { method: "GET" as const, path: "/users" },
  { method: "POST" as const, path: "/users" },
  { method: "DELETE" as const, path: "/users/:id" },
];

// { method: "GET" | "POST" | "DELETE"; path: string }
type Endpoint = (typeof endpoints)[number];

// "GET" | "POST" | "DELETE"
type Method = (typeof endpoints)[number]["method"];
```

Цепочка: `typeof` получает тип массива, `[number]` — тип элемента, `["method"]` — тип конкретного свойства элемента.

## Паттерн: as const + typeof + keyof

Создание типобезопасных констант:

```ts
const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

// "OK" | "NOT_FOUND" | "INTERNAL_ERROR"
type StatusName = keyof typeof HTTP_STATUS;

// 200 | 404 | 500
type StatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
```

Без `as const` тип `StatusCode` был бы просто `number`. С `as const` TypeScript сохраняет литеральные значения `200 | 404 | 500`.

## Паттерн: дженерик с keyof + T[K]

Типобезопасная функция обновления свойств:

```ts
function updateField<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K]
): T {
  return { ...obj, [key]: value };
}

const user = { name: "Алиса", age: 30, admin: false };

// OK — age ожидает number
updateField(user, "age", 31);

// Ошибка — age ожидает number, а не string
updateField(user, "age", "тридцать один");

// Ошибка — "email" не ключ user
updateField(user, "email", "alice@example.com");
```

TypeScript проверяет и ключ, и тип значения. Нельзя записать строку в числовое поле.

## Паттерн: маппинг событий

Реальный пример — типизация обработчиков событий:

```ts
const eventHandlers = {
  click: (x: number, y: number) => console.log(x, y),
  keypress: (key: string) => console.log(key),
  resize: (width: number, height: number) => console.log(width, height),
};

type EventName = keyof typeof eventHandlers;

// Тип параметров конкретного обработчика
type HandlerParams<E extends EventName> =
  Parameters<(typeof eventHandlers)[E]>;

// [x: number, y: number]
type ClickParams = HandlerParams<"click">;

// [key: string]
type KeypressParams = HandlerParams<"keypress">;
```

Цепочка: `typeof eventHandlers` даёт тип объекта, `[E]` — тип конкретного обработчика, `Parameters<...>` — кортеж его параметров.

## Паттерн: конфигурация валидаторов

```ts
const validators = {
  email: (value: string) => value.includes("@"),
  age: (value: number) => value >= 0 && value <= 150,
  active: (value: boolean) => value === true,
} as const;

type FieldName = keyof typeof validators;

// Тип значения, которое принимает валидатор для данного поля
type FieldValue<F extends FieldName> =
  Parameters<(typeof validators)[F]>[0];

// string
type EmailInput = FieldValue<"email">;

// number
type AgeInput = FieldValue<"age">;

function validate<F extends FieldName>(
  field: F,
  value: FieldValue<F>
): boolean {
  // Приведение нужно, так как TS не может сузить тип внутри
  return (validators[field] as (v: FieldValue<F>) => boolean)(value);
}

validate("email", "test@mail.ru"); // OK
validate("age", 25);               // OK
validate("age", "двадцать пять");   // Ошибка — age ожидает number
```

## Итоги

| Паттерн | Что делает |
|---------|-----------|
| `keyof typeof obj` | Union ключей объекта-значения |
| `ReturnType<typeof fn>` | Тип возвращаемого значения функции |
| `(typeof arr)[number]` | Тип элемента массива |
| `(typeof obj)[keyof typeof obj]` | Union типов всех значений объекта |
| `T[K]` в дженерике | Тип свойства — зависит от ключа |
| `Parameters<(typeof handlers)[E]>` | Параметры конкретного обработчика |
