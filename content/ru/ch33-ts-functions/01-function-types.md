---
title: "Типы функций и сигнатуры вызова"
parent: "ch33-ts-functions"
order: 1
---

## Выражения типов функций (Function Type Expressions)

Самый простой способ описать функцию -- использовать выражение типа функции. Синтаксис напоминает стрелочную функцию:

```ts
// Тип функции: принимает string, возвращает void
type GreetFunction = (a: string) => void;

function greeter(fn: GreetFunction) {
  fn("Привет, мир!");
}

function printToConsole(s: string) {
  console.log(s);
}

greeter(printToConsole);
```

Синтаксис `(a: string) => void` означает: "функция с одним параметром `a` типа `string`, которая ничего не возвращает". Имена параметров в типе **обязательны** -- без них TypeScript воспримет `string` как имя параметра с типом `any`.

```ts
// ❌ Неправильно: string — это имя параметра, тип — any
type Bad = (string) => void;

// ✅ Правильно: параметр s имеет тип string
type Good = (s: string) => void;
```

## Сигнатуры вызова (Call Signatures)

В JavaScript функции могут иметь свойства, помимо возможности быть вызванными. Выражения типов функций не позволяют описать свойства. Для этого используют сигнатуру вызова внутри объектного типа:

```ts
type DescribableFunction = {
  description: string;
  (someArg: number): boolean; // сигнатура вызова
};

function doSomething(fn: DescribableFunction) {
  console.log(fn.description + " вернула " + fn(6));
}

function isEven(n: number) {
  return n % 2 === 0;
}
isEven.description = "проверка чётности";

doSomething(isEven);
```

Обрати внимание на синтаксис: между параметрами и возвращаемым типом стоит `:`, а не `=>`. Это отличает сигнатуру вызова от выражения типа функции.

```ts
// Выражение типа функции — стрелка =>
type FnExpr = (a: number) => boolean;

// Сигнатура вызова — двоеточие :
type FnSig = {
  (a: number): boolean;
};
```

## Сигнатуры конструктора (Construct Signatures)

Функции в JavaScript можно вызывать с ключевым словом `new`. TypeScript описывает такие функции через сигнатуру конструктора -- добавляется ключевое слово `new` перед сигнатурой вызова:

```ts
type SomeConstructor = {
  new (s: string): SomeObject;
};

function fn(ctor: SomeConstructor) {
  return new ctor("привет");
}
```

Некоторые объекты, например `Date`, можно вызывать и с `new`, и без него. Для таких случаев можно комбинировать сигнатуры вызова и конструктора в одном типе:

```ts
interface CallOrConstruct {
  (n?: number): string;          // вызов без new
  new (s: string): Date;         // вызов с new
}
```

## Когда что использовать

| Механизм | Когда использовать |
|----------|-------------------|
| `(a: string) => void` | Простые коллбэки, обработчики, утилиты |
| `{ (a: string): void }` | Функция со свойствами |
| `{ new (a: string): T }` | Конструкторы (классы, фабрики) |
| Комбинация call + construct | Объекты вроде `Date` (вызов и конструктор) |

## Итого

- **Function Type Expression** -- самый распространённый способ типизировать коллбэки: `(a: string) => void`
- **Call Signature** -- когда функция имеет свойства: `{ description: string; (arg: number): boolean }`
- **Construct Signature** -- для вызовов с `new`: `{ new (s: string): SomeObject }`
- Имена параметров в типе обязательны
- Между call/construct signatures используется `:`, не `=>`
