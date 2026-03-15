---
title: "Поля, конструкторы и методы"
description: "Объявление полей класса, readonly-модификатор, конструкторы, методы, геттеры и сеттеры в TypeScript"
estimatedMinutes: 8
---

# Поля, конструкторы и методы

## Объявление полей

В TypeScript каждое поле класса должно быть явно объявлено с указанием типа. Это фундаментальное отличие от JavaScript, где поля могут появляться динамически.

```typescript
class Point {
  // Явное объявление полей с типами
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
```

### Инициализация полей

Поля можно инициализировать прямо при объявлении. В этом случае TypeScript выведет тип автоматически:

```typescript
class Config {
  // Тип выводится как number
  timeout = 5000;

  // Тип выводится как string
  baseUrl = "https://api.example.com";

  // Явная аннотация, когда вывод недостаточен
  headers: Record<string, string> = {};
}
```

### Строгая инициализация: `strictPropertyInitialization`

При включённом `strictPropertyInitialization` (часть `strict`) TypeScript требует, чтобы каждое поле было инициализировано в конструкторе или при объявлении:

```typescript
class User {
  name: string;     // OK — инициализируем в конструкторе
  email: string;    // Ошибка! Не инициализировано
  // Property 'email' has no initializer and is not definitely assigned in the constructor.

  constructor(name: string) {
    this.name = name;
  }
}
```

Если вы уверены, что поле будет инициализировано извне (например, ORM или фреймворком), используйте оператор definite assignment assertion `!`:

```typescript
class Entity {
  // Говорим TypeScript: «Я гарантирую, что поле будет установлено»
  id!: number;
}
```

> **Внимание:** `!` отключает проверку только для этого поля. Злоупотребление оператором сводит на нет пользу строгого режима.

## Модификатор `readonly`

Поля с `readonly` можно присвоить только в конструкторе. После создания объекта они неизменяемы:

```typescript
class Circle {
  readonly radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  // Ошибка! Нельзя изменить readonly-поле
  scale(factor: number) {
    // this.radius *= factor;
    // Cannot assign to 'radius' because it is a read-only property.

    // Вместо этого — создаём новый объект
    return new Circle(this.radius * factor);
  }
}
```

`readonly` — это проверка на этапе компиляции. В рантайме JavaScript поле остаётся обычным свойством. Если нужна настоящая неизменяемость — используйте `Object.freeze()` или `#private` поля.

## Конструкторы

Конструкторы в TypeScript похожи на обычные функции с аннотациями типов, но у них есть особенности:

```typescript
class Database {
  private connection: string;
  private port: number;

  // Конструктор может иметь перегрузки
  constructor(connectionString: string);
  constructor(host: string, port: number);
  constructor(hostOrConnection: string, port?: number) {
    if (port !== undefined) {
      this.connection = hostOrConnection;
      this.port = port;
    } else {
      this.connection = hostOrConnection;
      this.port = 5432; // порт по умолчанию
    }
  }
}

const db1 = new Database("postgres://localhost/mydb");
const db2 = new Database("localhost", 3306);
```

> Конструкторы не могут иметь аннотацию возвращаемого типа — они всегда возвращают экземпляр класса.

## Методы

Методы типизируются так же, как функции:

```typescript
class Calculator {
  private result = 0;

  add(value: number): this {
    this.result += value;
    return this; // возвращаем this для цепочки вызовов
  }

  subtract(value: number): this {
    this.result -= value;
    return this;
  }

  getResult(): number {
    return this.result;
  }
}

const result = new Calculator()
  .add(10)
  .subtract(3)
  .getResult(); // 7
```

### Проблема потери `this`

Классическая ловушка: при передаче метода как колбэка теряется контекст `this`:

```typescript
class Button {
  label = "Click me";

  // Обычный метод — this может потеряться
  handleClick() {
    console.log(this.label); // undefined при потере контекста!
  }

  // Стрелочная функция — this всегда привязан к экземпляру
  handleClickSafe = () => {
    console.log(this.label); // всегда "Click me"
  };
}

const btn = new Button();
const handler = btn.handleClick;
handler(); // undefined — this потерян

const safeHandler = btn.handleClickSafe;
safeHandler(); // "Click me" — this сохранён
```

> **Компромисс:** стрелочные методы создают новую функцию для каждого экземпляра (больше памяти), но гарантируют корректный `this`. Обычные методы живут в прототипе (одна копия), но требуют `.bind()` при передаче.

## Геттеры и сеттеры

TypeScript поддерживает аксессоры `get` и `set` с полной типизацией:

```typescript
class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  // Геттер — вычисляемое свойство
  get fahrenheit(): number {
    return this._celsius * 9 / 5 + 32;
  }

  // Сеттер — валидация при установке
  set fahrenheit(value: number) {
    this._celsius = (value - 32) * 5 / 9;
  }

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Температура ниже абсолютного нуля невозможна");
    }
    this._celsius = value;
  }
}

const temp = new Temperature(100);
console.log(temp.fahrenheit); // 212
temp.fahrenheit = 32;
console.log(temp.celsius); // 0
```

### Правила аксессоров в TypeScript

1. Если есть `get` без `set` — свойство автоматически `readonly`
2. Если тип сеттера не указан — он выводится из типа геттера
3. Геттер и сеттер должны иметь одинаковую видимость (`public`, `protected`, `private`)

```typescript
class Person {
  private _name: string;

  constructor(name: string) {
    this._name = name;
  }

  // Только геттер — свойство readonly снаружи
  get name(): string {
    return this._name;
  }

  // С TypeScript 4.3+ сеттер может принимать более широкий тип
  get id(): string {
    return this._id;
  }

  private _id = "";

  set id(value: string | number) {
    this._id = String(value);
  }
}
```

<DeepDive title="Поля класса vs свойства прототипа">

В JavaScript (и TypeScript) объявления полей класса создают собственные свойства экземпляра, а не свойства прототипа. Это принципиальное отличие от методов:

```typescript
class Example {
  field = 42;          // Собственное свойство каждого экземпляра
  method() {}          // Свойство прототипа (одна копия на все экземпляры)
  arrow = () => {};    // Собственное свойство (новая функция для каждого экземпляра)
}

const a = new Example();
const b = new Example();

a.method === b.method;  // true — один и тот же объект-функция
a.arrow === b.arrow;    // false — разные функции
```

Это влияет на потребление памяти: при создании тысяч экземпляров стрелочные методы и поля-функции занимают значительно больше памяти, чем обычные методы.

</DeepDive>
