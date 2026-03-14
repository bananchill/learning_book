import { Callout } from '@book/ui'

# Практика: Реальные декораторы

## @log — логирование вызовов

```typescript
function log(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value
  const className = target.constructor.name

  descriptor.value = function (...args: any[]) {
    const start = Date.now()
    console.log(`[${className}.${propertyKey}] Вызов с`, args)

    try {
      const result = original.apply(this, args)

      // Обрабатываем Promise
      if (result instanceof Promise) {
        return result
          .then(res => {
            console.log(`[${className}.${propertyKey}] Успех:`, res, `(${Date.now() - start}ms)`)
            return res
          })
          .catch(err => {
            console.error(`[${className}.${propertyKey}] Ошибка:`, err)
            throw err
          })
      }

      console.log(`[${className}.${propertyKey}] Результат:`, result)
      return result
    } catch (error) {
      console.error(`[${className}.${propertyKey}] Ошибка:`, error)
      throw error
    }
  }

  return descriptor
}
```

## @validate — валидация аргументов

```typescript
// Фабрика валидатора
function validate(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value
  const paramTypes: any[] =
    Reflect.getMetadata('design:paramtypes', target, propertyKey) || []

  descriptor.value = function (...args: any[]) {
    args.forEach((arg, index) => {
      const expectedType = paramTypes[index]
      if (expectedType && typeof arg !== expectedType.name.toLowerCase()) {
        if (!(arg instanceof expectedType)) {
          throw new TypeError(
            `Параметр ${index} должен быть ${expectedType.name}, получен ${typeof arg}`
          )
        }
      }
    })
    return original.apply(this, args)
  }

  return descriptor
}

class MathService {
  @validate
  add(a: number, b: number): number {
    return a + b
  }
}
```

## @memoize — кэширование результатов

```typescript
function memoize(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value
  const cache = new Map<string, any>()

  descriptor.value = function (...args: any[]) {
    // Ключ кэша — сериализованные аргументы
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      console.log(`[memoize] Cache hit для ${propertyKey}(${key})`)
      return cache.get(key)
    }

    const result = original.apply(this, args)
    cache.set(key, result)
    return result
  }

  // Добавляем метод для очистки кэша
  ;(descriptor.value as any).clearCache = () => cache.clear()

  return descriptor
}

class FibonacciService {
  @memoize
  fib(n: number): number {
    if (n <= 1) return n
    return this.fib(n - 1) + this.fib(n - 2)
  }
}

const service = new FibonacciService()
service.fib(40) // вычисляется один раз, потом из кэша
```

## @readonly — неизменяемые свойства

```typescript
function readonly(target: any, propertyKey: string) {
  Object.defineProperty(target, propertyKey, {
    writable: false,
    configurable: false,
    enumerable: true,
  })
}

class Config {
  @readonly
  API_URL = 'https://api.example.com'

  @readonly
  MAX_RETRIES = 3
}

const config = new Config()
// config.API_URL = 'other' // Ошибка в strict mode!
```

<Callout type="tip">
Декораторы особенно мощны в сочетании с reflect-metadata. Например, `@Injectable()` в NestJS использует `design:paramtypes` чтобы автоматически внедрять зависимости — вам не нужно явно перечислять их.
</Callout>
