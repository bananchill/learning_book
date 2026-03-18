import { DeepDive } from '@book/ui'

# Генераторы и типизация yield

## Функции-генераторы

Функция-генератор (`function*`) -- это функция, которая может приостанавливать своё выполнение с помощью `yield` и возобновлять его позже. Каждый вызов `next()` выполняет код до следующего `yield`.

```typescript
function* countdown(start: number): Generator<number, string, unknown> {
  for (let i = start; i > 0; i--) {
    yield i;
  }
  return "Готово!";
}

const gen = countdown(3);

console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: "Готово!", done: true }
```

Генераторы автоматически реализуют протокол `IterableIterator`, поэтому их можно использовать в `for...of`:

```typescript
for (const n of countdown(3)) {
  console.log(n); // 3, 2, 1 (return-значение "Готово!" не попадает в for...of)
}
```

## Тип `Generator<T, TReturn, TNext>`

TypeScript описывает генераторы тремя параметрами типа:

```typescript
interface Generator<T = unknown, TReturn = any, TNext = unknown>
  extends Iterator<T, TReturn, TNext> {
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return(value: TReturn): IteratorResult<T, TReturn>;
  throw(e: any): IteratorResult<T, TReturn>;
  [Symbol.iterator](): Generator<T, TReturn, TNext>;
}
```

| Параметр | Описание | Где проявляется |
|----------|---------|----------------|
| `T` (yield type) | Тип значений, которые генератор **отдаёт** через `yield` | `gen.next().value` когда `done: false` |
| `TReturn` | Тип значения, которое генератор **возвращает** через `return` | `gen.next().value` когда `done: true` |
| `TNext` | Тип значения, которое **передаётся** в генератор через `next(value)` | Аргумент `gen.next(value)` |

### Пример с передачей значений в генератор

```typescript
function* accumulator(): Generator<number, number, number> {
  let total = 0;
  while (true) {
    // yield отдаёт текущий total и принимает следующее значение
    const input: number = yield total;
    total += input;
  }
}

const acc = accumulator();
acc.next();           // { value: 0, done: false } -- первый next() запускает генератор
acc.next(10);         // { value: 10, done: false }
acc.next(20);         // { value: 30, done: false }
console.log(acc.next(5)); // { value: 35, done: false }
```

Первый вызов `next()` всегда запускает генератор до первого `yield` -- передаваемый аргумент игнорируется. Последующие вызовы `next(value)` передают `value` как результат выражения `yield`.

### Вывод типов

TypeScript умеет выводить тип генератора автоматически:

```typescript
// Тип: Generator<number, void, unknown>
function* fibonacci() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;           // T = number (выводится из yield)
    [a, b] = [b, a + b];
  }
  // Нет return -- TReturn = void
  // next() не принимает значений -- TNext = unknown
}
```

Если нужна точность, можно указать тип явно:

```typescript
function* typedGen(): Generator<string, boolean, number> {
  const input: number = yield "начало";
  const input2: number = yield `получено: ${input}`;
  return input2 > 10;
}
```

## Делегирование через `yield*`

Оператор `yield*` передаёт управление другому итерируемому объекту или генератору. Все значения делегированного генератора «проходят через» текущий:

```typescript
function* inner(): Generator<string, number, unknown> {
  yield "a";
  yield "b";
  return 42; // return-значение доступно через yield*
}

function* outer(): Generator<string | number, void, unknown> {
  yield 1;
  const result: number = yield* inner(); // делегирование
  console.log(`inner вернул: ${result}`); // 42
  yield 2;
}

const values = [...outer()];
console.log(values); // [1, "a", "b", 2]
// Обратите внимание: return-значение 42 НЕ попадает в итерацию
```

`yield*` можно использовать с любым `Iterable`:

```typescript
function* flatten<T>(arrays: Iterable<T[]>): Generator<T> {
  for (const arr of arrays) {
    yield* arr; // делегирование массиву
  }
}

const flat = [...flatten([[1, 2], [3, 4], [5]])];
console.log(flat); // [1, 2, 3, 4, 5]
```

## Генераторы как конечные автоматы

Генераторы идеально подходят для описания конечных автоматов (state machines), где каждый `yield` -- это переход между состояниями:

```typescript
type TrafficLight = "red" | "yellow" | "green";

function* trafficLightCycle(): Generator<TrafficLight, never, unknown> {
  while (true) {
    yield "red";
    yield "green";
    yield "yellow";
  }
}

const light = trafficLightCycle();
console.log(light.next().value); // "red"
console.log(light.next().value); // "green"
console.log(light.next().value); // "yellow"
console.log(light.next().value); // "red" -- цикл повторяется
```

