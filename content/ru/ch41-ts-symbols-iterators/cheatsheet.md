# Шпаргалка: Символы, итераторы и генераторы

## Символы

```typescript
// Создание символа
const s = Symbol("описание");

// unique symbol -- уникальный тип
const id: unique symbol = Symbol("id");

// Символ как ключ объекта
const key = Symbol("key");
const obj = { [key]: "значение" };

// Глобальный реестр
const shared = Symbol.for("app.shared");
Symbol.keyFor(shared); // "app.shared"
```

## Well-known символы

| Символ | Назначение |
|--------|-----------|
| `Symbol.iterator` | Синхронный итератор |
| `Symbol.asyncIterator` | Асинхронный итератор |
| `Symbol.hasInstance` | Поведение `instanceof` |
| `Symbol.toPrimitive` | Приведение к примитиву |
| `Symbol.species` | Конструктор для производных объектов |
| `Symbol.toStringTag` | Строка для `toString()` |
| `Symbol.isConcatSpreadable` | Развёртывание в `concat()` |

## Итераторы

```typescript
// Интерфейсы
interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
}

interface Iterator<T> {
  next(): IteratorResult<T>;
  return?(): IteratorResult<T>;
  throw?(e: any): IteratorResult<T>;
}

// Пользовательский итерируемый объект
class Range implements Iterable<number> {
  constructor(private start: number, private end: number) {}
  [Symbol.iterator](): Iterator<number> {
    let current = this.start;
    const end = this.end;
    return {
      next(): IteratorResult<number> {
        return current <= end
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  }
}
```

## `for...of` vs `for...in`

```typescript
const arr = [10, 20, 30];
for (const value of arr) {}  // 10, 20, 30 (значения)
for (const index in arr) {}  // "0", "1", "2" (ключи-строки)
```

## Генераторы

```typescript
// Generator<TYield, TReturn, TNext>
function* gen(): Generator<number, string, boolean> {
  const input: boolean = yield 1;    // отдаёт number, принимает boolean
  return input ? "да" : "нет";       // возвращает string
}

// Делегирование
function* outer(): Generator<number> {
  yield* [1, 2, 3];          // делегирование iterable
  const r = yield* inner();  // делегирование генератору (r = TReturn)
}
```

## Асинхронные генераторы

```typescript
// AsyncGenerator<TYield, TReturn, TNext>
async function* stream(): AsyncGenerator<string> {
  const data = await fetch(url);
  yield await data.text();
}

// Итерация
for await (const chunk of stream()) {
  console.log(chunk);
}

// Асинхронный итерируемый объект
class AsyncSource implements AsyncIterable<number> {
  async *[Symbol.asyncIterator](): AsyncGenerator<number> {
    yield 1;
    yield 2;
  }
}
```

## Полезные паттерны

```typescript
// Бесконечный генератор
function* naturals(): Generator<number, never, unknown> {
  let n = 1;
  while (true) yield n++;
}

// Ленивые операции
function* take<T>(iter: Iterable<T>, n: number): Generator<T> {
  let count = 0;
  for (const item of iter) {
    if (count++ >= n) return;
    yield item;
  }
}

// Branded types через unique symbol
declare const Brand: unique symbol;
type Branded<T, B> = T & { readonly [Brand]: B };
```

## tsconfig.json

```jsonc
{
  "compilerOptions": {
    "target": "ES2018",          // Генераторы + async генераторы
    "downlevelIteration": true,  // Полифилл итерации для ES5
    "lib": ["ES2018"]
  }
}
```
