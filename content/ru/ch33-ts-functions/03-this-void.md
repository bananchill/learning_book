---
title: "this-параметр и void"
parent: "ch33-ts-functions"
order: 3
---

## Объявление this в функциях

TypeScript выводит тип `this` из контекста потока кода. Но иногда нужен более точный контроль. Спецификация TypeScript позволяет объявить тип `this` как специальный первый параметр функции:

```ts
const user = {
  id: 123,
  admin: false,
  becomeAdmin: function () {
    this.admin = true; // TypeScript выводит тип this
  },
};
```

Для коллбэков, которые будут вызваны в другом контексте, `this`-параметр критически важен:

```ts
interface DB {
  filterUsers(filter: (this: User) => boolean): User[];
}

const db = getDB();

// ✅ Правильно: обычная функция
const admins = db.filterUsers(function (this: User) {
  return this.admin;
});
```

Параметр `this` не существует в рантайме -- TypeScript удаляет его при компиляции. Он нужен только для проверки типов.

```ts
// ❌ Ошибка: стрелочная функция не имеет собственного this
const admins2 = db.filterUsers((this: User) => {
  return this.admin;
});
```

Стрелочные функции не могут иметь `this`-параметр, потому что они захватывают `this` из внешнего контекста. TypeScript выдаст ошибку при попытке объявить `this` в стрелочной функции.

## void

Тип `void` означает, что функция ничего не возвращает. Это не то же самое, что `undefined`:

```ts
// Тип возврата — void
function noop(): void {
  return; // OK: return без значения
}
```

Важная особенность: контекстуальная типизация с типом возврата `void` **не запрещает** функции что-то возвращать. Это позволяет писать такой код:

```ts
type VoidFunc = () => void;

const f1: VoidFunc = () => {
  return true; // OK! Возвращаемое значение игнорируется
};

const f2: VoidFunc = () => true; // OK!

// Но: тип результата — void, не boolean
const v1 = f1(); // тип: void
```

Это поведение по замыслу -- оно позволяет использовать `Array.prototype.forEach` с коллбэками, которые что-то возвращают:

```ts
const src = [1, 2, 3];
const dst: number[] = [];

// push возвращает number, но forEach ожидает () => void
// Это работает благодаря void-совместимости
src.forEach((el) => dst.push(el));
```

Однако если функция **явно** объявляет возврат `void`, она действительно не должна ничего возвращать:

```ts
function fail(): void {
  // ❌ Ошибка: нельзя возвращать значение из функции с типом void
  // return true;
}
```

## object

Тип `object` описывает любое значение, которое не является примитивом (`string`, `number`, `bigint`, `boolean`, `symbol`, `null`, `undefined`). Это не то же самое, что `Object` или `{}`:

```ts
function acceptObject(obj: object) {
  // OK: массивы, функции, объекты
}

acceptObject({ name: "Алиса" }); // OK
acceptObject([1, 2, 3]);         // OK
acceptObject(() => {});           // OK

// acceptObject("строка");        // ❌ Ошибка: string — примитив
// acceptObject(42);              // ❌ Ошибка: number — примитив
```

## unknown

Тип `unknown` -- безопасная альтернатива `any`. Переменной типа `unknown` можно присвоить что угодно, но использовать её нельзя без сужения типа:

```ts
function safeParse(s: string): unknown {
  return JSON.parse(s);
}

const result = safeParse('{"x": 1}');
// result.x;  // ❌ Ошибка: нельзя обращаться к свойствам unknown

if (typeof result === "object" && result !== null && "x" in result) {
  console.log(result.x); // ✅ OK после сужения
}
```

В контексте функций `unknown` безопаснее `any` для параметров-обработчиков:

```ts
function processValue(val: unknown) {
  if (typeof val === "string") {
    console.log(val.toUpperCase()); // TypeScript знает, что val — string
  }
  if (typeof val === "number") {
    console.log(val.toFixed(2)); // TypeScript знает, что val — number
  }
}
```

## never

Тип `never` означает, что значение **никогда** не появится. Функция с возвратом `never` либо бросает исключение, либо содержит бесконечный цикл:

```ts
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {
    // бесконечный цикл
  }
}
```

`never` также появляется при исчерпывающих проверках (exhaustive checks):

```ts
function handleShape(shape: "circle" | "square") {
  switch (shape) {
    case "circle":
      return Math.PI;
    case "square":
      return 4;
    default:
      // shape имеет тип never — все варианты обработаны
      const _exhaustive: never = shape;
      return _exhaustive;
  }
}
```

## Function

Глобальный тип `Function` описывает свойства `bind`, `call`, `apply` и другие, присутствующие у всех функций в JavaScript. Значения типа `Function` можно вызывать -- результат будет `any`:

```ts
function doSomething(f: Function) {
  const result = f(1, 2, 3); // тип result — any
}
```

Это нетипизированный вызов, и его лучше избегать. Если нужно принять произвольную функцию, используй `() => void`:

```ts
// ✅ Лучше: типизированная альтернатива
function doSomething(f: () => void) {
  f();
}
```

## Итого

| Тип | Значение |
|-----|---------|
| `void` | Функция ничего не возвращает (но void-коллбэки могут) |
| `object` | Любое не-примитивное значение |
| `unknown` | Безопасная альтернатива `any` (требует сужения) |
| `never` | Значение никогда не появится (throw, бесконечный цикл) |
| `Function` | Нетипизированная функция (лучше избегать) |
| `this: Type` | Объявление типа `this` для коллбэков (удаляется при компиляции) |
