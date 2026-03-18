import { DeepDive } from '@book/ui'

# Итераторы и for...of

## Протокол итерации

Протокол итерации -- это соглашение, определяющее два интерфейса: `Iterable` (итерируемый объект) и `Iterator` (итератор). Любой объект, реализующий `Iterable`, может использоваться в `for...of`, spread-операторе, деструктуризации и других конструкциях языка.

TypeScript определяет эти интерфейсы в `lib.es2015.iterable.d.ts`. `IteratorResult` описывает единичный шаг итерации — объект с полями `value` и `done`. `Iterator` — это объект с методом `next()`, возвращающим `IteratorResult`. `Iterable` — объект, у которого есть метод `[Symbol.iterator]()`, возвращающий `Iterator`. Эти три интерфейса связаны между собой и формируют единый протокол:

```typescript
interface IteratorResult<T, TReturn = any> {
  done: boolean;
  value: T | TReturn;
}

// Более точные варианты:
interface IteratorYieldResult<TYield> {
  done: false;
  value: TYield;
}

interface IteratorReturnResult<TReturn> {
  done: true;
  value: TReturn;
}

interface Iterator<T, TReturn = any, TNext = any> {
  next(value?: TNext): IteratorResult<T, TReturn>;
  return?(value?: TReturn): IteratorResult<T, TReturn>;
  throw?(e?: any): IteratorResult<T, TReturn>;
}

interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
}

interface IterableIterator<T> extends Iterator<T> {
  [Symbol.iterator](): IterableIterator<T>;
}
```

**`Iterable<T>`** -- объект с методом `[Symbol.iterator]()`, который возвращает `Iterator<T>`.

**`Iterator<T>`** -- объект с методом `next()`, возвращающим `{ value, done }`.

**`IterableIterator<T>`** -- объект, который одновременно является и итерируемым, и итератором (сам себя возвращает из `[Symbol.iterator]()`).

## Встроенные итерируемые типы

В JavaScript и TypeScript множество типов реализуют протокол итерации:

```typescript
// Массив
for (const item of [1, 2, 3]) {
  console.log(item); // 1, 2, 3
}

// Строка -- итерация по символам (Unicode code points)
for (const char of "Привет") {
  console.log(char); // П, р, и, в, е, т
}

// Map
const map = new Map<string, number>([["a", 1], ["b", 2]]);
for (const [key, value] of map) {
  console.log(key, value); // "a" 1, "b" 2
}

// Set
const set = new Set([10, 20, 30]);
for (const value of set) {
  console.log(value); // 10, 20, 30
}
```

## `for...of` vs `for...in`

Это два принципиально разных цикла:

| | `for...of` | `for...in` |
|---|-----------|-----------|
| Итерирует | **значения** итерируемого объекта | **ключи** (имена свойств) объекта |
| Работает с | `Iterable` (массивы, Map, Set, строки...) | любыми объектами |
| Тип ключей | зависит от итератора | всегда `string` |
| Прототип | не затрагивает | обходит цепочку прототипов |

```typescript
const arr = [10, 20, 30];

// for...of -- значения
for (const value of arr) {
  console.log(value); // 10, 20, 30
}

// for...in -- индексы (как строки!)
for (const index in arr) {
  console.log(index); // "0", "1", "2"
}
```

Важный нюанс: `for...in` обходит **все** перечисляемые свойства, включая унаследованные через прототип. `for...of` работает строго по протоколу `Symbol.iterator`.

```typescript
const obj = { a: 1, b: 2, c: 3 };

// for...in работает с обычными объектами
for (const key in obj) {
  console.log(key); // "a", "b", "c"
}

// for...of НЕ работает с обычными объектами
// for (const value of obj) {} // Ошибка: obj is not iterable
```

## Создание пользовательского итерируемого объекта

Любой объект можно сделать итерируемым, реализовав метод `[Symbol.iterator]()`:

```typescript
class NumberRange implements Iterable<number> {
  constructor(
    private readonly start: number,
    private readonly end: number
  ) {}

  [Symbol.iterator](): Iterator<number> {
    let current = this.start;
    const end = this.end;

    return {
      next(): IteratorResult<number> {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

const range = new NumberRange(1, 5);

// for...of
for (const n of range) {
  console.log(n); // 1, 2, 3, 4, 5
}

// Spread
const arr = [...range]; // [1, 2, 3, 4, 5]

// Деструктуризация
const [first, second] = range; // 1, 2

// Array.from
const fromRange = Array.from(range); // [1, 2, 3, 4, 5]
```

