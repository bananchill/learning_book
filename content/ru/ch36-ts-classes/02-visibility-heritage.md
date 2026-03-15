---
title: "Модификаторы доступа и наследование"
description: "public, protected, private в TypeScript, implements для интерфейсов, extends для наследования"
estimatedMinutes: 10
---

# Модификаторы доступа и наследование

## Модификаторы видимости

TypeScript предоставляет три модификатора доступа, контролирующих видимость членов класса на этапе компиляции.

### `public` (по умолчанию)

Член доступен отовсюду. Если модификатор не указан — он `public`:

```typescript
class Animal {
  public name: string; // явно public
  species: string;     // тоже public — по умолчанию

  constructor(name: string, species: string) {
    this.name = name;
    this.species = species;
  }

  public greet(): string {
    return `Привет, я ${this.name}!`;
  }
}
```

### `protected`

Член доступен в самом классе и в его наследниках, но не снаружи:

```typescript
class Base {
  protected internalState = 0;

  protected computeState(): number {
    return this.internalState * 2;
  }
}

class Derived extends Base {
  showState(): string {
    // OK — доступ из наследника
    return `Состояние: ${this.computeState()}`;
  }
}

const d = new Derived();
d.showState();       // OK
// d.internalState;  // Ошибка! protected — не доступен снаружи
// d.computeState(); // Ошибка! protected — не доступен снаружи
```

### `private`

Член доступен только внутри самого класса:

```typescript
class BankAccount {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  deposit(amount: number): void {
    this.validateAmount(amount);
    this.balance += amount;
  }

  getBalance(): number {
    return this.balance;
  }

  private validateAmount(amount: number): void {
    if (amount <= 0) {
      throw new Error("Сумма должна быть положительной");
    }
  }
}

class SavingsAccount extends BankAccount {
  addInterest(rate: number): void {
    // Ошибка! 'balance' is private and only accessible within class 'BankAccount'
    // this.balance *= (1 + rate);

    // Вместо этого — используем публичный API
    const interest = this.getBalance() * rate;
    this.deposit(interest);
  }
}
```

### TypeScript `private` vs ECMAScript `#private`

TypeScript предлагает два механизма приватности:

```typescript
class Comparison {
  private tsPrivate = "видим через any или at runtime";
  #jsPrivate = "истинно приватен в рантайме";

  check() {
    console.log(this.tsPrivate);  // OK
    console.log(this.#jsPrivate); // OK
  }
}

const obj = new Comparison();
// obj.tsPrivate;  // Ошибка компиляции, но (obj as any).tsPrivate работает!
// obj.#jsPrivate; // Ошибка компиляции И рантайм-ошибка
```

| Характеристика | `private` (TS) | `#private` (ES) |
|---------------|---------------|----------------|
| Проверка | Только компиляция | Компиляция + рантайм |
| Доступ через `any` | Да | Нет |
| Наследование | Не доступен в наследниках | Не доступен в наследниках |
| Производительность | Обычное свойство | WeakMap (до ES2022) |
| Совместимость | Любой target | ES2015+ |

> **Рекомендация:** для большинства проектов `private` достаточно. Используйте `#private`, когда нужна гарантия приватности в рантайме (библиотеки, security-sensitive код).

## Реализация интерфейсов: `implements`

Ключевое слово `implements` позволяет классу объявить, что он соответствует определённому контракту:

```typescript
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

interface Loggable {
  log(message: string): void;
}

// Класс может реализовывать несколько интерфейсов
class UserSettings implements Serializable, Loggable {
  private data: Record<string, string> = {};

  serialize(): string {
    return JSON.stringify(this.data);
  }

  deserialize(data: string): void {
    this.data = JSON.parse(data);
  }

  log(message: string): void {
    console.log(`[UserSettings] ${message}`);
  }
}
```

### Важные нюансы `implements`

`implements` — это только проверка соответствия. Он **не меняет тип** класса и **не добавляет** автоматически реализацию:

```typescript
interface Checkable {
  check(value: string): boolean;
}

class NameChecker implements Checkable {
  // Ошибка! Параметр 's' неявно имеет тип 'any'
  // implements НЕ задаёт типы параметров автоматически
  // check(s) {
  //   return s.length > 0;
  // }

  // Правильно — типы указываем явно
  check(value: string): boolean {
    return value.length > 0;
  }
}
```

```typescript
interface HasId {
  id: number;
}

class Entity implements HasId {
  // Нужно объявить поле явно!
  // implements не создаёт его автоматически
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}
```

## Наследование: `extends`

TypeScript обеспечивает полную типобезопасность при наследовании:

```typescript
class Shape {
  protected color: string;

  constructor(color: string) {
    this.color = color;
  }

  area(): number {
    return 0;
  }

  describe(): string {
    return `Фигура цвета ${this.color}, площадь: ${this.area()}`;
  }
}

class Rectangle extends Shape {
  constructor(
    color: string,
    private width: number,
    private height: number
  ) {
    super(color); // Вызов конструктора родителя обязателен
  }

  // Переопределение метода
  area(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(color: string, side: number) {
    super(color, side, side);
  }
}
```

### Порядок инициализации

TypeScript следует порядку инициализации JavaScript:

```typescript
class Base {
  name = "base";

  constructor() {
    // Внимание! В момент вызова this.name уже "base"
    console.log(`Конструктор Base: ${this.name}`);
    this.greet();
  }

  greet() {
    console.log(`Привет из Base: ${this.name}`);
  }
}

class Derived extends Base {
  name = "derived"; // Перезапишет ПОСЛЕ конструктора Base

  greet() {
    console.log(`Привет из Derived: ${this.name}`);
  }
}

// new Derived() выведет:
// "Конструктор Base: base"          — поле Base инициализировано
// "Привет из Derived: base"         — метод уже переопределён, но поле ещё "base"
// (затем поле Derived перезаписывается на "derived")
```

> **Порядок:** 1) Инициализация полей базового класса, 2) Конструктор базового класса, 3) Инициализация полей дочернего класса, 4) Конструктор дочернего класса.

### Переопределение методов и `override`

TypeScript 4.3+ поддерживает ключевое слово `override` для явного указания переопределения:

```typescript
class Writer {
  write(message: string): void {
    console.log(message);
  }
}

class FileWriter extends Writer {
  // override гарантирует, что метод действительно переопределяет родительский
  override write(message: string): void {
    // Вызов родительского метода
    super.write(`[FILE] ${message}`);
  }

  // Ошибка с noImplicitOverride! Нет метода 'wirte' в базовом классе
  // override wirte(message: string): void { }
}
```

> Включите `noImplicitOverride` в `tsconfig.json` — это заставит явно писать `override` при каждом переопределении и защитит от опечаток.

<DeepDive title="Структурная совместимость классов">

TypeScript использует структурную типизацию, даже для классов. Два класса совместимы, если их структура совпадает:

```typescript
class Point2D {
  constructor(public x: number, public y: number) {}
}

class Coordinate {
  constructor(public x: number, public y: number) {}
}

// Работает! Структуры совпадают
const p: Point2D = new Coordinate(1, 2);
```

**Исключение:** если класс содержит `private` или `protected` члены, совместимость требует, чтобы оба класса принадлежали одной иерархии наследования:

```typescript
class A {
  private secret = 42;
}

class B {
  private secret = 42;
}

// Ошибка! Несмотря на одинаковую структуру, private-члены из разных иерархий несовместимы
// const a: A = new B();
```

</DeepDive>
