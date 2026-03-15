---
title: "Шпаргалка: Классы в TypeScript"
description: "Краткая справка по классам TypeScript — поля, модификаторы, наследование, абстрактные классы, миксины"
---

# Шпаргалка: Классы в TypeScript

## Объявление полей

```typescript
class Example {
  name: string;                    // обычное поле
  readonly id: number;             // неизменяемое после конструктора
  optional?: string;               // опциональное поле
  definite!: string;               // «Я гарантирую инициализацию»
  initialized = 42;                // инициализация + вывод типа
}
```

## Parameter Properties

```typescript
class User {
  constructor(
    public name: string,           // создаёт public-поле
    private age: number,           // создаёт private-поле
    protected role: string,        // создаёт protected-поле
    readonly id: string            // создаёт readonly-поле
  ) {}
}
```

## Модификаторы доступа

| Модификатор | Класс | Наследник | Снаружи |
|-------------|-------|-----------|---------|
| `public`    | +     | +         | +       |
| `protected` | +     | +         | -       |
| `private`   | +     | -         | -       |
| `#private`  | +     | -         | - (рантайм) |

## Наследование

```typescript
class Animal {
  constructor(public name: string) {}
  speak(): string { return "..."; }
}

class Dog extends Animal {
  override speak(): string {
    return `${this.name} говорит: Гав!`;
  }
}
```

## Реализация интерфейсов

```typescript
interface Serializable {
  serialize(): string;
}

class Config implements Serializable {
  serialize(): string {
    return JSON.stringify(this);
  }
}
```

## Абстрактные классы

```typescript
abstract class Shape {
  abstract area(): number;           // наследник обязан реализовать
  describe(): string {               // обычный метод — наследуется
    return `Площадь: ${this.area()}`;
  }
}
```

## Статические члены

```typescript
class Registry {
  static items: string[] = [];
  static add(item: string) { this.items.push(item); }
  static { /* блок инициализации */ }
}
```

## Геттеры / Сеттеры

```typescript
class Circle {
  constructor(private _radius: number) {}
  get radius(): number { return this._radius; }
  set radius(value: number) {
    if (value < 0) throw new Error("Отрицательный радиус");
    this._radius = value;
  }
}
```

## this-тип (fluent API)

```typescript
class Builder {
  setName(name: string): this { /* ... */ return this; }
  setAge(age: number): this { /* ... */ return this; }
}
// Наследники сохраняют правильный тип возврата
```

## this-based type guard

```typescript
class Entry {
  isFile(): this is FileEntry {
    return this instanceof FileEntry;
  }
}
```

## Миксин (паттерн)

```typescript
type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<T extends Constructor>(Base: T) {
  return class extends Base {
    createdAt = new Date();
  };
}

const TimestampedUser = Timestamped(User);
```

## Частые ошибки

```typescript
// 1. Потеря this
class Btn {
  label = "OK";
  onClick() { console.log(this.label); }    // this может потеряться
  onClickSafe = () => { console.log(this.label); }; // this привязан
}

// 2. implements не задаёт типы
class A implements HasName {
  name: string;  // нужно объявить явно!
  constructor(name: string) { this.name = name; }
}

// 3. private — только компиляция
(instance as any).privateField; // доступно в рантайме!
```
