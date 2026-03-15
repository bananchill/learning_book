import { Callout, DeepDive } from '@book/ui'

# Intrinsic и value-based элементы

TypeScript различает два вида JSX-элементов по регистру первой буквы имени тега.

## Intrinsic-элементы (встроенные)

Имена начинаются со **строчной** буквы и соответствуют встроенным HTML/SVG-тегам:

```tsx
// Intrinsic — div, span, input, button и т.д.
const el = <div className="container">Текст</div>
const btn = <button type="submit">Отправить</button>
```

TypeScript проверяет intrinsic-элементы через интерфейс `JSX.IntrinsicElements`. Этот интерфейс описывает все допустимые теги и их атрибуты:

```typescript
// Так это объявлено в @types/react (упрощённо)
declare namespace JSX {
  interface IntrinsicElements {
    div: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
    span: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
    input: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
    button: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
    // ... все остальные HTML-теги
  }
}
```

Если тег отсутствует в `IntrinsicElements`, TypeScript выдаст ошибку:

```tsx
// Ошибка: Property 'mywidget' does not exist on type 'JSX.IntrinsicElements'
const el = <mywidget />  // ❌
```

### Расширение IntrinsicElements

Для веб-компонентов или кастомных тегов можно расширить интерфейс:

```tsx
// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'my-widget': {
      title: string
      size?: 'small' | 'large'
    }
  }
}

// Теперь доступно:
const widget = <my-widget title="Приветствие" size="large" />
```

<Callout type="info">
Библиотека `@types/react` уже объявляет все стандартные HTML- и SVG-элементы в `JSX.IntrinsicElements`. Расширять нужно только для кастомных элементов (Web Components).
</Callout>

## Value-based элементы (компоненты)

Имена начинаются с **заглавной** буквы. TypeScript ищет их как идентификаторы в текущей области видимости:

```tsx
// Value-based — Button, App, UserCard
const el = <Button label="Нажми" />
const page = <App />
```

TypeScript поддерживает два вида value-based элементов: **функциональные компоненты** и **классовые компоненты**.

### Функциональные компоненты (Function Components)

Функция, принимающая props и возвращающая `JSX.Element | null`:

```tsx
// Определение функционального компонента
interface ButtonProps {
  label: string
  onClick?: () => void
  disabled?: boolean
}

function Button({ label, onClick, disabled }: ButtonProps): JSX.Element {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}

// Использование — TypeScript проверит пропсы
<Button label="Сохранить" onClick={() => save()} />  // ✅
<Button />  // ❌ Ошибка: не хватает обязательного prop 'label'
<Button label="OK" color="red" />  // ❌ Ошибка: prop 'color' не существует
```

### Классовые компоненты (Class Components)

Класс с методом `render()`, возвращающим `JSX.Element`:

```tsx
interface CounterProps {
  initial: number
}

interface CounterState {
  count: number
}

class Counter extends React.Component<CounterProps, CounterState> {
  state: CounterState = { count: this.props.initial }

  render(): JSX.Element {
    return (
      <div>
        <span>{this.state.count}</span>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          +1
        </button>
      </div>
    )
  }
}

// TypeScript проверяет пропсы через первый параметр типа
<Counter initial={0} />       // ✅
<Counter initial="строка" />  // ❌ Ошибка: string не назначаем number
```

## Как TypeScript разрешает тип компонента

Когда TypeScript встречает `<Component />`, происходит следующее:

1. **Проверка регистра**: строчная буква -- intrinsic, заглавная -- value-based.
2. **Для intrinsic**: поиск ключа в `JSX.IntrinsicElements`.
3. **Для value-based**: TypeScript ищет идентификатор `Component` в области видимости.
4. **Определение вида компонента**:
   - Если это функция -- функциональный компонент, props = первый аргумент.
   - Если это класс с `render()` -- классовый компонент, props = `JSX.ElementAttributesProperty`.

```tsx
// TypeScript определяет тип автоматически
function Greeting({ name }: { name: string }) {
  return <span>Привет, {name}!</span>
}

// TypeScript знает: Greeting принимает { name: string }
<Greeting name="Алиса" />  // ✅
```

<DeepDive title="JSX.ElementClass и JSX.ElementAttributesProperty">

TypeScript использует специальные интерфейсы для определения, как извлечь props из классового компонента:

```typescript
declare namespace JSX {
  // Базовый класс для всех классовых компонентов
  interface ElementClass {
    render(): any
  }

  // Указывает, из какого свойства брать тип пропсов
  interface ElementAttributesProperty {
    props: {}  // используется свойство 'props'
  }
}
```

Когда TypeScript видит `<MyClass />`, он:
1. Проверяет, что `MyClass` совместим с `JSX.ElementClass` (имеет `render()`).
2. Смотрит `JSX.ElementAttributesProperty` -- поле `props`.
3. Берёт тип из свойства `props` экземпляра `MyClass`.

В React это уже настроено: `React.Component<P>` имеет свойство `props: P`, а `ElementAttributesProperty` указывает на `props`.

</DeepDive>

<Callout type="tip">
В современном React (16.8+) функциональные компоненты с хуками -- стандарт. Классовые компоненты встречаются в legacy-коде и полезны для Error Boundaries.
</Callout>

## Итоги

- **Intrinsic** (`<div>`, `<span>`) -- проверяются через `JSX.IntrinsicElements`.
- **Value-based** (`<Button>`, `<App>`) -- проверяются как функции или классы.
- Регистр первой буквы тега определяет тип разрешения.
- Расширяйте `JSX.IntrinsicElements` для веб-компонентов.
- TypeScript автоматически определяет, какие props допустимы, и сигнализирует об ошибках.
