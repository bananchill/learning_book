import { Callout, DeepDive } from '@book/ui'

# Что такое декораторы

## Базовая концепция

Декоратор — это функция, которая получает описание того, что декорируется, и может модифицировать это описание:

```typescript
// Простейший декоратор класса
function sealed(constructor: Function) {
  Object.seal(constructor)
  Object.seal(constructor.prototype)
}

@sealed
class BugReport {
  type = 'report'
  title: string

  constructor(title: string) {
    this.title = title
  }
}
```

## Настройка

Для использования декораторов нужно включить их в `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

<Callout type="info">
В TypeScript 5.0 добавили поддержку TC39 Stage 3 декораторов без `experimentalDecorators`. NestJS и Angular пока используют старый синтаксис — нужен флаг.
</Callout>

## Виды декораторов

```typescript
// Декоратор класса
@ClassDecorator
class Example {}

// Декоратор метода
class Example {
  @MethodDecorator
  greet() {}
}

// Декоратор свойства
class Example {
  @PropertyDecorator
  name: string = ''
}

// Декоратор параметра
class Example {
  greet(@ParamDecorator message: string) {}
}

// Декоратор геттера/сеттера
class Example {
  @AccessorDecorator
  get value() { return this._value }
}
```

## Порядок применения

Декораторы применяются снизу вверх (от ближайшего к дальнему):

```typescript
function first() {
  console.log('фабрика first — вычисляется')
  return function (target: any) {
    console.log('декоратор first — применяется')
  }
}

function second() {
  console.log('фабрика second — вычисляется')
  return function (target: any) {
    console.log('декоратор second — применяется')
  }
}

@first()   // вычисляется первым, применяется вторым
@second()  // вычисляется вторым, применяется первым
class Example {}

// Вывод:
// фабрика first — вычисляется
// фабрика second — вычисляется
// декоратор second — применяется
// декоратор first — применяется
```

<DeepDive title="Как декораторы работают под капотом">

Декораторы — это просто синтаксический сахар. TypeScript транспилирует их в вызовы функций:

```javascript
// Оригинальный код:
@sealed
class BugReport {}

// Транспилированный код:
let BugReport = class BugReport {}
BugReport = sealed(BugReport) || BugReport
```

Для методов TypeScript использует `Object.defineProperty`:
```javascript
// @log на методе транспилируется в:
const descriptor = Object.getOwnPropertyDescriptor(
  BugReport.prototype, 'title'
)
const newDescriptor = log(BugReport.prototype, 'title', descriptor)
if (newDescriptor) {
  Object.defineProperty(BugReport.prototype, 'title', newDescriptor)
}
```
</DeepDive>
