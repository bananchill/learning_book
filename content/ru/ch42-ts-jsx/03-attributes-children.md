import { Callout, DeepDive } from '@book/ui'

# Типизация атрибутов и children

## Проверка атрибутов intrinsic-элементов

Каждый HTML-тег в `JSX.IntrinsicElements` определяет набор допустимых атрибутов:

```tsx
// TypeScript знает все атрибуты <input>
<input
  type="text"          // ✅ допустимый атрибут
  value="hello"        // ✅
  onChange={handler}    // ✅
  placeholder="Имя"    // ✅
  colr="red"           // ❌ Ошибка: нет атрибута 'colr'. Вы имели в виду 'color'?
/>
```

TypeScript не только проверяет наличие атрибута, но и его тип:

```tsx
// Проверка типов атрибутов
<input
  type="text"           // ✅ string
  maxLength={100}       // ✅ number
  maxLength="сто"       // ❌ Ошибка: string не назначаем number
  disabled={true}       // ✅ boolean
  disabled="yes"        // ❌ Ошибка: string не назначаем boolean
/>
```

## Проверка атрибутов (props) компонентов

Для value-based элементов TypeScript использует тип первого аргумента функции (или `props` класса):

```tsx
interface CardProps {
  title: string
  description?: string     // опциональный
  variant: 'primary' | 'secondary'
  onClose: () => void
}

function Card({ title, description, variant, onClose }: CardProps) {
  return (
    <div className={`card card--${variant}`}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <button onClick={onClose}>Закрыть</button>
    </div>
  )
}

// TypeScript проверяет каждый prop
<Card
  title="Заголовок"           // ✅ string
  variant="primary"           // ✅ 'primary' | 'secondary'
  onClose={() => {}}          // ✅ () => void
/>

<Card
  title="Заголовок"
  variant="danger"            // ❌ '"danger"' не назначаем '"primary" | "secondary"'
  onClose={() => {}}
/>

<Card title="Заголовок" />    // ❌ Не хватает 'variant' и 'onClose'
```

## Spread-атрибуты

Spread позволяет передать объект как набор пропсов:

```tsx
interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function TextInput({ value, onChange, placeholder }: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

// Spread — передаём все пропсы из объекта
const inputProps: InputProps = {
  value: 'текст',
  onChange: (v) => console.log(v),
  placeholder: 'Введите значение',
}

<TextInput {...inputProps} />  // ✅ TypeScript проверит все поля
```

### Spread с дополнительными пропсами

```tsx
const baseProps = { value: 'hello', onChange: handler }

// Spread + дополнительные пропсы
<TextInput {...baseProps} placeholder="Имя" />  // ✅

// Spread перезапись — последний выигрывает
<TextInput {...baseProps} value="другое" />  // ✅ value будет "другое"
```

<Callout type="warning">
При spread TypeScript проверяет, что все обязательные пропсы присутствуют в объекте или переданы отдельно. Лишние свойства в spread-объекте не вызывают ошибку (в отличие от прямой передачи).
</Callout>

## Типизация children

`children` -- специальный prop, определяющий содержимое элемента. В React его тип задаётся через `React.ReactNode`:

```tsx
interface ContainerProps {
  children: React.ReactNode  // любой допустимый JSX-контент
  className?: string
}

function Container({ children, className }: ContainerProps) {
  return <div className={className}>{children}</div>
}

// Различные виды children
<Container>Текст</Container>                          // ✅ строка
<Container>{42}</Container>                            // ✅ число
<Container><span>Элемент</span></Container>            // ✅ JSX-элемент
<Container>{null}</Container>                          // ✅ null (ничего не рендерит)
<Container>{[<li key="1">A</li>, <li key="2">B</li>]}</Container>  // ✅ массив
```

### Ограничение типа children

Можно сузить тип `children`, чтобы компонент принимал только определённый контент:

