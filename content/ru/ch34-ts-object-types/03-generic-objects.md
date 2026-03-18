---
title: "Generic-объекты и интерфейсы"
parent: "ch34-ts-object-types"
order: 3
---

import { Callout } from '@book/ui'

## Проблема: дублирование контейнерных типов

Представь, что тебе нужен тип-контейнер «коробка», которая хранит одно значение:

```ts
interface StringBox {
  contents: string;
}

interface NumberBox {
  contents: number;
}

interface BooleanBox {
  contents: boolean;
}
```

Три интерфейса с одинаковой структурой, но разным типом `contents`. Для каждого нужна своя функция:

```ts
function setStringContents(box: StringBox, value: string) {
  box.contents = value;
}

function setNumberContents(box: NumberBox, value: number) {
  box.contents = value;
}
```

Этот код дублируется. Можно использовать `contents: any`, но это убивает типобезопасность. Решение — дженерики.

## Generic-объектные типы

Вместо дублирования создадим один параметризованный тип:

```ts
interface Box<Type> {
  contents: Type;
}
```

`Box<Type>` — это шаблон. `Type` — параметр типа (type parameter). При использовании подставляется конкретный тип:

```ts
const stringBox: Box<string> = { contents: "привет" };
const numberBox: Box<number> = { contents: 42 };
const dateBox: Box<Date> = { contents: new Date() };
```

TypeScript подставляет `Type` → `string`, `Type` → `number`, `Type` → `Date`. Для каждого использования компилятор знает точный тип `contents`.

### Универсальная функция

Теперь можно написать одну функцию для любой «коробки»:

```ts
function setContents<Type>(box: Box<Type>, value: Type) {
  box.contents = value;
}

setContents(stringBox, "мир");     // OK
setContents(numberBox, 100);       // OK
// setContents(numberBox, "текст"); // Ошибка: string не совместим с number
```

### Type alias тоже может быть generic

Дженерики работают не только с `interface`, но и с `type`:

```ts
type Box<Type> = {
  contents: Type;
};

type OrNull<Type> = Type | null;
type OneOrMany<Type> = Type | Type[];
type OneOrManyOrNull<Type> = OrNull<OneOrMany<Type>>;
// Результат: Type | Type[] | null
```

Псевдонимы типов, в отличие от интерфейсов, могут описывать не только объекты:

```ts
type StringOrNumber = string | number;
type Callback<T> = (value: T) => void;
type Pair<A, B> = [A, B];
```

## Тип Array

Массив `Array<T>` — это generic-тип из стандартной библиотеки TypeScript. Запись `number[]` — это синтаксический сахар для `Array<number>`:

```ts
// Эти два объявления эквивалентны
const a: number[] = [1, 2, 3];
const b: Array<number> = [1, 2, 3];
```

Интерфейс `Array` в стандартной библиотеке выглядит примерно так:

```ts
interface Array<Type> {
  length: number;
  pop(): Type | undefined;
  push(...items: Type[]): number;
  // ...и другие методы
  [index: number]: Type;
}
```

Это обычный generic-интерфейс с индексной сигнатурой и методами, типизированными через параметр `Type`.

Другие generic-типы из стандартной библиотеки: `Map<K, V>`, `Set<T>`, `Promise<T>`.

## ReadonlyArray

`ReadonlyArray<T>` описывает массив, который нельзя изменять:

```ts
function doStuff(values: ReadonlyArray<string>) {
  // Чтение — OK
  const copy = values.slice();
  console.log(`Первый: ${values[0]}`);

  // Мутация — ошибка
  // Property 'push' does not exist on type 'readonly string[]'
  values.push("новый");
}
```

### Сокращённый синтаксис

Аналогично `Array<T>` → `T[]`, есть сокращение для `ReadonlyArray<T>`:

```ts
// Эти два объявления эквивалентны
const a: ReadonlyArray<string> = ["a", "b"];
const b: readonly string[] = ["a", "b"];
```

### ReadonlyArray нельзя создать через конструктор

В отличие от `Array`, у `ReadonlyArray` нет конструктора:

```ts
// Ошибка: 'ReadonlyArray' only refers to a type,
// but is being used as a value here.
new ReadonlyArray("red", "green", "blue");
```

Вместо этого присваивай обычный массив:

```ts
const roArray: ReadonlyArray<string> = ["red", "green", "blue"];
```

### Совместимость Array и ReadonlyArray

`Array` можно присвоить `ReadonlyArray`, но не наоборот:

```ts
let mutable: string[] = ["a", "b"];
let immutable: readonly string[] = mutable; // OK

// Ошибка: readonly string[] нельзя присвоить string[]
mutable = immutable;
```

Это логично: `ReadonlyArray` гарантирует отсутствие мутаций, а `string[]` — нет. Если бы присваивание в обратную сторону было разрешено, можно было бы мутировать массив через `mutable`, нарушая гарантии `immutable`.

## Практический пример: generic-репозиторий

<Callout type="info">
Ключевое слово `implements` объявляет, что класс соответствует интерфейсу. Подробно классы в TypeScript рассмотрены в [главе Классы](/frontend/typescript/ch36-ts-classes).
</Callout>

```ts
interface Entity {
  id: number;
}

interface Repository<T extends Entity> {
  getById(id: number): T | undefined;
  getAll(): ReadonlyArray<T>;
  save(entity: T): void;
  delete(id: number): boolean;
}

interface User extends Entity {
  name: string;
  email: string;
}

// Реализация для пользователей
class UserRepository implements Repository<User> {
  private users: User[] = [];

  getById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getAll(): ReadonlyArray<User> {
    return this.users;
  }

  save(user: User): void {
    const index = this.users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      this.users[index] = user;
    } else {
      this.users.push(user);
    }
  }

  delete(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}
```

`Repository<T extends Entity>` — generic-интерфейс с ограничением: `T` должен иметь свойство `id`. Это позволяет писать типобезопасный код для любых сущностей.

## Итоги

- Generic-объектные типы устраняют дублирование через параметры типов
- `Box<Type>` — шаблон, `Box<string>` — конкретный тип
- `Array<T>` ≡ `T[]` — встроенный generic-тип
- `ReadonlyArray<T>` ≡ `readonly T[]` — массив без мутаций
- `ReadonlyArray` → `Array` — нельзя, `Array` → `ReadonlyArray` — можно
- Generic-типы работают и с `interface`, и с `type`
