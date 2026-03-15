# Числовые и строковые перечисления

## Числовые перечисления (Numeric enums)

Числовые перечисления -- самый распространённый вид enum в TypeScript. Каждому члену автоматически присваивается числовое значение, начиная с 0:

```typescript
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

const move: Direction = Direction.Up;
console.log(move); // 0
```

### Auto-increment

Если задать значение первому члену, остальные будут увеличиваться на 1:

```typescript
enum StatusCode {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  NotFound = 404,
  InternalError = 500,
}

// Можно задать начальное значение для любого члена
enum Priority {
  Low = 1,
  Medium,  // 2
  High,    // 3
  Critical, // 4
}
```

### Использование в функциях

Enum создаёт как тип, так и значение. Это значит, что его можно использовать и в аннотациях типов, и в рантайме:

```typescript
enum UserRole {
  Admin,
  Editor,
  Viewer,
}

function hasEditAccess(role: UserRole): boolean {
  return role === UserRole.Admin || role === UserRole.Editor;
}

hasEditAccess(UserRole.Admin);  // true
hasEditAccess(UserRole.Viewer); // false
```

> **Важно:** числовые enum допускают присвоение любого числа, даже если его нет среди членов. Это известная особенность TypeScript, которая может приводить к ошибкам.

```typescript
enum Color {
  Red,
  Green,
  Blue,
}

// TypeScript НЕ выдаст ошибку, хотя 42 -- невалидное значение
const color: Color = 42; // Без ошибки!
```

## Строковые перечисления (String enums)

В строковых перечислениях каждый член инициализируется строковым литералом. Автоинкремент здесь не работает -- нужно задать значение каждому члену явно:

```typescript
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
  Warn = "WARN",
  Error = "ERROR",
}

function log(message: string, level: LogLevel): void {
  console.log(`[${level}] ${message}`);
}

log("Сервер запущен", LogLevel.Info); // [INFO] Сервер запущен
```

### Преимущества строковых enum

1. **Читаемость в рантайме** -- в логах и отладке вы видите осмысленные строки, а не числа
2. **Безопасность типов** -- в отличие от числовых enum, нельзя присвоить произвольную строку
3. **Сериализация** -- JSON-значения остаются понятными

```typescript
enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

// Ошибка: Type '"blue"' is not assignable to type 'Theme'
// const t: Theme = "blue";

// Корректное использование
const currentTheme: Theme = Theme.Dark;
console.log(JSON.stringify({ theme: currentTheme }));
// {"theme":"dark"}
```

## Гетерогенные перечисления (Heterogeneous enums)

TypeScript технически позволяет смешивать строковые и числовые значения в одном enum:

```typescript
enum Mixed {
  No = 0,
  Yes = "YES",
}
```

> **На практике:** гетерогенные enum -- антипаттерн. Они затрудняют понимание кода и ломают предсказуемость типов. Если вам кажется, что нужен гетерогенный enum -- скорее всего, стоит пересмотреть дизайн.

## Итоги

| Тип enum | Auto-increment | Значения | Type safety |
|----------|---------------|----------|-------------|
| Числовой | Да | `number` | Слабый (любое число допустимо) |
| Строковый | Нет | `string` литералы | Строгий |
| Гетерогенный | Частично | Смешанные | Слабый |

<DeepDive>

### Как числовые enum компилируются в JavaScript

TypeScript превращает числовой enum в объект с двусторонним маппингом (значение -> имя и имя -> значение):

```typescript
// TypeScript
enum Direction {
  Up,
  Down,
}

// Скомпилированный JavaScript
var Direction;
(function (Direction) {
  Direction[Direction["Up"] = 0] = "Up";
  Direction[Direction["Down"] = 1] = "Down";
})(Direction || (Direction = {}));

// Результат: { 0: "Up", 1: "Down", Up: 0, Down: 1 }
```

Строковые enum компилируются проще -- без обратного маппинга:

```typescript
// TypeScript
enum LogLevel {
  Debug = "DEBUG",
  Info = "INFO",
}

// Скомпилированный JavaScript
var LogLevel;
(function (LogLevel) {
  LogLevel["Debug"] = "DEBUG";
  LogLevel["Info"] = "INFO";
})(LogLevel || (LogLevel = {}));

// Результат: { Debug: "DEBUG", Info: "INFO" }
```

</DeepDive>
