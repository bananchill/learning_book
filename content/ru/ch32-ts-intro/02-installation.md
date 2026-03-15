---
title: "Установка и первая программа"
parent: "ch32-ts-intro"
order: 2
---

## Установка TypeScript

TypeScript устанавливается через npm как обычный пакет:

```sh
npm install -g typescript
```

Эта команда устанавливает компилятор `tsc` глобально. Проверим версию:

```sh
tsc --version
```

> Для проекта лучше ставить TypeScript локально: `npm install -D typescript`. Тогда запускайте через `npx tsc` или скрипт в `package.json`.

## Первая программа

Создайте файл `hello.ts`:

```ts
// Приветствует мир
console.log("Hello world!");
```

Обратите внимание: этот код выглядит как обычный JavaScript. Любой валидный JS — это валидный TS.

Скомпилируем:

```sh
tsc hello.ts
```

Результат: рядом появится файл `hello.js` с тем же содержимым. TypeScript не нашёл ошибок, поэтому просто скопировал код.

## Добавляем типы

Усложним программу — добавим функцию с аннотациями типов:

```ts
function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());
```

Синтаксис `: string` и `: Date` после параметров — это **аннотации типов**. Они говорят TypeScript, что `person` — строка, а `date` — объект `Date`.

Если вызвать `greet` неправильно:

```ts
// Ошибка: Argument of type 'string' is not assignable to parameter of type 'Date'
greet("Maddison", Date());
```

`Date()` без `new` возвращает строку, а не объект `Date`. TypeScript это ловит.

## Вывод типов (Type Inference)

Аннотации не нужны везде. TypeScript часто **выводит типы автоматически**:

```ts
let msg = "hello there!";
// TypeScript определил: msg имеет тип string
```

Если система типов может определить тип сама — не добавляйте аннотацию. Это лишний шум.

## Определение типов: interface и type

Для описания объектов используются `interface` и `type`:

```ts
interface User {
  name: string;
  id: number;
}

const user: User = {
  name: "Hayes",
  id: 0,
};
```

Если объект не соответствует интерфейсу — ошибка:

```ts
// Ошибка: Type '{ username: string; id: number; }' is not assignable to type 'User'
const user: User = {
  username: "Hayes", // 'username' не существует в User
  id: 0,
};
```

Интерфейсы работают с функциями и классами:

```ts
function deleteUser(user: User) {
  // ...
}

function getAdminUser(): User {
  // ...
}
```

## Объединения (Unions)

Тип может быть одним из нескольких вариантов:

```ts
type WindowStates = "open" | "closed" | "minimized";

function getLength(obj: string | string[]) {
  return obj.length;
}
```

Для сужения типа используйте `typeof`:

```ts
function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj]; // здесь obj — string
  }
  return obj; // здесь obj — string[]
}
```

## Дженерики

Дженерики позволяют параметризовать тип:

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;

interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}
```

Подробнее о дженериках — в [главе про дженерики](/ch25-ts-generics).

## Запуск TypeScript-кода

TypeScript **не выполняется** напрямую. Цепочка:

```
.ts файл → tsc (компилятор) → .js файл → node / браузер
```

Для разработки удобнее использовать:

- **`ts-node`** — запускает `.ts` без явной компиляции
- **`tsx`** — быстрый транспилятор на базе esbuild
- **Vite** / **webpack** / **esbuild** — бандлеры с встроенной поддержкой TS

## Итоги

| Шаг | Команда |
|-----|---------|
| Установка глобально | `npm install -g typescript` |
| Установка в проект | `npm install -D typescript` |
| Компиляция файла | `tsc hello.ts` |
| Проверка версии | `tsc --version` |
| Запуск без компиляции | `npx tsx hello.ts` |
