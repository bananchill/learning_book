---
title: "Расширение и пересечение типов"
parent: "ch34-ts-object-types"
order: 2
---

## Зачем комбинировать типы

В реальных приложениях типы часто строятся друг на друге. Базовый адрес расширяется до почтового адреса, базовый пользователь — до администратора. TypeScript предлагает два механизма для этого: `extends` (для интерфейсов) и `&` (пересечение типов).

## Расширение интерфейсов (extends)

Ключевое слово `extends` позволяет интерфейсу наследовать свойства другого интерфейса:

```ts
interface BasicAddress {
  name?: string;
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

interface AddressWithUnit extends BasicAddress {
  unit: string;
}

const office: AddressWithUnit = {
  street: "Тверская",
  city: "Москва",
  country: "Россия",
  postalCode: "125009",
  unit: "Офис 42",
};
```

`AddressWithUnit` имеет все свойства `BasicAddress` плюс собственное `unit`.

### Множественное наследование

Интерфейс может расширять сразу несколько интерфейсов:

```ts
interface Colorful {
  color: string;
}

interface Circle {
  radius: number;
}

interface ColorfulCircle extends Colorful, Circle {}

const cc: ColorfulCircle = {
  color: "красный",
  radius: 42,
};
```

`ColorfulCircle` объединяет свойства обоих интерфейсов.

## Пересечение типов (Intersection Types)

TypeScript предлагает ещё один способ комбинировать типы — оператор `&`:

```ts
type Colorful = {
  color: string;
};

type Circle = {
  radius: number;
};

type ColorfulCircle = Colorful & Circle;

const cc: ColorfulCircle = {
  color: "синий",
  radius: 10,
};
```

Пересечение `Colorful & Circle` создаёт тип, который содержит **все** свойства обоих типов.

### Пересечение в параметрах функции

Часто пересечение используется прямо в аннотации параметра, без промежуточного типа:

```ts
function draw(circle: Colorful & Circle) {
  console.log(`Цвет: ${circle.color}`);
  console.log(`Радиус: ${circle.radius}`);
}

draw({ color: "зелёный", radius: 42 });
```

## extends vs & — в чём разница

На первый взгляд `extends` и `&` делают одно и то же. Но есть важные отличия.

### Конфликт свойств

При `extends` конфликт свойств — это ошибка компиляции:

```ts
interface Base {
  id: number;
}

// Ошибка: Interface 'Extended' incorrectly extends interface 'Base'.
// Types of property 'id' are incompatible.
interface Extended extends Base {
  id: string;
}
```

При `&` конфликт **не вызывает ошибку**, но создаёт тип `never` для конфликтующего свойства:

```ts
type Base = {
  id: number;
};

type Extended = Base & {
  id: string;
};

// Тип id — number & string = never
// Невозможно создать значение типа Extended
```

Это значит: `extends` ловит ошибки при объявлении, `&` — при использовании.

### Объединение интерфейсов (Declaration Merging)

Интерфейсы с одинаковым именем автоматически объединяются:

```ts
interface Window {
  title: string;
}

interface Window {
  ts: import("typescript");
}

// Window теперь имеет и title, и ts
const win: Window = {
  title: "Мой редактор",
  ts: /* ... */,
};
```

Псевдонимы типов (`type`) **не** поддерживают слияние — повторное объявление вызовет ошибку:

```ts
type Window = { title: string };
// Ошибка: Duplicate identifier 'Window'.
type Window = { ts: import("typescript") };
```

### Когда что использовать

| Критерий | `interface extends` | `type &` |
|----------|-------------------|---------|
| Конфликт свойств | Ошибка компиляции | Тихий `never` |
| Declaration merging | Да | Нет |
| Работа с примитивами | Нет | Да (`string & { brand: "id" }`) |
| Читаемость в IDE | Показывает имя интерфейса | Разворачивает структуру |
| Рекомендация | Для публичных API | Для внутренних вычислений |

**Практическое правило:** используй `interface` + `extends` для описания объектов и публичных контрактов. Используй `type` + `&` для вычисления новых типов, работы с объединениями и брендированных типов.

## Пример: комбинирование подходов

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

interface Admin extends User {
  role: "admin";
  permissions: string[];
}

// Пересечение для добавления метаинформации
type WithTimestamps<T> = T & {
  createdAt: Date;
  updatedAt: Date;
};

type AdminWithTimestamps = WithTimestamps<Admin>;

const admin: AdminWithTimestamps = {
  id: 1,
  name: "Анна",
  email: "anna@example.com",
  role: "admin",
  permissions: ["users:read", "users:write"],
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

Здесь `interface extends` строит иерархию сущностей, а `type &` добавляет обобщённую «примесь».

## Итоги

- `extends` наследует свойства одного или нескольких интерфейсов
- `&` пересекает типы, создавая тип с **всеми** свойствами обеих сторон
- Конфликт при `extends` — ошибка; конфликт при `&` — тихий `never`
- Интерфейсы поддерживают declaration merging, `type` — нет
- На практике оба подхода комбинируются
