---
title: "abstract-классы и static-члены"
description: "Абстрактные классы, абстрактные методы, статические поля и методы, static блоки инициализации в TypeScript"
estimatedMinutes: 9
---

# abstract-классы и static-члены

## Абстрактные классы

Абстрактный класс — это класс, который нельзя создать напрямую через `new`. Он служит базой для наследников и может содержать как реализованные, так и абстрактные (без реализации) методы.

```typescript
abstract class Shape {
  // Абстрактные члены — наследник ОБЯЗАН реализовать
  abstract area(): number;
  abstract perimeter(): number;

  // Обычные методы — наследуются как есть
  describe(): string {
    return `Площадь: ${this.area()}, периметр: ${this.perimeter()}`;
  }
}

// Ошибка! Нельзя создать экземпляр абстрактного класса
// const shape = new Shape();

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  // Обязательная реализация абстрактных методов
  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

const circle = new Circle(5);
console.log(circle.describe()); // "Площадь: 78.54, периметр: 31.42"
```

### Абстрактные поля

Абстрактными могут быть не только методы, но и поля:

```typescript
abstract class Vehicle {
  abstract readonly type: string;
  abstract maxSpeed: number;

  info(): string {
    return `${this.type} — макс. скорость ${this.maxSpeed} км/ч`;
  }
}

class Car extends Vehicle {
  readonly type = "Автомобиль";
  maxSpeed = 200;
}

class Bicycle extends Vehicle {
  readonly type = "Велосипед";
  maxSpeed = 40;
}
```

### Абстрактные конструкторные сигнатуры

Иногда нужно принять класс как параметр и создать его экземпляр. Для абстрактных классов обычная конструкторная сигнатура не подойдёт:

```typescript
abstract class Filter {
  abstract apply(data: string): string;
}

class UpperCaseFilter extends Filter {
  apply(data: string): string {
    return data.toUpperCase();
  }
}

// Ошибка! Нельзя использовать abstract-класс как конструкторный тип
// function createFilter(ctor: typeof Filter): Filter {
//   return new ctor();
// }

// Правильно — используем abstract construct signature
function createFilter(
  ctor: new () => Filter
): Filter {
  return new ctor();
}

const filter = createFilter(UpperCaseFilter);
console.log(filter.apply("привет")); // "ПРИВЕТ"
```

### Абстрактный класс vs интерфейс

| Характеристика | `abstract class` | `interface` |
|----------------|------------------|-------------|
| Рантайм-код | Да (генерирует JS-класс) | Нет (стирается при компиляции) |
| Реализация методов | Может содержать | Не может |
| Множественное наследование | Нет (только `extends` одного) | Да (`implements` нескольких) |
| Конструктор | Может иметь | Не может |
| Модификаторы доступа | Да | Нет |

> **Правило:** используйте интерфейс, когда нужен только контракт. Используйте абстрактный класс, когда нужно разделить общую реализацию между наследниками.

## Статические члены

Статические поля и методы принадлежат самому классу, а не его экземплярам:

```typescript
class Counter {
  // Статическое поле — общее для всех экземпляров
  static instanceCount = 0;

  // Статический метод
  static getCount(): number {
    return Counter.instanceCount;
  }

  readonly id: number;

  constructor() {
    Counter.instanceCount++;
    this.id = Counter.instanceCount;
  }
}

const a = new Counter(); // id: 1
const b = new Counter(); // id: 2
console.log(Counter.getCount()); // 2
```

### Статические члены и модификаторы доступа

Статические члены поддерживают те же модификаторы видимости:

```typescript
class Config {
  private static instance: Config | null = null;

  // Приватный конструктор — паттерн Singleton
  private constructor(
    public readonly apiUrl: string,
    public readonly timeout: number
  ) {}

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config("https://api.example.com", 5000);
    }
    return Config.instance;
  }
}

// const config = new Config(...); // Ошибка! Конструктор приватный
const config = Config.getInstance();
```

### Статические члены и наследование

Статические члены наследуются:

```typescript
class Base {
  static greeting = "Привет";

  static createGreeting(name: string): string {
    return `${this.greeting}, ${name}!`;
  }
}

class Derived extends Base {
  static greeting = "Здравствуйте";
}

console.log(Base.createGreeting("мир"));     // "Привет, мир!"
console.log(Derived.createGreeting("мир"));  // "Здравствуйте, мир!"
```

### Запрещённые имена статических членов

Нельзя переопределять свойства `Function.prototype`: `name`, `length`, `call`, `apply`, `bind`:

```typescript
class StringUtils {
  // Ошибка! 'name' конфликтует с Function.prototype.name
  // static name = "StringUtils";

  // Используйте другое имя
  static utilName = "StringUtils";
}
```

## Статические блоки инициализации

`static {}` блоки (ES2022+) позволяют выполнять сложную инициализацию статических полей:

```typescript
class Database {
  static connection: string;
  static isReady: boolean;

  // Статический блок — выполняется один раз при загрузке класса
  static {
    try {
      Database.connection = Database.initConnection();
      Database.isReady = true;
    } catch {
      Database.connection = "";
      Database.isReady = false;
    }
  }

  private static initConnection(): string {
    // Сложная логика инициализации
    return "postgres://localhost:5432/mydb";
  }
}
```

Статические блоки имеют полный доступ ко всем членам класса, включая `private`:

```typescript
class Secret {
  private static key: string;

  static {
    // Доступ к private-членам внутри static-блока
    Secret.key = crypto.randomUUID();
  }

  static getKeyHint(): string {
    return Secret.key.slice(0, 4) + "...";
  }
}
```

<DeepDive title="Когда использовать статические члены вместо модульных функций">

В JavaScript/TypeScript модульные функции часто предпочтительнее статических методов:

```typescript
// Вариант 1: Статический метод
class MathUtils {
  static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }
}

// Вариант 2: Модульная функция
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
```

Статические члены оправданы, когда: 1) логика тесно связана с классом (фабричные методы, singleton), 2) нужен доступ к `private` членам класса, 3) нужно наследование статических методов. В остальных случаях модульные функции проще и лучше поддаются tree-shaking.

</DeepDive>
