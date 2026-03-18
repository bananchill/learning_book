---
title: "Mixins и this-типы"
description: "Паттерн миксинов в TypeScript, this-типы для fluent API, parameter properties"
estimatedMinutes: 8
---

# Mixins и this-типы

## Parameter Properties

TypeScript позволяет объявлять и инициализировать поля прямо в параметрах конструктора с помощью модификаторов доступа:

```typescript
// Без parameter properties — многословно
class UserVerbose {
  public name: string;
  private age: number;
  readonly id: string;

  constructor(name: string, age: number, id: string) {
    this.name = name;
    this.age = age;
    this.id = id;
  }
}

// С parameter properties — компактно
class User {
  constructor(
    public name: string,
    private age: number,
    readonly id: string
  ) {}
  // Поля name, age, id создаются и инициализируются автоматически

  getAge(): number {
    return this.age;
  }
}

const user = new User("Анна", 25, "abc-123");
console.log(user.name); // "Анна"
console.log(user.id);   // "abc-123"
```

> **Замечание:** parameter properties — это синтаксический сахар TypeScript. Параметр без модификатора (`public`, `protected`, `private`, `readonly`) остаётся обычным параметром и не создаёт поле.

## this-типы

В TypeScript `this` может использоваться как тип. Он ссылается на тип текущего экземпляра, что особенно полезно при наследовании.

### Fluent API с this-типом

```typescript
class QueryBuilder {
  private conditions: string[] = [];
  private ordering: string | null = null;

  where(condition: string): this {
    this.conditions.push(condition);
    return this;
  }

  orderBy(field: string): this {
    this.ordering = field;
    return this;
  }

  build(): string {
    let query = "SELECT * FROM table";
    if (this.conditions.length > 0) {
      query += " WHERE " + this.conditions.join(" AND ");
    }
    if (this.ordering) {
      query += " ORDER BY " + this.ordering;
    }
    return query;
  }
}

// Наследник автоматически получает корректный тип возврата
class PaginatedQueryBuilder extends QueryBuilder {
  private limitValue: number | null = null;

  limit(n: number): this {
    this.limitValue = n;
    return this;
  }

  override build(): string {
    let query = super.build();
    if (this.limitValue) {
      query += ` LIMIT ${this.limitValue}`;
    }
    return query;
  }
}

// Цепочка работает корректно — все методы возвращают PaginatedQueryBuilder
const query = new PaginatedQueryBuilder()
  .where("active = true")    // возвращает PaginatedQueryBuilder
  .orderBy("created_at")     // возвращает PaginatedQueryBuilder
  .limit(10)                 // возвращает PaginatedQueryBuilder
  .build();
```

### this-based type guards

Метод может быть type guard на основе `this`:

```typescript
class FileSystemEntry {
  isFile(): this is FileEntry {
    return this instanceof FileEntry;
  }

  isDirectory(): this is DirectoryEntry {
    return this instanceof DirectoryEntry;
  }
}

class FileEntry extends FileSystemEntry {
  content = "";

  read(): string {
    return this.content;
  }
}

class DirectoryEntry extends FileSystemEntry {
  children: FileSystemEntry[] = [];

  list(): string[] {
    return this.children.map((c) => c.constructor.name);
  }
}

function process(entry: FileSystemEntry) {
  if (entry.isFile()) {
    // TypeScript знает, что entry — это FileEntry
    console.log(entry.read());
  } else if (entry.isDirectory()) {
    // TypeScript знает, что entry — это DirectoryEntry
    console.log(entry.list());
  }
}
```

## Паттерн миксинов

JavaScript не поддерживает множественное наследование, но миксины позволяют «примешивать» поведение из нескольких источников.

### Базовый паттерн

Миксин — это функция, принимающая базовый класс и возвращающая новый класс с дополнительным поведением.

В основе паттерна лежит тип `Constructor<T>` — он описывает любой класс (конструктор), создающий экземпляр типа `T`. Миксин-функция принимает `Constructor` как аргумент и возвращает новый класс, расширяющий базовый. Это позволяет «наслаивать» поведение, оборачивая класс в несколько миксинов:

```typescript
// Тип конструктора — основа для миксинов
type Constructor<T = {}> = new (...args: any[]) => T;

// Миксин: добавляет timestamp
function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
    updatedAt = new Date();

    touch() {
      this.updatedAt = new Date();
    }
  };
}

// Миксин: добавляет тегирование
function Tagged<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    tags: string[] = [];

    addTag(tag: string) {
      this.tags.push(tag);
    }

    hasTag(tag: string): boolean {
      return this.tags.includes(tag);
    }
  };
}

// Базовый класс
class Document {
  constructor(public title: string) {}
}

// Композиция миксинов
const TaggedTimestampedDocument = Tagged(Timestamped(Document));

const doc = new TaggedTimestampedDocument("Отчёт");
doc.addTag("важный");
doc.touch();
console.log(doc.title);     // "Отчёт"
console.log(doc.tags);      // ["важный"]
console.log(doc.createdAt); // Date
```

