import { Callout, DeepDive } from '@book/ui'

# Template Literal Types

## Основной синтаксис

Template Literal Types позволяют строить типы из строковых шаблонов:

```typescript
// Базовый пример
type Greeting = `Привет, ${string}!`

const g1: Greeting = 'Привет, мир!'   // OK
const g2: Greeting = 'Привет, Иван!'  // OK
// const g3: Greeting = 'Hello!'      // Ошибка

// Комбинация с union
type Direction = 'left' | 'right' | 'top' | 'bottom'
type CSSProperty = `margin-${Direction}` | `padding-${Direction}`

const prop: CSSProperty = 'margin-left'  // OK
// const bad: CSSProperty = 'border-left' // Ошибка
```

## EventName паттерн

```typescript
// Генерируем типы для on/off методов
type Events = 'click' | 'focus' | 'blur' | 'change'

type EventHandler = `on${Capitalize<Events>}`
// 'onClick' | 'onFocus' | 'onBlur' | 'onChange'

// Типизированные props для React-компонента
type ButtonProps = {
  [K in EventHandler]?: (event: Event) => void
}

// Реверс — извлекаем имя события из on-метода
type ExtractEventName<T extends string> =
  T extends `on${infer Name}` ? Uncapitalize<Name> : never

type ClickEvent = ExtractEventName<'onClick'>  // 'click'
```

<Callout type="info">
TypeScript предоставляет встроенные intrinsic string manipulation types: `Uppercase<S>`, `Lowercase<S>`, `Capitalize<S>`, `Uncapitalize<S>`.
</Callout>

## CSS типы

```typescript
// Строгие типы для CSS свойств
type CSSUnit = 'px' | 'em' | 'rem' | 'vw' | 'vh' | '%'
type CSSValue = `${number}${CSSUnit}` | '0' | 'auto'

const size: CSSValue = '16px'   // OK
const zero: CSSValue = '0'      // OK
const auto: CSSValue = 'auto'   // OK
// const bad: CSSValue = '16'   // Ошибка — нет единицы измерения

// RGB цвет
type HexChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' |
               '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
// Полный тип был бы огромным — используем string с валидацией
type HexColor = `#${string}`
```

## Deepkey паттерн

```typescript
// Типы для доступа к вложенным свойствам
type DeepKeys<T, Prefix extends string = ''> = {
  [K in keyof T & string]:
    T[K] extends object
      ? DeepKeys<T[K], `${Prefix}${K}.`> | `${Prefix}${K}`
      : `${Prefix}${K}`
}[keyof T & string]

interface Config {
  server: {
    host: string
    port: number
  }
  db: {
    url: string
  }
}

type ConfigKeys = DeepKeys<Config>
// 'server' | 'server.host' | 'server.port' | 'db' | 'db.url'
```

<DeepDive title="Парсинг строк на уровне типов">

```typescript
// Разбираем строку формата "key:value"
type ParseEntry<S extends string> =
  S extends `${infer K}:${infer V}`
    ? { key: K; value: V }
    : never

type Entry = ParseEntry<'name:Иван'>
// { key: 'name', value: 'Иван' }

// Разбираем URL
type ParseURL<S extends string> =
  S extends `${infer Protocol}://${infer Rest}`
    ? Rest extends `${infer Host}/${infer Path}`
      ? { protocol: Protocol; host: Host; path: Path }
      : { protocol: Protocol; host: Rest; path: '' }
    : never

type URL = ParseURL<'https://example.com/path'>
// { protocol: 'https', host: 'example.com', path: 'path' }
```

Template Literal Types превращают TypeScript в инструмент для парсинга строк во время компиляции.
</DeepDive>
