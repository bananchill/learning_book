# Как TypeScript выводит типы

TypeScript спроектирован так, чтобы вы писали минимум аннотаций. Компилятор анализирует код и *выводит* типы самостоятельно. Этот процесс называется **type inference** -- вывод типов.

## Базовый вывод типов

При объявлении переменной с инициализатором TypeScript выводит тип из значения:

```typescript
let x = 3;           // тип: number
let message = "hi";  // тип: string
let flag = true;     // тип: boolean

// const сужает тип до литерала
const y = 3;           // тип: 3 (литеральный тип)
const greeting = "hi"; // тип: "hi"
```

Вывод работает и для более сложных выражений:

```typescript
// Тип выводится из структуры объекта
let user = {
  name: "Алиса",
  age: 30,
};
// тип: { name: string; age: number }

// Тип массива выводится из элементов
let numbers = [1, 2, 3]; // тип: number[]
```

## Best Common Type

Когда TypeScript выводит тип из нескольких выражений (например, элементов массива), он ищет **best common type** -- наилучший общий тип, совместимый со всеми кандидатами:

```typescript
let zoo = [new Cat(), new Dog(), new Bird()];
// тип: (Cat | Dog | Bird)[]
```

TypeScript рассматривает каждый элемент как кандидата. Если ни один из кандидатов не является супертипом остальных, результат -- union всех кандидатов.

```typescript
// Если есть общий базовый тип, TypeScript его использует
class Animal { move() {} }
class Cat extends Animal { meow() {} }
class Dog extends Animal { bark() {} }

let pets = [new Cat(), new Dog()];
// тип: (Cat | Dog)[]
// НЕ Animal[], потому что Animal нет среди кандидатов

// Чтобы получить Animal[], укажите тип явно
let pets2: Animal[] = [new Cat(), new Dog()];
// тип: Animal[]
```

> **Важно:** best common type выбирается *из числа кандидатов*. Если общий базовый тип не представлен среди элементов, TypeScript не «угадывает» его -- он объединяет кандидатов в union.

## Contextual Typing (Контекстный вывод)

Контекстный вывод типов работает в обратном направлении -- TypeScript определяет тип выражения *из позиции*, в которой оно используется:

```typescript
// TypeScript знает, что параметр e -- это MouseEvent,
// потому что addEventListener ожидает обработчик для "mousedown"
window.addEventListener("mousedown", function (e) {
  console.log(e.button); // OK -- e: MouseEvent
});
```

Контекстный вывод применяется в множестве ситуаций:

```typescript
// Аргументы callback-функций
const names = ["Алиса", "Борис", "Вера"];
names.forEach(function (name) {
  console.log(name.toUpperCase()); // name: string
});

// Стрелочные функции
names.map((name) => name.length); // name: string, результат: number[]

// Правая часть присваивания с аннотированным типом
const handler: (event: KeyboardEvent) => void = (e) => {
  console.log(e.key); // e: KeyboardEvent
};
```

### Когда контекстный вывод не работает

Если функция находится в позиции без контекстного типа, параметры получают тип `any` (или ошибку при `noImplicitAny`):

```typescript
// Нет контекста -- TypeScript не знает тип x
// Ошибка: Parameter 'x' implicitly has an 'any' type
function double(x) {
  return x * 2;
}

// Исправление: добавьте аннотацию
function double(x: number): number {
  return x * 2;
}
```

## Вывод типов в дженериках

При вызове generic-функции TypeScript выводит параметры типов из переданных аргументов:

```typescript
function identity<T>(value: T): T {
  return value;
}

// T выводится как string
const result = identity("hello"); // тип: string

// T выводится как number
const num = identity(42); // тип: number
```

### Вывод из нескольких аргументов

Когда один параметр типа используется в нескольких позициях, TypeScript объединяет информацию:

```typescript
function merge<T>(a: T, b: T): T[] {
  return [a, b];
}

// T = string
merge("a", "b"); // OK: string[]

// T = string | number (TypeScript объединяет кандидатов)
merge("a", 1); // OK: (string | number)[]
```

### Вывод с ограничениями

Ограничения (`extends`) участвуют в процессе вывода:

```typescript
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

// T выводится как string
longest("abc", "de"); // OK: string

// T выводится как number[]
longest([1, 2, 3], [4, 5]); // OK: number[]

// Ошибка: number не имеет свойства length
// longest(10, 20);
```

### Вывод с несколькими параметрами типов

```typescript
function map<Input, Output>(
  arr: Input[],
  fn: (item: Input) => Output,
): Output[] {
  return arr.map(fn);
}

// Input = string, Output = number
const lengths = map(["hello", "world"], (s) => s.length);
// тип: number[]
```

Здесь TypeScript выводит `Input` из первого аргумента (массив строк), а `Output` -- из возвращаемого типа callback-функции.

## Вывод типа возвращаемого значения

TypeScript выводит тип возвращаемого значения функции из её тела:

```typescript
// Возвращаемый тип: string
function greet(name: string) {
  return `Привет, ${name}!`;
}

// Возвращаемый тип: number | string
function format(value: number | string) {
  if (typeof value === "number") {
    return value.toFixed(2); // string
  }
  return value; // string
}
```

> **Практика:** для публичных API-функций рекомендуется явно указывать возвращаемый тип. Это защищает от случайного изменения контракта и улучшает сообщения об ошибках.

## Типичные ловушки вывода типов

### Расширение литеральных типов (Widening)

```typescript
const x = "hello";  // тип: "hello" (литерал)
let y = "hello";    // тип: string (расширен)

// Объект: свойства расширяются
const config = {
  mode: "development", // тип: string, а не "development"
  port: 3000,          // тип: number, а не 3000
};

// Решение: as const
const config2 = {
  mode: "development",
  port: 3000,
} as const;
// тип: { readonly mode: "development"; readonly port: 3000 }
```

### Вывод `any` из пустых коллекций

```typescript
// Пустой массив без аннотации -- тип any[]
const items = []; // тип: any[] (при noImplicitAny -- ошибка)

// TypeScript "расширяет" тип по мере добавления элементов
items.push(1);      // тип: number[]
items.push("hello"); // тип: (number | string)[]

// Лучше: задайте тип явно
const items2: number[] = [];
```

## Итоги

| Механизм | Направление | Пример |
|----------|------------|--------|
| Базовый вывод | Значение -> тип | `let x = 3` -> `number` |
| Best common type | Несколько значений -> union | `[1, "a"]` -> `(number \| string)[]` |
| Contextual typing | Контекст -> параметры | `arr.map(x => ...)` |
| Вывод в дженериках | Аргументы -> параметры типов | `identity("hi")` -> `T = string` |
| Вывод return type | Тело функции -> возвращаемый тип | `return x + 1` -> `number` |

<DeepDive>

### Алгоритм вывода типов внутри компилятора

Когда TypeScript выводит параметры типа generic-функции, он использует алгоритм унификации:

1. **Сбор кандидатов** -- для каждого параметра типа T компилятор собирает все типы, которые T мог бы принять, на основе позиций использования.

2. **Ковариантные позиции** (возвращаемые типы, свойства) дают *нижнюю границу* -- T должен быть как минимум этим типом.

3. **Контравариантные позиции** (параметры функций) дают *верхнюю границу* -- T должен быть не более общим, чем этот тип.

4. **Выбор результата** -- если все кандидаты совместимы, TypeScript выбирает наиболее специфичный. Если нет -- объединяет в union.

Этот процесс происходит рекурсивно для вложенных типов. Когда параметр типа появляется в нескольких позициях с противоречивыми требованиями, TypeScript может выдать ошибку совместимости.

</DeepDive>
