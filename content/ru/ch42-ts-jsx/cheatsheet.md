import { Callout } from '@book/ui'

# Шпаргалка: JSX и TSX

## Настройка компилятора

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

| Режим | Результат | Когда |
|-------|-----------|-------|
| `preserve` | JSX как есть → `.jsx` | Babel/SWC обрабатывает |
| `react` | `React.createElement()` | React < 17 |
| `react-jsx` | `_jsx()` автоимпорт | React 17+ (рекомендуется) |
| `react-native` | JSX как есть → `.js` | React Native |

## Приведение типов в .tsx

```tsx
// ❌ Запрещено в .tsx — конфликтует с JSX
const el = <HTMLInputElement>document.getElementById('name')

// ✅ Используйте as
const el = document.getElementById('name') as HTMLInputElement
```

## Дженерики в стрелочных функциях (.tsx)

```tsx
// ❌ Конфликт с JSX
const fn = <T>(x: T) => x

// ✅ Trailing comma
const fn = <T,>(x: T) => x

// ✅ extends
const fn = <T extends unknown>(x: T) => x
```

## Intrinsic vs Value-based

```tsx
// Intrinsic — строчная буква, проверяется через JSX.IntrinsicElements
<div className="box" />
<input type="text" value={val} onChange={handler} />

// Value-based — заглавная буква, проверяется как функция/класс
<Button label="OK" onClick={handler} />
<UserCard user={currentUser} />
```

## Расширение IntrinsicElements

```tsx
declare namespace JSX {
  interface IntrinsicElements {
    'my-component': { title: string; size?: number }
  }
}
```

## Типы children

```tsx
// Любой рендерируемый контент
children: React.ReactNode

// Только строка
children: string

// Только один JSX-элемент
children: JSX.Element

// Массив элементов
children: JSX.Element[]

// Render-prop паттерн
children: (data: T) => JSX.Element
```

## Ключевые типы

| Тип | Назначение |
|-----|-----------|
| `JSX.Element` | Результат JSX-выражения |
| `React.ReactNode` | Всё, что можно отрендерить |
| `React.ReactElement` | Конкретный React-элемент |
| `JSX.IntrinsicElements` | Словарь всех HTML/SVG-тегов |

## Spread-атрибуты

```tsx
const props = { value: 'text', onChange: handler }
<Input {...props} placeholder="Имя" />
```

<Callout type="tip">
Для children компонентов используйте `React.ReactNode` — самый гибкий тип. Сужайте только при необходимости.
</Callout>
