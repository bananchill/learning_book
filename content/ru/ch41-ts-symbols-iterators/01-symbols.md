# Символы в TypeScript

## Что такое символ

`Symbol` -- примитивный тип данных, добавленный в ES2015. Каждый символ гарантированно уникален: два вызова `Symbol()` никогда не вернут одинаковое значение. Символы используются как уникальные ключи свойств объектов, предотвращая коллизии имён.

```typescript
const s1 = Symbol();
const s2 = Symbol("описание");
const s3 = Symbol("описание");

console.log(s2 === s3); // false -- каждый символ уникален
console.log(typeof s1);  // "symbol"
```

Описание (description) -- необязательная строка, которая помогает при отладке, но не влияет на уникальность символа.

## Тип `unique symbol`

В TypeScript обычный `Symbol()` получает тип `symbol`. Но иногда нужно, чтобы конкретный символ имел собственный, неповторимый тип. Для этого существует `unique symbol` -- подтип `symbol`, привязанный к конкретному объявлению.

```typescript
// unique symbol можно объявить только через const
const id: unique symbol = Symbol("id");
const name: unique symbol = Symbol("name");

// Ошибка компиляции: тип id !== тип name
// let check: typeof id = name;

// Обычный symbol -- менее строгий
let regularSym: symbol = Symbol();
regularSym = Symbol(); // OK -- оба имеют тип symbol
```

Ключевые правила `unique symbol`:

- Объявляется только через `const` (или `static readonly` в классе).
- Каждый `unique symbol` создаёт уникальный номинальный тип.
- `typeof mySymbol` возвращает этот уникальный тип, а не просто `symbol`.
- Нельзя присвоить один `unique symbol` другому без явного приведения.

```typescript
class Database {
  // static readonly тоже допускает unique symbol
  static readonly connectionId: unique symbol = Symbol("connectionId");
}

// typeof Database.connectionId -- уникальный тип
type ConnId = typeof Database.connectionId;
```

## Символы как ключи объектов

Символы могут быть вычисляемыми ключами свойств. TypeScript корректно выводит тип значения при доступе через символ:

```typescript
const serializable = Symbol("serializable");

interface Config {
  host: string;
  port: number;
  [serializable]: boolean; // символ как ключ
}

const config: Config = {
  host: "localhost",
  port: 3000,
  [serializable]: true,
};

// TypeScript знает, что это boolean
const canSerialize = config[serializable];
```

Символьные ключи не видны в `for...in`, `Object.keys()` и `JSON.stringify()`. Это делает их удобными для "скрытых" метаданных:

```typescript
const metadata = Symbol("metadata");

const user = {
  name: "Алексей",
  age: 30,
  [metadata]: { createdAt: Date.now() },
};

console.log(Object.keys(user));        // ["name", "age"]
console.log(JSON.stringify(user));      // {"name":"Алексей","age":30}
console.log(user[metadata].createdAt); // число -- метаданные доступны
```

## Well-known символы

ECMAScript определяет набор «общеизвестных» символов, которые используются движком для реализации внутренних протоколов. TypeScript предоставляет для них встроенные типы.

### `Symbol.hasInstance`

Управляет поведением оператора `instanceof`:

```typescript
class EvenNumber {
  static [Symbol.hasInstance](value: unknown): value is number {
    return typeof value === "number" && value % 2 === 0;
  }
}

console.log(4 instanceof EvenNumber);  // true
console.log(7 instanceof EvenNumber);  // false
```

### `Symbol.iterator`

Определяет метод, возвращающий итератор объекта. Подробно рассматривается в [следующей подглаве](./02-iterators.md).

```typescript
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator](): Iterator<number> {
    let current = this.from;
    const last = this.to;
    return {
      next(): IteratorResult<number> {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};

for (const n of range) {
  console.log(n); // 1, 2, 3, 4, 5
}
```

### `Symbol.toPrimitive`

Управляет приведением объекта к примитиву. Получает подсказку (`hint`): `"number"`, `"string"` или `"default"`:

```typescript
class Money {
  constructor(
    public amount: number,
    public currency: string
  ) {}

  [Symbol.toPrimitive](hint: string): number | string {
    if (hint === "number") {
      return this.amount;
    }
    if (hint === "string") {
      return `${this.amount} ${this.currency}`;
    }
    // hint === "default"
    return this.amount;
  }
}

const price = new Money(100, "RUB");

console.log(`Цена: ${price}`);  // "Цена: 100 RUB" (hint: "string")
console.log(+price);             // 100 (hint: "number")
console.log(price + 50);         // 150 (hint: "default")
```

### `Symbol.species`

Указывает конструктор для создания производных объектов. Используется встроенными методами вроде `Array.prototype.map`:

```typescript
class PowerArray<T> extends Array<T> {
  // map, filter и т.д. будут возвращать обычный Array
  static get [Symbol.species](): typeof Array {
    return Array;
  }
}

const arr = new PowerArray(1, 2, 3);
const mapped = arr.map((x) => x * 2);

console.log(mapped instanceof PowerArray); // false
console.log(mapped instanceof Array);      // true
```

### `Symbol.isConcatSpreadable`

Управляет поведением `Array.prototype.concat`:

```typescript
const extra = {
  0: "x",
  1: "y",
  length: 2,
  [Symbol.isConcatSpreadable]: true,
};

const result = ["a", "b"].concat(extra as any);
console.log(result); // ["a", "b", "x", "y"]
```

### Другие well-known символы

| Символ | Назначение |
|--------|-----------|
| `Symbol.asyncIterator` | Асинхронный итератор (см. [подглаву 03](./03-generators.md)) |
| `Symbol.match` | Поведение в `String.prototype.match` |
| `Symbol.replace` | Поведение в `String.prototype.replace` |
| `Symbol.search` | Поведение в `String.prototype.search` |
| `Symbol.split` | Поведение в `String.prototype.split` |
| `Symbol.toStringTag` | Строка для `Object.prototype.toString` |
| `Symbol.unscopables` | Свойства, исключённые из `with` |

```typescript
class CustomTag {
  get [Symbol.toStringTag](): string {
    return "MyCustomObject";
  }
}

const obj = new CustomTag();
console.log(Object.prototype.toString.call(obj));
// "[object MyCustomObject]"
```

## Глобальный реестр символов

`Symbol.for(key)` создаёт символ в глобальном реестре или возвращает существующий. В отличие от обычного `Symbol()`, два вызова `Symbol.for` с одним ключом вернут один и тот же символ:

```typescript
const s1 = Symbol.for("app.id");
const s2 = Symbol.for("app.id");

console.log(s1 === s2); // true

// Обратный поиск
console.log(Symbol.keyFor(s1)); // "app.id"
console.log(Symbol.keyFor(Symbol("local"))); // undefined
```

Глобальный реестр полезен для межмодульного обмена символами, но `unique symbol` обеспечивает более строгую типизацию на этапе компиляции.

<DeepDive>

## Номинальная типизация через `unique symbol`

`unique symbol` можно использовать для имитации номинальных типов (branded types) в TypeScript:

```typescript
declare const BrandUSD: unique symbol;
declare const BrandEUR: unique symbol;

type USD = number & { readonly [BrandUSD]: void };
type EUR = number & { readonly [BrandEUR]: void };

function usd(amount: number): USD {
  return amount as USD;
}

function eur(amount: number): EUR {
  return amount as EUR;
}

const dollars: USD = usd(100);
const euros: EUR = eur(85);

// Ошибка: нельзя присвоить EUR к USD
// const wrong: USD = euros;

function addDollars(a: USD, b: USD): USD {
  return (a + b) as USD;
}

addDollars(dollars, usd(50)); // OK
// addDollars(dollars, euros); // Ошибка компиляции
```

Это мощный паттерн для предотвращения логических ошибок, когда разные величины имеют один и тот же рантайм-тип `number`, но не должны смешиваться.

</DeepDive>
