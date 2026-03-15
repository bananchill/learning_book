import { Callout, DeepDive } from '@book/ui'

# Типы функций и классов

Эта группа утилитарных типов позволяет **извлекать** типовую информацию из сигнатур функций и конструкторов. Они построены на `infer` и условных типах.

## Parameters&lt;T&gt;

Извлекает **типы параметров** функции в виде кортежа.

```typescript
function createUser(name: string, age: number, isAdmin: boolean) {
  return { name, age, isAdmin }
}

type CreateUserParams = Parameters<typeof createUser>
// [name: string, age: number, isAdmin: boolean]

// Доступ к отдельному параметру по индексу
type FirstParam = Parameters<typeof createUser>[0]
// string

// Практический сценарий: обёртка над функцией
function withLogging<T extends (...args: any[]) => any>(
  fn: T,
  ...args: Parameters<T>
): ReturnType<T> {
  console.log('Вызов с аргументами:', args)
  return fn(...args)
}

withLogging(createUser, 'Алиса', 30, false)
```

```typescript
// Работает с перегрузками — берёт последнюю сигнатуру
declare function overloaded(x: string): string
declare function overloaded(x: number): number

type OverloadedParams = Parameters<typeof overloaded>
// [x: number] — последняя перегрузка
```

<DeepDive title="Как устроен Parameters изнутри">

```typescript
type Parameters<T extends (...args: any) => any> =
  T extends (...args: infer P) => any ? P : never
```

`infer P` захватывает кортеж параметров функции. Ограничение `T extends (...args: any) => any` гарантирует, что T — функция.

</DeepDive>

## ConstructorParameters&lt;T&gt;

Извлекает **типы параметров конструктора** класса.

```typescript
class HttpClient {
  constructor(
    public baseUrl: string,
    public timeout: number = 5000
  ) {}
}

type ClientParams = ConstructorParameters<typeof HttpClient>
// [baseUrl: string, timeout?: number]

// Фабричная функция на основе класса
function createInstance<T extends abstract new (...args: any) => any>(
  Constructor: T,
  ...args: ConstructorParameters<T>
): InstanceType<T> {
  return new (Constructor as any)(...args)
}

const client = createInstance(HttpClient, 'https://api.example.com', 3000)
// тип: HttpClient
```

```typescript
// Работает с встроенными конструкторами
type DateParams = ConstructorParameters<typeof Date>
type ErrorParams = ConstructorParameters<typeof Error>
type RegExpParams = ConstructorParameters<typeof RegExp>
```

<DeepDive title="Как устроен ConstructorParameters изнутри">

```typescript
type ConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never
```

Аналогичен `Parameters`, но работает с конструкторными сигнатурами (`new (...args) => ...`).

</DeepDive>

## ReturnType&lt;T&gt;

Извлекает **тип возвращаемого значения** функции.

```typescript
function fetchUser(id: number) {
  return {
    id,
    name: 'Алиса',
    roles: ['admin'] as const
  }
}

type UserResult = ReturnType<typeof fetchUser>
// { id: number; name: string; roles: readonly ['admin'] }

// Полезно для типизации на основе существующих функций
type ApiResponse<T extends (...args: any) => any> = {
  data: ReturnType<T>
  status: number
  timestamp: Date
}

type UserResponse = ApiResponse<typeof fetchUser>
```

```typescript
// С асинхронными функциями — возвращает Promise<...>
async function loadData() {
  return { items: [1, 2, 3], total: 3 }
}

type LoadDataReturn = ReturnType<typeof loadData>
// Promise<{ items: number[]; total: number }>

// Для получения «внутреннего» типа используйте Awaited
type LoadDataResult = Awaited<ReturnType<typeof loadData>>
// { items: number[]; total: number }
```

<DeepDive title="Как устроен ReturnType изнутри">

```typescript
type ReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R ? R : any
```

`infer R` захватывает тип, стоящий после `=>` в сигнатуре функции.

</DeepDive>

## InstanceType&lt;T&gt;

Извлекает **тип экземпляра** из конструкторной функции (класса).

