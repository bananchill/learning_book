import { Callout, DeepDive } from '@book/ui'

# Декораторы классов, методов, свойств

## Декоратор класса

Получает конструктор класса и может вернуть новый конструктор:

```typescript
// Декоратор, добавляющий timestamp
function withTimestamp<T extends { new(...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    createdAt = new Date()
  }
}

@withTimestamp
class Request {
  constructor(public url: string) {}
}

const req = new Request('/api')
console.log((req as any).createdAt) // Date объект
```

## Декоратор метода

Получает: прототип класса, имя метода, дескриптор метода:

```typescript
// Декоратор логирования
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value

  descriptor.value = function (...args: any[]) {
    console.log(`Вызов ${propertyKey}(${JSON.stringify(args)})`)
    const result = originalMethod.apply(this, args)
    console.log(`${propertyKey} вернул: ${JSON.stringify(result)}`)
    return result
  }

  return descriptor
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b
  }
}

const calc = new Calculator()
calc.add(2, 3)
// Вызов add([2,3])
// add вернул: 5
```

## Декоратор свойства

Получает: прототип и имя свойства (без дескриптора!):

```typescript
// Декоратор для валидации
function minLength(min: number) {
  return function (target: any, propertyKey: string) {
    let value: string

    const getter = function () {
      return value
    }

    const setter = function (newVal: string) {
      if (newVal.length < min) {
        throw new Error(
          `${propertyKey} должен содержать минимум ${min} символов`
        )
      }
      value = newVal
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    })
  }
}

class User {
  @minLength(3)
  name: string = ''
}

const user = new User()
user.name = 'Ив'   // Ошибка!
user.name = 'Иван' // OK
```

<Callout type="warning">
Декораторы свойств не получают дескриптор, потому что свойства экземпляра создаются в конструкторе, а не на прототипе. Для перехвата нужно использовать `Object.defineProperty` на прототипе.
</Callout>

## Фабрики декораторов

Фабрика — это функция, возвращающая декоратор. Позволяет параметризировать поведение:

```typescript
// Фабрика с параметрами
function retry(times: number) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      let lastError: Error

      for (let attempt = 1; attempt <= times; attempt++) {
        try {
          return await originalMethod.apply(this, args)
        } catch (error) {
          lastError = error as Error
          console.log(`Попытка ${attempt} не удалась: ${error}`)
        }
      }

      throw lastError!
    }

    return descriptor
  }
}

class ApiService {
  @retry(3)
  async fetchData(url: string): Promise<any> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return response.json()
  }
}
```

<DeepDive title="Composition декораторов и порядок применения">

При composing декораторов важно понимать порядок:

```typescript
function A(target: any, key: string, desc: PropertyDescriptor) {
  const orig = desc.value
  desc.value = function (...args: any[]) {
    console.log('A before')
    const result = orig.apply(this, args)
    console.log('A after')
    return result
  }
  return desc
}

function B(target: any, key: string, desc: PropertyDescriptor) {
  const orig = desc.value
  desc.value = function (...args: any[]) {
    console.log('B before')
    const result = orig.apply(this, args)
    console.log('B after')
    return result
  }
  return desc
}

class Service {
  @A  // применяется вторым (внешний)
  @B  // применяется первым (внутренний)
  process() { console.log('work') }
}

// При вызове service.process():
// A before → B before → work → B after → A after
```
</DeepDive>
