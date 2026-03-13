---
title: "Примитивные типы, литералы и специальные типы"
parent: "ch06-ts-type-system"
order: 3
---

## Примитивные типы

TypeScript наследует 7 примитивных типов из JavaScript, каждый — множество допустимых значений:

```ts
const str: string = 'hello'        // Все строки
const num: number = 42             // Все числа (включая NaN, Infinity)
const bool: boolean = true         // true или false
const big: bigint = 100n           // Большие целые числа
const sym: symbol = Symbol('id')   // Уникальные символы
const n: null = null               // Единственное значение: null
const u: undefined = undefined     // Единственное значение: undefined
```

> **Внимание:** Не путайте примитивные типы (`string`, `number`) с объектами-обёртками (`String`, `Number`). Тип `String` (с большой буквы) — это объект-обёртка, его почти никогда не нужно использовать в аннотациях типов.

## Литеральные типы

Литеральный тип — это тип, содержащий **одно конкретное значение**. Это подтип примитивного типа:

```ts
const greeting = 'hello' // Тип: "hello" (литеральный), не string
let message = 'hello'    // Тип: string (расширенный), потому что let позволяет менять

const count = 42         // Тип: 42
let amount = 42          // Тип: number
```

Правило: `const` сохраняет литеральный тип, `let` расширяет (widening) до примитивного.

### Union из литералов

Литеральные типы раскрывают свою мощь в union-ах — это **типобезопасные перечисления**:

```ts
type Direction = 'up' | 'down' | 'left' | 'right'
type HttpStatus = 200 | 301 | 404 | 500

function move(direction: Direction) {
  // direction может быть только одним из четырёх значений
}

move('up')      // ✅
move('diagonal') // ❌ Ошибка компиляции
```

> **Совет:** Предпочитайте union литералов вместо enum для простых перечислений. Union не создаёт рантайм-объект и более идиоматичен для TypeScript.

### as const — сохранение литеральных типов

`as const` запрещает widening и делает все свойства `readonly`:

```ts
// Без as const
const config = { api: '/users', method: 'GET' }
// Тип: { api: string; method: string }

// С as const
const config = { api: '/users', method: 'GET' } as const
// Тип: { readonly api: "/users"; readonly method: "GET" }
```

## Специальные типы: any, unknown, never, void

Эти четыре типа занимают особое место в иерархии.

### unknown — безопасный «что угодно»

`unknown` — top type, множество **всех возможных значений**. Значение типа `unknown` нельзя использовать без предварительной проверки:

```ts
function processInput(input: unknown) {
  // input.toUpperCase() // ❌ Ошибка: Object is of type 'unknown'

  if (typeof input === 'string') {
    input.toUpperCase() // ✅ — TypeScript сузил тип до string
  }
}
```

Используйте `unknown` для данных из внешних источников: API, JSON.parse, пользовательский ввод.

### any — отключение проверки типов

`any` — «типа нет». Значение типа `any` можно использовать как угодно, без проверок:

```ts
function dangerous(input: any) {
  input.toUpperCase()   // ✅ — компилятор молчит
  input.foo.bar.baz()   // ✅ — компилятор молчит
  input()               // ✅ — компилятор молчит
}

dangerous(null) // Runtime: TypeError
```

`any` отключает систему типов. Это «дыра» в типобезопасности — используйте только при миграции с JavaScript.

### Разница any vs unknown

```ts
// any — можно всё
let a: any = 'hello'
a.nonExistentMethod() // ✅ Компилятор молчит — баг в рантайме

// unknown — нужна проверка
let u: unknown = 'hello'
u.nonExistentMethod() // ❌ Ошибка компиляции

if (typeof u === 'string') {
  u.toUpperCase() // ✅ — после проверки
}
```

| | any | unknown |
|---|---|---|
| Присвоить чему угодно | ✅ | ❌ — только any и unknown |
| Использовать без проверки | ✅ | ❌ |
| Безопасность | Нет | Да |
| Когда использовать | Миграция с JS | Внешние данные |

### never — невозможный тип

`never` — bottom type, **пустое множество**. Значение типа `never` не может существовать:

```ts
// Функция, которая никогда не возвращает результат
function throwError(message: string): never {
  throw new Error(message)
}

// Бесконечный цикл
function infinite(): never {
  while (true) {}
}
```

Главное практическое применение — **exhaustive check** (рассмотрим в подглаве про [сужение типов](/frontend/typescript/ch06-ts-type-system/05-type-narrowing)):

```ts
type Shape = 'circle' | 'square'

function area(shape: Shape) {
  switch (shape) {
    case 'circle': return /* ... */
    case 'square': return /* ... */
    default:
      // Если все варианты обработаны, shape здесь имеет тип never
      const _exhaustive: never = shape
      return _exhaustive
  }
}
```

### void — «ничего не возвращает»

`void` означает, что функция не возвращает полезное значение:

```ts
function log(message: string): void {
  console.log(message)
  // Нет return или return без значения
}
```

## Иерархия типов

TypeScript-типы образуют иерархию — от самого широкого (top) к самому узкому (bottom):

```
unknown          ← top type (все значения)
  ├── string
  │     ├── "hello"    ← литеральные типы
  │     └── "world"
  ├── number
  │     ├── 42
  │     └── 3.14
  ├── boolean
  │     ├── true
  │     └── false
  ├── object
  │     ├── { name: string }
  │     └── Function
  ├── null
  └── undefined
never            ← bottom type (нет значений)

any              ← вне иерархии (и top, и bottom одновременно)
```

Правило совместимости: значение подтипа можно присвоить переменной надтипа. Литерал `42` совместим с `number`, `number` совместим с `unknown`.

<details>
<summary>Копай глубже: Почему any нарушает иерархию</summary>

В теории типов top type (`unknown`) — надтип всех типов, а bottom type (`never`) — подтип всех типов. `any` ломает эту иерархию: он одновременно является и подтипом, и надтипом каждого типа. Это сознательное решение для совместимости с нетипизированным JavaScript, но именно поэтому `any` является главным источником unsoundness в TypeScript.

</details>

## Enum: перечисления

TypeScript поддерживает два вида перечислений:

```ts
// Числовой enum — значения автоинкрементируются
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

// Строковый enum — значения указываются явно
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}
```

> **Внимание:** Числовые enum-ы создают обратный маппинг (reverse mapping) и могут вести себя неожиданно. Предпочитайте строковые enum-ы или union литералов: `type Status = 'active' | 'inactive' | 'pending'`.

## Итого

| Тип | Множество | Когда использовать |
|-----|-----------|-------------------|
| `string`, `number`, ... | Все значения примитива | Базовая типизация |
| `'hello'`, `42` | Одно значение | Union-перечисления, as const |
| `unknown` | Все значения (безопасно) | Внешние данные, API |
| `any` | Все значения (небезопасно) | Миграция с JS, крайний случай |
| `never` | Пустое множество | Exhaustive check, невозможные значения |
| `void` | undefined (неявно) | Функции без возвращаемого значения |
