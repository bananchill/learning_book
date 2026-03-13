---
title: "Сужение типов (Type Narrowing) и контроль потока"
parent: "ch06-ts-type-system"
order: 5
---

## Что такое type narrowing

TypeScript отслеживает типы переменных в **потоке кода** и автоматически сужает их после проверок. Это называется **control flow analysis (CFA)**:

```ts
function process(value: string | number) {
  // Здесь value: string | number

  if (typeof value === 'string') {
    // Здесь value: string — TypeScript сузил тип
    console.log(value.toUpperCase())
  } else {
    // Здесь value: number
    console.log(value.toFixed(2))
  }
}
```

TypeScript анализирует `if`, `switch`, `while`, тернарные операторы и другие конструкции, чтобы определить тип переменной в каждой точке кода.

## Встроенные type guards

### typeof

Работает для примитивов: `string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `function`:

```ts
function format(value: string | number | boolean) {
  if (typeof value === 'string') return `"${value}"`
  if (typeof value === 'number') return value.toFixed(2)
  return value ? 'да' : 'нет'
}
```

> **Внимание:** `typeof null === 'object'` — исторический баг JavaScript. TypeScript это знает и не сужает `typeof x === 'object'` до исключения `null`.

### instanceof

Работает для классов и конструкторов:

```ts
function logError(error: Error | string) {
  if (error instanceof Error) {
    console.log(error.message) // error: Error
    console.log(error.stack)
  } else {
    console.log(error) // error: string
  }
}
```

### Оператор in

Проверяет наличие свойства в объекте:

```ts
type Fish = { swim: () => void }
type Bird = { fly: () => void }

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim() // animal: Fish
  } else {
    animal.fly()  // animal: Bird
  }
}
```

### Equality checks

Проверка на равенство сужает тип:

```ts
function handle(x: string | null) {
  if (x !== null) {
    x.toUpperCase() // x: string
  }
}

function compare(a: string | number, b: string | boolean) {
  if (a === b) {
    // Единственный общий тип: string
    a.toUpperCase() // a: string
    b.toUpperCase() // b: string
  }
}
```

### Truthiness narrowing

```ts
function printName(name: string | null | undefined) {
  if (name) {
    console.log(name.toUpperCase()) // name: string
  }
}
```

> **Внимание:** Truthiness check отбрасывает `""`, `0`, `NaN`, `null`, `undefined`. Если пустая строка или ноль — допустимые значения, используйте явную проверку: `if (name !== null && name !== undefined)`.

## Пользовательские type guards (is)

Когда встроенных проверок не хватает, можно создать **type predicate**:

```ts
type Fish = { name: string; swim: () => void }
type Bird = { name: string; fly: () => void }

// Type predicate: возвращаемый тип `pet is Fish`
function isFish(pet: Fish | Bird): pet is Fish {
  return 'swim' in pet
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim() // pet: Fish
  } else {
    pet.fly()  // pet: Bird
  }
}
```

Практический пример — фильтрация массива:

```ts
// Без type guard — TypeScript не сужает тип
const mixed: (string | null)[] = ['hello', null, 'world']
const strings1 = mixed.filter(x => x !== null) // Тип: (string | null)[]

// С type guard — тип сужен
function isNotNull<T>(value: T | null): value is T {
  return value !== null
}
const strings2 = mixed.filter(isNotNull) // Тип: string[] ✅
```

## Discriminated unions — главный паттерн TypeScript

Discriminated union — это union тип, где у каждого варианта есть **общее литеральное свойство** (дискриминант):

```ts
type Circle = {
  kind: 'circle'  // Дискриминант
  radius: number
}

type Square = {
  kind: 'square'  // Дискриминант
  side: number
}

type Triangle = {
  kind: 'triangle'  // Дискриминант
  base: number
  height: number
}

type Shape = Circle | Square | Triangle

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2  // shape: Circle
    case 'square':
      return shape.side ** 2              // shape: Square
    case 'triangle':
      return 0.5 * shape.base * shape.height // shape: Triangle
  }
}
```

TypeScript сужает тип `shape` в каждом `case` на основе значения дискриминанта `kind`.

### Exhaustive check с never

Как убедиться, что все варианты обработаны? Используйте `never`:

```ts
function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'square':
      return shape.side ** 2
    case 'triangle':
      return 0.5 * shape.base * shape.height
    default:
      // Если все варианты обработаны, shape тут — never
      const _exhaustive: never = shape
      return _exhaustive
  }
}
```

Теперь, если добавить новый вариант в `Shape` (например, `Rectangle`), компилятор выдаст ошибку в `default` — `Rectangle` не присваивается `never`. Это гарантирует, что вы не забудете обработать новый вариант.

### Реальный пример: Redux-подобные actions

```ts
type Action =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET'; payload: number }

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'INCREMENT': return state + 1
    case 'DECREMENT': return state - 1
    case 'SET': return action.payload // TS знает, что payload есть
    default:
      const _: never = action
      return state
  }
}
```

## Assertion functions

Функция, которая **бросает ошибку**, если условие не выполнено, и сужает тип после вызова:

```ts
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`Ожидалась строка, получено: ${typeof value}`)
  }
}

function process(input: unknown) {
  assertIsString(input)
  // После assert — input: string
  console.log(input.toUpperCase())
}
```

## Ограничения CFA

### Потеря сужения в замыканиях

TypeScript теряет информацию о сужении, когда переменная используется внутри callback:

```ts
function example(value: string | null) {
  if (value !== null) {
    // Здесь value: string ✅

    setTimeout(() => {
      // Здесь value: string | null ❌
      // TypeScript не гарантирует, что value не изменился
      // между if-проверкой и вызовом callback
    }, 100)
  }
}
```

Это связано с тем, как работают [замыкания](/javascript/ch01-closures) — callback замыкается на переменную, но выполняется позже, когда значение могло измениться.

Решение — сохранить в `const`:

```ts
function example(value: string | null) {
  if (value !== null) {
    const safeValue = value // safeValue: string — не может измениться
    setTimeout(() => {
      console.log(safeValue.toUpperCase()) // ✅
    }, 100)
  }
}
```

<details>
<summary>Копай глубже: Как работает Control Flow Analysis внутри</summary>

TypeScript строит **граф потока управления** (control flow graph) для каждой функции. В каждом узле графа хранится набор «фактов» о типах переменных. Ветвления (`if`, `switch`) создают новые узлы с уточнёнными фактами. При слиянии путей (после if/else) факты объединяются обратно в union. CFA — одна из самых сложных частей компилятора TypeScript и продолжает развиваться с каждой версией.

</details>

## Итого

| Механизм | Что делает | Пример |
|----------|-----------|--------|
| `typeof` | Проверка примитива | `typeof x === 'string'` |
| `instanceof` | Проверка класса | `x instanceof Error` |
| `in` | Наличие свойства | `'swim' in animal` |
| `===` / `!==` | Равенство | `x !== null` |
| `is` (type predicate) | Пользовательский guard | `(x): x is Fish =>` |
| Discriminated union | Union + дискриминант | `switch (shape.kind)` |
| `asserts` | Assert + сужение | `asserts x is string` |
| `never` | Exhaustive check | `const _: never = x` |