### Ограниченные миксины

Миксин может требовать определённый интерфейс от базового класса:

```typescript
interface HasId {
  id: string;
}

// Миксин требует, чтобы базовый класс имел свойство id
function Activatable<TBase extends Constructor<HasId>>(Base: TBase) {
  return class extends Base {
    isActive = false;

    activate() {
      console.log(`Активация ${this.id}`);
      this.isActive = true;
    }

    deactivate() {
      console.log(`Деактивация ${this.id}`);
      this.isActive = false;
    }
  };
}

class Entity {
  constructor(public id: string) {}
}

const ActivatableEntity = Activatable(Entity);

const entity = new ActivatableEntity("entity-1");
entity.activate(); // "Активация entity-1"
```

### Миксины с интерфейсами (Declaration Merging)

Для полной типизации миксинов без потери автодополнения используется объединение интерфейса и класса:

```typescript
// Определяем интерфейс с теми же членами, что добавляет миксин
interface Disposable {
  isDisposed: boolean;
  dispose(): void;
}

// Реализация миксина
function DisposableMixin<TBase extends Constructor>(
  Base: TBase
): TBase & Constructor<Disposable> {
  return class extends Base implements Disposable {
    isDisposed = false;

    dispose() {
      this.isDisposed = true;
      console.log("Ресурс освобождён");
    }
  } as any; // приведение необходимо из-за ограничений TypeScript
}

class Connection {
  constructor(public url: string) {}
}

const DisposableConnection = DisposableMixin(Connection);
const conn = new DisposableConnection("https://api.example.com");
conn.dispose(); // "Ресурс освобождён"
console.log(conn.isDisposed); // true
```

### Альтернативный паттерн миксинов через `implements`

Этот подход использует `implements` для объявления, что класс реализует интерфейс миксина, но фактическая реализация копируется в прототип вручную через вспомогательную функцию `applyMixins`. Класс обязан объявить все поля миксинов (как заглушки), а `applyMixins` заменит их реальными методами из прототипов миксин-классов:

```typescript
// Определяем миксин-классы (без конструктора)
class Jumpable {
  jumpHeight = 0;

  jump(): void {
    console.log(`Прыжок на ${this.jumpHeight}м!`);
  }
}

class Duckable {
  isDucking = false;

  duck(): void {
    this.isDucking = true;
    console.log("Пригнулся!");
  }
}

// Класс «реализует» миксины
class Character implements Jumpable, Duckable {
  // Необходимо объявить все члены миксинов
  jumpHeight = 3;
  isDucking = false;
  jump!: () => void;
  duck!: () => void;

  constructor(public name: string) {}
}

// Копируем реализации из миксинов в прототип
function applyMixins(target: any, mixins: any[]) {
  mixins.forEach((mixin) => {
    Object.getOwnPropertyNames(mixin.prototype).forEach((name) => {
      if (name !== "constructor") {
        Object.defineProperty(
          target.prototype,
          name,
          Object.getOwnPropertyDescriptor(mixin.prototype, name)!
        );
      }
    });
  });
}

applyMixins(Character, [Jumpable, Duckable]);

const hero = new Character("Герой");
hero.jump(); // "Прыжок на 3м!"
hero.duck(); // "Пригнулся!"
```

> **Предпочтение:** первый паттерн (функции-миксины) лучше типизирован и не требует `applyMixins`. Второй паттерн проще в понимании, но хуже поддерживается TypeScript.

<DeepDive title="Ограничения миксинов в TypeScript">

У паттерна миксинов есть несколько известных ограничений:

1. **Декораторы и миксины** — декораторы не могут использовать declaration merging, поэтому декораторы-миксины теряют типизацию.

2. **Статические свойства** — миксины не наследуют статические свойства базового класса автоматически, нужно копировать вручную.

3. **Конструкторы** — если базовый класс и миксин оба имеют сложные конструкторы, композиция может быть затруднена.

4. **`instanceof`** — экземпляр миксина не проходит проверку `instanceof` для класса-миксина в альтернативном паттерне (через `implements`).

Для сложных случаев рассмотрите композицию объектов вместо миксинов: вместо «является» (is-a) используйте «содержит» (has-a).

</DeepDive>