```tsx
// Только строку
interface LabelProps {
  children: string
}

function Label({ children }: LabelProps) {
  return <span className="label">{children}</span>
}

<Label>Текст</Label>             // ✅
<Label><b>Жирный</b></Label>    // ❌ Ошибка: JSX-элемент не назначаем string

// Только один JSX-элемент
interface WrapperProps {
  children: JSX.Element
}

function Wrapper({ children }: WrapperProps) {
  return <div className="wrapper">{children}</div>
}

<Wrapper><span>OK</span></Wrapper>  // ✅ один элемент
<Wrapper>Текст</Wrapper>           // ❌ string не назначаем JSX.Element
```

### Компонент без children

```tsx
// Не включайте children в интерфейс — TypeScript запретит их передачу
interface IconProps {
  name: string
  size?: number
}

function Icon({ name, size = 24 }: IconProps) {
  return <svg width={size} height={size}><use href={`#${name}`} /></svg>
}

<Icon name="star" />                     // ✅
<Icon name="star">Текст</Icon>          // ❌ Ошибка: children не в IconProps
```

<DeepDive title="JSX.Element, ReactNode и ReactElement — в чём разница">

В экосистеме React существует несколько связанных типов:

```typescript
// JSX.Element — результат JSX-выражения
// По сути это React.ReactElement с generic defaults
type JSXElement = JSX.Element  // React.ReactElement<any, any>

// React.ReactElement — конкретный JSX-элемент
interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string> {
  type: T
  props: P
  key: string | null
}

// React.ReactNode — всё, что можно отрендерить
type ReactNode =
  | ReactElement
  | string
  | number
  | boolean
  | null
  | undefined
  | Iterable<ReactNode>
```

Краткое правило:
- **`JSX.Element`** — возвращаемый тип компонента.
- **`React.ReactNode`** — тип для `children` (принимает всё: строки, числа, null, элементы).
- **`React.ReactElement`** — конкретный элемент (без строк, чисел и null).

</DeepDive>

## JSX.Element — результирующий тип

Каждое JSX-выражение в TypeScript имеет тип `JSX.Element`:

```tsx
// Тип el — JSX.Element
const el = <div>Привет</div>

// Функциональный компонент возвращает JSX.Element | null
function Greeting({ name }: { name: string }): JSX.Element {
  return <h1>Привет, {name}!</h1>
}

// JSX.Element определяется в пространстве имён JSX
declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
}
```

Библиотека типов (например `@types/react`) определяет `JSX.Element`, и TypeScript использует его для проверки совместимости:

```tsx
// Можно присвоить JSX-выражение переменной с типом JSX.Element
const header: JSX.Element = <h1>Заголовок</h1>  // ✅

// Нельзя присвоить string
const header: JSX.Element = "Заголовок"  // ❌
```

## Обобщённые (generic) компоненты

JSX поддерживает дженерики для создания типобезопасных переиспользуемых компонентов:

```tsx
// Generic компонент списка
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => JSX.Element
}

function List<T>({ items, renderItem }: ListProps<T>): JSX.Element {
  return <ul>{items.map(renderItem)}</ul>
}

// TypeScript выводит T из переданных данных
<List
  items={['Алиса', 'Боб']}
  renderItem={(name) => <li key={name}>{name}</li>}  // name: string
/>

<List
  items={[1, 2, 3]}
  renderItem={(n) => <li key={n}>{n * 2}</li>}  // n: number
/>
```

<Callout type="tip">
Типизация `children` через `React.ReactNode` -- самый гибкий вариант. Сужайте тип только когда нужно явно ограничить содержимое компонента.
</Callout>

## Итоги

- Атрибуты intrinsic-элементов проверяются через `JSX.IntrinsicElements`.
- Props компонентов проверяются по типу первого аргумента функции.
- Spread-атрибуты `{...obj}` проходят полную проверку типов.
- `children` -- обычный prop; `React.ReactNode` принимает любой рендерируемый контент.
- `JSX.Element` -- результирующий тип любого JSX-выражения.
- Generic-компоненты обеспечивают типобезопасность переиспользуемых UI-паттернов.
