import { Callout, DeepDive } from '@book/ui'

# Работа с union-типами

Union-типы (`A | B | C`) — один из краеугольных камней системы типов TypeScript. Утилитарные типы этой группы позволяют **фильтровать**, **извлекать** и **очищать** union-типы.

## Exclude&lt;UnionType, ExcludedMembers&gt;

Удаляет из union-типа все члены, которые **совместимы** с `ExcludedMembers`.

```typescript
type Status = 'active' | 'inactive' | 'banned' | 'deleted'

// Убираем 'deleted' — в UI его не показываем
type VisibleStatus = Exclude<Status, 'deleted'>
// 'active' | 'inactive' | 'banned'

// Можно исключить несколько
type GoodStatus = Exclude<Status, 'banned' | 'deleted'>
// 'active' | 'inactive'

// Работает с любыми типами, не только с литералами
type Primitives = string | number | boolean | null | undefined
type Defined = Exclude<Primitives, null | undefined>
// string | number | boolean
```

<DeepDive title="Как устроен Exclude изнутри">

```typescript
type Exclude<T, U> = T extends U ? never : T
```

Это **дистрибутивный условный тип**: он применяется к каждому члену union отдельно. Для `Exclude<'a' | 'b' | 'c', 'a'>`:
- `'a' extends 'a'` → `never`
- `'b' extends 'a'` → `'b'`
- `'c' extends 'a'` → `'c'`
- Результат: `'b' | 'c'`

</DeepDive>

## Extract&lt;Type, Union&gt;

Противоположность `Exclude` — **извлекает** из union только те члены, которые совместимы с `Union`.

```typescript
type AllEvents =
  | { type: 'click'; x: number; y: number }
  | { type: 'keydown'; key: string }
  | { type: 'scroll'; offset: number }
  | { type: 'resize'; width: number; height: number }

// Извлекаем только события с координатами (x, y)
type PointEvent = Extract<AllEvents, { x: number }>
// { type: 'click'; x: number; y: number }

// Извлекаем из union только строковые литералы
type Mixed = 'hello' | 42 | true | 'world'
type OnlyStrings = Extract<Mixed, string>
// 'hello' | 'world'
```

```typescript
// Практический пример: фильтрация событий по типу
type MouseEvents = Extract<AllEvents, { type: 'click' | 'scroll' }>
// { type: 'click'; x: number; y: number } | { type: 'scroll'; offset: number }

function handleMouseEvent(event: MouseEvents) {
  if (event.type === 'click') {
    console.log(`Клик в (${event.x}, ${event.y})`)
  } else {
    console.log(`Скролл: ${event.offset}px`)
  }
}
```

<DeepDive title="Как устроен Extract изнутри">

```typescript
type Extract<T, U> = T extends U ? T : never
```

Зеркальная копия `Exclude`: оставляет совпадающие, а не удаляет их.

</DeepDive>

## NonNullable&lt;T&gt;

Удаляет `null` и `undefined` из union-типа. Это специализированная версия `Exclude<T, null | undefined>`.

```typescript
type MaybeString = string | null | undefined

type DefinitelyString = NonNullable<MaybeString>
// string

// Типичный сценарий: обработка результатов DOM-запросов
function getElement(id: string): HTMLElement {
  const el = document.getElementById(id)
  // el имеет тип HTMLElement | null

  if (!el) {
    throw new Error(`Элемент #${id} не найден`)
  }

  // После проверки TypeScript сужает тип до HTMLElement
  return el
}

// Или через NonNullable в типах
type Config = {
  apiUrl: string | null
  timeout: number | undefined
}

type RequiredConfig = {
  [K in keyof Config]: NonNullable<Config[K]>
}
// { apiUrl: string; timeout: number }
```

<DeepDive title="Как устроен NonNullable изнутри">

```typescript
// Начиная с TypeScript 4.8 — встроенная интринсика
// Концептуально эквивалентно:
type NonNullable<T> = T & {}
// или
type NonNullable<T> = Exclude<T, null | undefined>
```

Пересечение с `{}` (пустой объектный тип) убирает `null` и `undefined`, потому что они несовместимы с `{}`.

</DeepDive>

## NoInfer&lt;T&gt;

Появился в **TypeScript 5.4**. Запрещает TypeScript использовать аргумент для **вывода параметра типа**. Позиция, обёрнутая в `NoInfer`, не участвует в автоматическом выводе — тип должен быть выведен из других аргументов.

```typescript
// Без NoInfer: TypeScript выводит T из обоих аргументов
function createFSM<T extends string>(
  initial: T,
  states: T[]
) {}

// TypeScript объединяет оба аргумента для вывода T
// T = 'idle' | 'loading' | 'TYPO' — опечатка не обнаружена!
createFSM('idle', ['idle', 'loading', 'TYPO'])
```

```typescript
// С NoInfer: T выводится только из states
function createFSM<T extends string>(
  initial: NoInfer<T>,
  states: T[]
) {}

// T = 'idle' | 'loading' | 'done' (выведено из states)
// initial проверяется на совместимость с T
createFSM('idle', ['idle', 'loading', 'done'])    // OK
createFSM('TYPO', ['idle', 'loading', 'done'])    // Ошибка!
```

```typescript
// Ещё пример: значение по умолчанию в дженерике
function getOrDefault<T>(
  value: T | undefined,
  defaultValue: NoInfer<T>
): T {
  return value ?? defaultValue
}

// T = number (выведено из первого аргумента)
getOrDefault(42, 0)           // OK
getOrDefault(42, 'fallback')  // Ошибка: string не совместим с number
```

<Callout type="info">
`NoInfer` — это интринсик компилятора, а не тип, реализованный через дженерики. Он влияет только на алгоритм вывода типов и не изменяет результирующий тип.
</Callout>

## Практические паттерны

```typescript
// Паттерн: безопасный диспетчер событий
type EventMap = {
  click: { x: number; y: number }
  keydown: { key: string; code: string }
  scroll: { offset: number }
}

type EventName = keyof EventMap

// Exclude помогает создавать более узкие типы
type NonScrollEvents = Exclude<EventName, 'scroll'>
// 'click' | 'keydown'

// Extract помогает фильтровать union дискриминированных объединений
type StringEvents = Extract<EventName, `key${string}`>
// 'keydown'

// NonNullable — обязательный инструмент при работе с optional chaining
function getNestedValue(obj: { a?: { b?: string } }): string {
  const value: string | undefined = obj.a?.b
  // Приведение к NonNullable — если нужно гарантировать наличие
  if (value == null) throw new Error('Значение отсутствует')
  const result: NonNullable<typeof value> = value
  return result
}
```