Более сложный пример с состоянием:

```typescript
interface ConnectionState {
  status: "disconnected" | "connecting" | "connected" | "error";
  message: string;
}

type ConnectionAction = "connect" | "disconnect" | "retry";

function* connectionManager(): Generator<ConnectionState, void, ConnectionAction> {
  let action: ConnectionAction;

  while (true) {
    // Состояние: отключён
    action = yield { status: "disconnected", message: "Ожидание подключения" };

    if (action === "connect") {
      // Состояние: подключение
      action = yield { status: "connecting", message: "Подключение..." };

      // Имитация: 50% шанс ошибки
      if (Math.random() > 0.5) {
        action = yield { status: "connected", message: "Подключено" };

        if (action === "disconnect") {
          continue; // Назад к disconnected
        }
      } else {
        action = yield { status: "error", message: "Ошибка подключения" };

        if (action === "retry") {
          continue; // Назад к disconnected, затем попробует снова
        }
      }
    }
  }
}
```

## Асинхронные генераторы

Асинхронные генераторы (`async function*`) объединяют `async/await` и `yield`. Они реализуют интерфейс `AsyncGenerator<T, TReturn, TNext>` и итерируются через `for await...of`:

```typescript
interface AsyncGenerator<T = unknown, TReturn = any, TNext = unknown> {
  next(...args: [] | [TNext]): Promise<IteratorResult<T, TReturn>>;
  return(value: TReturn): Promise<IteratorResult<T, TReturn>>;
  throw(e: any): Promise<IteratorResult<T, TReturn>>;
  [Symbol.asyncIterator](): AsyncGenerator<T, TReturn, TNext>;
}
```

```typescript
async function* fetchPages(urls: string[]): AsyncGenerator<string> {
  for (const url of urls) {
    const response = await fetch(url);
    const text = await response.text();
    yield text; // Каждая страница отдаётся по мере загрузки
  }
}

async function processPages(): Promise<void> {
  const urls = [
    "https://example.com/page1",
    "https://example.com/page2",
    "https://example.com/page3",
  ];

  for await (const html of fetchPages(urls)) {
    console.log(`Получено ${html.length} символов`);
  }
}
```

### `Symbol.asyncIterator`

Аналог `Symbol.iterator` для асинхронных итерируемых объектов:

```typescript
class AsyncRange implements AsyncIterable<number> {
  constructor(
    private start: number,
    private end: number,
    private delayMs: number
  ) {}

  async *[Symbol.asyncIterator](): AsyncGenerator<number> {
    for (let i = this.start; i <= this.end; i++) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs));
      yield i;
    }
  }
}

async function main(): Promise<void> {
  // Числа от 1 до 5 с задержкой 500мс
  for await (const n of new AsyncRange(1, 5, 500)) {
    console.log(n);
  }
}
```

### Паттерн: потоковое чтение данных

Асинхронные генераторы идеальны для потоковой обработки:

```typescript
async function* readLines(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<string> {
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      if (buffer.length > 0) {
        yield buffer;
      }
      return;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      yield line;
    }
  }
}
```

## Целевой стандарт для генераторов

Для полноценной поддержки генераторов и асинхронных генераторов в TypeScript:

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    // Для синхронных генераторов: ES2015+
    // Для for await...of: ES2018+
    // Для асинхронных генераторов: ES2018+
    "target": "ES2018",
    "lib": ["ES2018"]
  }
}
```

<DeepDive>

## Типизация `yield*` и вывод `TReturn`

При делегировании через `yield*` TypeScript извлекает тип `TReturn` делегированного генератора:

```typescript
function* innerGen(): Generator<string, number, unknown> {
  yield "hello";
  return 100;
}

function* outerGen(): Generator<string | boolean, void, unknown> {
  // TypeScript знает, что result: number (TReturn innerGen)
  const result: number = yield* innerGen();
  yield result > 50; // boolean
}
```

Это работает благодаря тому, что `yield*` возвращает значение `return` делегированного генератора. TypeScript корректно выводит этот тип даже в сложных цепочках делегирования.

Однако если делегируемый объект -- не генератор, а обычный `Iterable`, то `yield*` возвращает `void`:

```typescript
function* delegateToArray(): Generator<number, void, unknown> {
  const result: void = yield* [1, 2, 3]; // Iterable не имеет TReturn
  console.log(result); // undefined
}
```

</DeepDive>
