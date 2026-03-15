# Паттерны использования и альтернативы

## Enum в рантайме

Обычный enum (не `const`) существует как реальный объект в JavaScript. Это значит, что его можно передавать в функции, итерировать и использовать как значение:

```typescript
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
}

// Enum -- настоящий объект
function printAllLevels(enumObj: typeof LogLevel): void {
  for (const key in enumObj) {
    console.log(`${key}: ${enumObj[key as keyof typeof LogLevel]}`);
  }
}

printAllLevels(LogLevel);
// Debug: DEBUG
// Info: INFO
// Warn: WARN
// Error: ERROR
```

## Enum на этапе компиляции

Оператор `keyof typeof` позволяет получить объединение строковых ключей enum:

```typescript
enum Shape {
  Circle,
  Square,
  Triangle,
}

type ShapeKey = keyof typeof Shape;
// "Circle" | "Square" | "Triangle"

function describeShape(key: ShapeKey): string {
  return `Фигура: ${Shape[key as keyof typeof Shape]}`;
}
```

### Получение типа значений

```typescript
enum HttpStatus {
  Ok = 200,
  NotFound = 404,
  ServerError = 500,
}

// Тип значений enum
type HttpStatusValue = `${HttpStatus}`;
// "200" | "404" | "500" (строковое представление)

// Числовой тип значений
type HttpStatusNum = (typeof HttpStatus)[keyof typeof HttpStatus];
// 200 | 404 | 500
```

## Обратное отображение (Reverse mapping)

Числовые enum автоматически создают обратное отображение -- по значению можно получить имя:

```typescript
enum Priority {
  Low = 0,
  Medium = 1,
  High = 2,
}

const name: string = Priority[1]; // "Medium"
const value: Priority = Priority.Medium; // 1

// Полезно для логирования
function logPriority(p: Priority): void {
  console.log(`Приоритет: ${Priority[p]} (${p})`);
}

logPriority(Priority.High); // Приоритет: High (2)
```

> **Важно:** строковые enum НЕ создают обратное отображение:

```typescript
enum Color {
  Red = "RED",
  Green = "GREEN",
}

// Color["RED"] -- undefined, не "Red"
```

## Objects vs Enums

Вместо enum можно использовать обычный объект с `as const`. Это популярная альтернатива, которую рекомендуют многие стайлгайды (включая команду TypeScript):

```typescript
// Подход с enum
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// Подход с as const
const Direction2 = {
  Up: "UP",
  Down: "DOWN",
  Left: "LEFT",
  Right: "RIGHT",
} as const;

type Direction2 = (typeof Direction2)[keyof typeof Direction2];
// "UP" | "DOWN" | "LEFT" | "RIGHT"
```

### Сравнение

| Критерий | `enum` | `as const` объект |
|----------|--------|------------------|
| Рантайм-значение | Генерируется | Обычный объект |
| Tree-shaking | Плохой (IIFE) | Хороший |
| Совместимость с JS | Только TS | Работает в JS |
| Reverse mapping | Да (числовой) | Нет (нужно вручную) |
| `isolatedModules` | Проблемы с `const enum` | Без проблем |
| Расширяемость | Нет | Через spread |

### Когда enum лучше

```typescript
// Битовые флаги -- enum удобнее
enum FilePermission {
  None    = 0,
  Read    = 1 << 0,
  Write   = 1 << 1,
  Execute = 1 << 2,
}

// Reverse mapping нужен
enum ErrorCode {
  NotFound = 404,
  Forbidden = 403,
}
const errorName = ErrorCode[404]; // "NotFound"
```

### Когда as const лучше

```typescript
// Простые строковые константы
const THEME = {
  Light: "light",
  Dark: "dark",
  System: "system",
} as const;

type Theme = (typeof THEME)[keyof typeof THEME];

// Работает с любым бандлером, tree-shakeable
// Нет проблем с isolatedModules
// Расширяемость:
const EXTENDED_THEME = {
  ...THEME,
  HighContrast: "high-contrast",
} as const;
```

## Паттерн: Discriminated union вместо enum

Для сложных случаев, когда с каждым вариантом связаны данные, лучше подходит дискриминированное объединение:

```typescript
// Вместо enum + switch
enum ShapeType {
  Circle = "circle",
  Rectangle = "rectangle",
}

interface CircleData {
  type: ShapeType.Circle;
  radius: number;
}

interface RectangleData {
  type: ShapeType.Rectangle;
  width: number;
  height: number;
}

type ShapeData = CircleData | RectangleData;

function area(shape: ShapeData): number {
  switch (shape.type) {
    case ShapeType.Circle:
      return Math.PI * shape.radius ** 2;
    case ShapeType.Rectangle:
      return shape.width * shape.height;
  }
}
```

## Рекомендации

1. **Строковые enum** -- для большинства случаев (читаемые логи, надёжная типизация)
2. **Числовые enum** -- для битовых флагов и обратного маппинга
3. **`as const` объекты** -- когда важен tree-shaking или совместимость с JS
4. **Избегайте `const enum`** -- особенно в библиотеках и при `isolatedModules`
5. **Избегайте гетерогенных enum** -- они усложняют код без выгоды

<DeepDive>

### Почему enum плохо tree-shakeable

TypeScript компилирует enum в IIFE (Immediately Invoked Function Expression):

```javascript
var Direction;
(function (Direction) {
  Direction["Up"] = "UP";
  Direction["Down"] = "DOWN";
})(Direction || (Direction = {}));
```

Бандлеры (Webpack, Rollup, esbuild) не могут с уверенностью определить, что IIFE не имеет побочных эффектов. Даже если вы импортируете enum, но используете только один член, весь объект попадёт в бандл.

С `as const` объектом бандлер видит обычное присваивание и может удалить неиспользуемые свойства:

```javascript
// as const компилируется в простое присваивание
const Direction = {
  Up: "UP",
  Down: "DOWN",
};
```

</DeepDive>