## Бесконечные итераторы

Итератор не обязан завершаться. Бесконечный итератор полезен в сочетании с ленивыми операциями:

```typescript
function naturals(): IterableIterator<number> {
  let n = 1;
  return {
    next(): IteratorResult<number> {
      return { value: n++, done: false };
    },
    [Symbol.iterator]() {
      return this;
    },
  };
}

// Берём первые 5 значений
const first5: number[] = [];
for (const n of naturals()) {
  if (first5.length >= 5) break;
  first5.push(n);
}
console.log(first5); // [1, 2, 3, 4, 5]
```

## Ленивые операции над итераторами

Можно создавать функции-трансформаторы, которые принимают и возвращают итераторы без материализации промежуточных массивов:

```typescript
function* map<T, U>(
  iterable: Iterable<T>,
  fn: (item: T) => U
): IterableIterator<U> {
  for (const item of iterable) {
    yield fn(item);
  }
}

function* filter<T>(
  iterable: Iterable<T>,
  predicate: (item: T) => boolean
): IterableIterator<T> {
  for (const item of iterable) {
    if (predicate(item)) {
      yield item;
    }
  }
}

function* take<T>(
  iterable: Iterable<T>,
  count: number
): IterableIterator<T> {
  let taken = 0;
  for (const item of iterable) {
    if (taken >= count) return;
    yield item;
    taken++;
  }
}

// Композиция: первые 5 чётных квадратов натуральных чисел
function* naturals(): IterableIterator<number> {
  let n = 1;
  while (true) yield n++;
}

const result = [
  ...take(
    filter(
      map(naturals(), (n) => n * n),
      (n) => n % 2 === 0
    ),
    5
  ),
];

console.log(result); // [4, 16, 36, 64, 100]
```

## Метод `return()` итератора

Итератор может реализовать метод `return()`, который вызывается при преждевременном выходе из цикла (`break`, `throw`, `return` из функции):

```typescript
function createResource(): Iterable<string> {
  return {
    [Symbol.iterator]() {
      console.log("Ресурс открыт");
      let i = 0;
      const data = ["строка1", "строка2", "строка3"];

      return {
        next(): IteratorResult<string> {
          if (i < data.length) {
            return { value: data[i++], done: false };
          }
          return { value: undefined, done: true };
        },
        return(): IteratorResult<string> {
          console.log("Ресурс закрыт (cleanup)");
          return { value: undefined, done: true };
        },
      };
    },
  };
}

for (const line of createResource()) {
  console.log(line);
  if (line === "строка1") break; // Вызовет return()
}
// Вывод:
// Ресурс открыт
// строка1
// Ресурс закрыт (cleanup)
```

## Целевой стандарт компиляции (`target`)

Поведение `for...of` в TypeScript зависит от `target` в `tsconfig.json`:

- **`target: "ES2015"` и выше** -- `for...of` компилируется как есть. Работает с любыми `Iterable`.
- **`target: "ES5"`** -- TypeScript преобразует `for...of` в обычный `for` по индексу. Это работает только с `Array`. Для поддержки `Map`, `Set` и пользовательских итерируемых объектов нужна опция `downlevelIteration: true`.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5",
    "downlevelIteration": true // Включает полифилл для итерации
  }
}
```

<DeepDive>

## Паттерн: итерируемая структура данных

Рассмотрим реализацию связного списка, который одновременно является итерируемым объектом:

```typescript
class LinkedListNode<T> {
  constructor(
    public value: T,
    public next: LinkedListNode<T> | null = null
  ) {}
}

class LinkedList<T> implements Iterable<T> {
  private head: LinkedListNode<T> | null = null;
  private _size = 0;

  get size(): number {
    return this._size;
  }

  push(value: T): void {
    const node = new LinkedListNode(value);
    node.next = this.head;
    this.head = node;
    this._size++;
  }

  [Symbol.iterator](): Iterator<T> {
    let current = this.head;

    return {
      next(): IteratorResult<T> {
        if (current !== null) {
          const value = current.value;
          current = current.next;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  }
}

const list = new LinkedList<number>();
list.push(3);
list.push(2);
list.push(1);

for (const value of list) {
  console.log(value); // 1, 2, 3
}

const arr = [...list]; // [1, 2, 3]
```

Реализация `Iterable<T>` интегрирует пользовательскую структуру данных со всей экосистемой JavaScript: `for...of`, spread, деструктуризация, `Array.from()` и любые функции, принимающие `Iterable`.

</DeepDive>
