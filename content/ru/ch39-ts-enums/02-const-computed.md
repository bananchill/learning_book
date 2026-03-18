import { DeepDive } from '@book/ui'

# const enums и вычисляемые члены

## Константные и вычисляемые члены

Каждый член enum бывает либо **константным** (constant), либо **вычисляемым** (computed). Это влияет на то, когда значение определяется -- на этапе компиляции или в рантайме.

### Константные члены

Член считается константным, если его значение можно вычислить на этапе компиляции:

```typescript
enum FileAccess {
  // Константные выражения
  None,                   // 0 (первый без инициализатора)
  Read = 1 << 1,          // 2
  Write = 1 << 2,         // 4
  ReadWrite = Read | Write, // 6 (ссылка на другие члены)
  Admin = 8,              // 8 (числовой литерал)
}
```

Правила для константных членов:
- Числовой или строковый литерал
- Ссылка на ранее определённый константный член
- Унарный `+`, `-`, `~` оператор над константным выражением
- Бинарные `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^` над константными выражениями

### Вычисляемые члены

Если инициализатор содержит выражение, которое нельзя вычислить на этапе компиляции, член становится вычисляемым:

```typescript
enum DynamicValues {
  A = "hello".length,      // Вычисляемый: 5 (вызов метода)
  B = Math.random(),        // Вычисляемый: случайное число
  C = Date.now(),           // Вычисляемый: текущее время
}
```

> **Ограничение:** после вычисляемого члена без инициализатора следующий член ОБЯЗАН иметь явное значение:

```typescript
enum Example {
  A = getRandomValue(),
  // Ошибка: Enum member must have initializer
  // B,
  B = 10, // Нужно задать явно
  C,      // 11 (auto-increment от B)
}
```

## Битовые флаги

Один из главных паттернов использования константных членов -- битовые флаги. Они позволяют комбинировать несколько значений в одном числе:

```typescript
enum Permission {
  None    = 0,
  Read    = 1 << 0, // 1
  Write   = 1 << 1, // 2
  Execute = 1 << 2, // 4
  All     = Read | Write | Execute, // 7
}

function hasPermission(userPerms: Permission, check: Permission): boolean {
  return (userPerms & check) === check;
}

const myPerms = Permission.Read | Permission.Write; // 3
console.log(hasPermission(myPerms, Permission.Read));    // true
console.log(hasPermission(myPerms, Permission.Execute)); // false
```

## const enums

Ключевое слово `const` перед `enum` говорит компилятору полностью заинлайнить значения и не генерировать объект в рантайме:

```typescript
const enum HttpMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}

const method = HttpMethod.Get;
// Компилируется в: const method = "GET";
```

### Без const -- генерируется объект:

```typescript
enum HttpMethod {
  Get = "GET",
  Post = "POST",
}

const method = HttpMethod.Get;
// Компилируется в:
// var HttpMethod;
// (function(HttpMethod) { ... })(HttpMethod || (HttpMethod = {}));
// const method = HttpMethod.Get;
```

### С const -- только значение:

```typescript
const enum HttpMethod {
  Get = "GET",
  Post = "POST",
}

const method = HttpMethod.Get;
// Компилируется в:
// const method = "GET";
```

### Ограничения const enum

1. **Нет рантайм-объекта** -- нельзя итерировать по членам, нельзя использовать обратное отображение
2. **Проблемы с `isolatedModules`** -- при `isolatedModules: true` (Vite, esbuild) `const enum` из других модулей не инлайнятся
3. **Проблемы с библиотеками** -- если вы экспортируете `const enum` из npm-пакета, потребители могут получить ошибки

```typescript
const enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
}

// Ошибка: нельзя итерировать по const enum
// Object.values(Status); // Status не существует в рантайме
```

> **Рекомендация TypeScript-команды:** избегайте `const enum` в библиотеках. Используйте обычные enum или `as const` объекты.

## Ambient enums (declare enum)

Ambient enum описывает форму уже существующего enum (например, из внешней библиотеки):

```typescript
declare enum ExternalStatus {
  Active = 1,
  Inactive = 2,
}

// TypeScript верит, что ExternalStatus существует в рантайме
const status: ExternalStatus = ExternalStatus.Active;
```

Ключевое отличие: `declare enum` не генерирует JavaScript-код. Компилятор предполагает, что объект будет доступен в рантайме из другого источника.

Можно комбинировать с `const`:

```typescript
declare const enum ImportedEnum {
  A = 1,
  B = 2,
}

// Значения инлайнятся, рантайм-объект не ожидается
const val = ImportedEnum.A; // Компилируется в: const val = 1;
```

## Итоги

| Вид | Рантайм-объект | Инлайн значений | Когда использовать |
|-----|---------------|-----------------|-------------------|
| `enum` | Да | Нет | Общий случай, нужен объект |
| `const enum` | Нет | Да | Максимальная оптимизация, без итерации |
| `declare enum` | Нет (внешний) | Нет | Описание внешнего enum |
| `declare const enum` | Нет | Да | Описание внешнего const enum |

<DeepDive>

### isolatedModules и const enum

Когда включён `isolatedModules` (а это рекомендуемая настройка для Vite, esbuild, SWC), компилятор обрабатывает каждый файл изолированно. Это значит, что при импорте `const enum` из другого файла компилятор не может заглянуть в исходный файл, чтобы узнать значения.

Решение -- флаг `preserveConstEnums` в `tsconfig.json`:

```json
{
  "compilerOptions": {
    "isolatedModules": true,
    "preserveConstEnums": true
  }
}
```

С `preserveConstEnums` const enum генерирует рантайм-объект (как обычный enum), но обращения к членам всё равно инлайнятся в текущем файле.

</DeepDive>
