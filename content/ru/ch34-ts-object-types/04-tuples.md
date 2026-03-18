---
title: "Кортежи"
parent: "ch34-ts-object-types"
order: 4
---

import { Callout } from '@book/ui'

## Что такое кортеж

Кортеж (Tuple) — это тип массива, где известно точное количество элементов и тип каждого из них:

```ts
type StringNumberPair = [string, number];

const pair: StringNumberPair = ["привет", 42];
// pair[0] — string
// pair[1] — number
```

В отличие от `Array<string | number>`, кортеж знает, что первый элемент — `string`, а второй — `number`. Это не просто массив с объединённым типом.

### Доступ к элементам

TypeScript знает тип каждого элемента по позиции:

```ts
function doSomething(pair: [string, number]) {
  const a = pair[0]; // string
  const b = pair[1]; // number

  // Ошибка: Tuple type '[string, number]' of length '2'
  // has no element at index '2'.
  const c = pair[2];
}
```

### Деструктуризация

Кортежи удобно деструктурировать:

```ts
function doSomething(input: [string, number]) {
  const [name, age] = input;
  // name: string
  // age: number
  console.log(`${name} — ${age} лет`);
}
```

### Длина кортежа

TypeScript знает точную длину кортежа:

```ts
function doSomething(pair: [string, number]) {
  // pair.length — тип: 2 (литеральный тип)
  const len: 2 = pair.length;
}
```

## Необязательные элементы кортежа

Элементы кортежа могут быть необязательными — с `?` в конце:

```ts
type Either2dOr3d = [number, number, number?];

function setCoordinate(coord: Either2dOr3d) {
  const [x, y, z] = coord;
  // x: number
  // y: number
  // z: number | undefined

  console.log(`Координаты: ${x}, ${y}${z !== undefined ? `, ${z}` : ""}`);
}

setCoordinate([1, 2]);    // OK — 2D
setCoordinate([1, 2, 3]); // OK — 3D
```

Необязательные элементы влияют на `length`. Тип `Either2dOr3d` имеет `length: 2 | 3`.

## Rest-элементы в кортежах

Кортежи могут содержать rest-элемент — массив неопределённой длины:

```ts
type StringNumberBooleans = [string, number, ...boolean[]];
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];
```

- `StringNumberBooleans` — первый элемент `string`, второй `number`, далее любое количество `boolean`
- `StringBooleansNumber` — первый `string`, последний `number`, между ними — `boolean[]`
- `BooleansStringNumber` — последние два — `string` и `number`, перед ними — `boolean[]`

```ts
const a: StringNumberBooleans = ["привет", 1];
const b: StringNumberBooleans = ["мир", 2, true];
const c: StringNumberBooleans = ["!", 3, true, false, true];
```

Кортеж с rest-элементом не имеет фиксированной длины, но типы позиций определены.

### Практическое применение: типизация rest-параметров

Кортежи с rest-элементами полезны для типизации функций с переменным числом аргументов:

```ts
function readButtonInput(...args: [string, number, ...boolean[]]) {
  const [name, version, ...input] = args;
  // name: string
  // version: number
  // input: boolean[]
}

// Эквивалентно:
function readButtonInput(name: string, version: number, ...input: boolean[]) {
  // ...
}
```

Это позволяет типизировать rest-параметры без промежуточных переменных.

## readonly кортежи

Как и массивы, кортежи можно сделать неизменяемыми:

```ts
function doSomething(pair: readonly [string, number]) {
  // Чтение — OK
  console.log(pair[0]);

  // Мутация — ошибка
  // Cannot assign to '0' because it is a read-only property.
  pair[0] = "новое значение";
}
```

### as const и кортежи

Кортежи часто появляются через `as const`. Когда массив создаётся с `as const`, TypeScript выводит `readonly` кортежный тип:

```ts
const point = [3, 4] as const;
// Тип: readonly [3, 4]

// Без as const:
const point2 = [3, 4];
// Тип: number[]
```

Это особенно полезно для функций, которые не собираются менять массив:

```ts
function distanceFromOrigin([x, y]: readonly [number, number]): number {
  return Math.sqrt(x ** 2 + y ** 2);
}

const point = [3, 4] as const;
distanceFromOrigin(point); // OK
```

Без `as const` TypeScript вывел бы `number[]`, и передача в функцию, ожидающую `[number, number]`, вызвала бы ошибку — потому что `number[]` не гарантирует наличие ровно двух элементов.

## Кортежи vs массивы: когда что использовать

| Критерий | `T[]` / `Array<T>` | `[T1, T2, ...]` |
|----------|-------------------|-----------------|
| Длина | Произвольная | Фиксированная |
| Тип элементов | Одинаковый | Разный для каждой позиции |
| Типичное применение | Коллекции однородных данных | Пары, координаты, возврат нескольких значений |
| `as const` | `readonly T[]` | `readonly [T1, T2]` |

## Практический пример: useState

<Callout type="info">
Этот пример использует React — внешнюю библиотеку для построения UI. Знание React не требуется: здесь важен сам паттерн возврата кортежа из функции.
</Callout>

Самый известный пример кортежа — React-хук `useState`:

```ts
// useState возвращает кортеж
function useState<S>(initial: S): [S, (newState: S) => void] {
  let state = initial;
  function setState(newState: S) {
    state = newState;
    // ...перерисовка
  }
  return [state, setState];
}

const [count, setCount] = useState(0);
// count: number
// setCount: (newState: number) => void
```

Кортеж позволяет деструктурировать результат с разными типами для каждого элемента.

## Итоги

- Кортеж — массив фиксированной длины с типизированными позициями
- `[string, number]` — ровно два элемента с известными типами
- `?` — необязательный элемент (`[string, number?]`)
- `...T[]` — rest-элемент для переменной длины
- `readonly [T1, T2]` — неизменяемый кортеж
- `as const` превращает литерал массива в `readonly`-кортеж
- Главное применение: пары значений, координаты, типизация rest-параметров