```typescript
class Logger {
  private logs: string[] = []

  log(message: string) {
    this.logs.push(`[${new Date().toISOString()}] ${message}`)
  }

  getLogs(): string[] {
    return [...this.logs]
  }
}

type LoggerInstance = InstanceType<typeof Logger>
// Logger

// Зачем это нужно? Когда класс передаётся как аргумент
function createService<T extends new (...args: any[]) => any>(
  ServiceClass: T
): InstanceType<T> {
  return new ServiceClass()
}

const logger = createService(Logger)
// тип: Logger — автоматически выведен через InstanceType
logger.log('Сервис создан')
```

```typescript
// Полезно с абстрактными классами
abstract class BaseRepository<T> {
  abstract findById(id: number): T | null
  abstract save(entity: T): void
}

// InstanceType работает и с абстрактными классами
type Repo = InstanceType<typeof BaseRepository>
// BaseRepository<unknown>
```

<DeepDive title="Как устроен InstanceType изнутри">

```typescript
type InstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any
```

`infer R` захватывает возвращаемый тип конструктора — это и есть тип экземпляра.

</DeepDive>

## ThisParameterType&lt;T&gt;

Извлекает тип параметра `this` из функции. Если `this` не объявлен явно — возвращает `unknown`.

```typescript
// Явный параметр this — первый "фиктивный" параметр
function toJSON(this: { name: string; age: number }): string {
  return JSON.stringify({ name: this.name, age: this.age })
}

type ToJsonThis = ThisParameterType<typeof toJSON>
// { name: string; age: number }

// Если this не объявлен
function regular(x: number): number {
  return x * 2
}

type RegularThis = ThisParameterType<typeof regular>
// unknown
```

<DeepDive title="Как устроен ThisParameterType изнутри">

```typescript
type ThisParameterType<T> =
  T extends (this: infer U, ...args: never) => any ? U : unknown
```

`infer U` извлекает тип из позиции `this` в сигнатуре.

</DeepDive>

## OmitThisParameter&lt;T&gt;

Удаляет параметр `this` из типа функции. Результат — «чистая» сигнатура без контекста.

```typescript
function greet(this: { name: string }, greeting: string): string {
  return `${greeting}, ${this.name}!`
}

type GreetFn = typeof greet
// (this: { name: string }, greeting: string) => string

type CleanGreetFn = OmitThisParameter<typeof greet>
// (greeting: string) => string

// Практический сценарий: привязка контекста
const obj = { name: 'Мир' }
const boundGreet: CleanGreetFn = greet.bind(obj)

boundGreet('Привет') // 'Привет, Мир!'
```

<DeepDive title="Как устроен OmitThisParameter изнутри">

```typescript
type OmitThisParameter<T> =
  unknown extends ThisParameterType<T>
    ? T
    : T extends (...args: infer A) => infer R
      ? (...args: A) => R
      : T
```

Если `this` не объявлен (`unknown`), функция возвращается как есть. Иначе — создаётся новая сигнатура без `this`.

</DeepDive>

## ThisType&lt;T&gt;

Не трансформирует тип, а **устанавливает контекст `this`** для объектных литералов. Работает только с флагом `--noImplicitThis`.

```typescript
// Типичный пример: описание объекта с методами
interface HelperMethods {
  formatName(): string
  formatAge(): string
}

interface Person {
  name: string
  age: number
}

// ThisType говорит TypeScript: внутри этих методов this = Person
const helpers: HelperMethods & ThisType<Person> = {
  formatName() {
    // this.name — OK, TypeScript знает, что this: Person
    return this.name.toUpperCase()
  },
  formatAge() {
    return `${this.age} лет`
  }
}

// Используется в паттерне Vue Options API, Vuex и т.д.
```

```typescript
// Более реалистичный пример: фабрика объектов
function defineComponent<D, M>(options: {
  data: () => D
  methods: M & ThisType<D & M>  // this = data + methods
}) {
  // реализация
}

defineComponent({
  data() {
    return { count: 0, message: 'Привет' }
  },
  methods: {
    increment() {
      // this.count — OK (из data)
      this.count++
      // this.reset() — OK (из methods)
    },
    reset() {
      this.count = 0
      this.message = 'Сброс'
    }
  }
})
```

<Callout type="info">
`ThisType<T>` — это пустой интерфейс-маркер. Компилятор TypeScript обрабатывает его особым образом: он не добавляет никаких свойств, а лишь сообщает, каким будет тип `this` внутри объектного литерала.
</Callout>
