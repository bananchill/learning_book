import { Callout, DeepDive } from '@book/ui'

# reflect-metadata

## Что такое метаданные

`reflect-metadata` — это полифил для Metadata Reflection API. Позволяет хранить и получать метаданные, связанные с классами и их членами:

```bash
npm install reflect-metadata
```

```typescript
// В точке входа (main.ts)
import 'reflect-metadata'
```

## Базовый API

```typescript
import 'reflect-metadata'

class User {
  name: string = ''
  age: number = 0
}

// Устанавливаем метаданные
Reflect.defineMetadata('description', 'Пользователь системы', User)
Reflect.defineMetadata('version', '1.0', User, 'name')

// Получаем метаданные
const desc = Reflect.getMetadata('description', User)
// 'Пользователь системы'

const nameVersion = Reflect.getMetadata('version', User, 'name')
// '1.0'

// Проверяем наличие
Reflect.hasMetadata('description', User) // true

// Получаем ключи метаданных
Reflect.getMetadataKeys(User) // ['description']
```

## design:type — автоматические метаданные TypeScript

При включённом `emitDecoratorMetadata: true`, TypeScript автоматически генерирует метаданные типов:

```typescript
import 'reflect-metadata'

class Service {
  @Inject() // декоратор нужен чтобы TypeScript эмитировал метаданные
  userRepository: UserRepository

  @Inject()
  emailService: EmailService
}

// TypeScript генерирует:
// Reflect.metadata('design:type', UserRepository)(Service.prototype, 'userRepository')
// Reflect.metadata('design:type', EmailService)(Service.prototype, 'emailService')

// Получаем тип свойства
const type = Reflect.getMetadata('design:type', Service.prototype, 'userRepository')
console.log(type === UserRepository) // true
```

<Callout type="info">
Встроенные ключи: `design:type` — тип свойства/параметра, `design:paramtypes` — массив типов параметров конструктора/метода, `design:returntype` — тип возвращаемого значения.
</Callout>

## Практический пример: простой DI-контейнер

```typescript
import 'reflect-metadata'

// Токен для DI
const INJECTABLE_KEY = 'injectable'
const DEPENDENCIES_KEY = 'design:paramtypes'

// Помечаем класс как injectable
function Injectable() {
  return function (constructor: Function) {
    Reflect.defineMetadata(INJECTABLE_KEY, true, constructor)
  }
}

// Контейнер
class Container {
  private registry = new Map<string, any>()

  register(token: string, constructor: new (...args: any[]) => any) {
    this.registry.set(token, constructor)
  }

  resolve<T>(constructor: new (...args: any[]) => T): T {
    // Получаем типы зависимостей из метаданных
    const dependencies: any[] =
      Reflect.getMetadata(DEPENDENCIES_KEY, constructor) || []

    // Рекурсивно разрешаем зависимости
    const resolvedDeps = dependencies.map(dep => this.resolve(dep))

    return new constructor(...resolvedDeps)
  }
}

@Injectable()
class Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`)
  }
}

@Injectable()
class UserService {
  constructor(private logger: Logger) {}

  createUser(name: string) {
    this.logger.log(`Создан пользователь: ${name}`)
    return { name }
  }
}

const container = new Container()
const userService = container.resolve(UserService)
userService.createUser('Иван')
```

<DeepDive title="Как NestJS использует reflect-metadata">

NestJS строит весь свой DI-контейнер на основе `reflect-metadata`:

```typescript
// NestJS под капотом делает примерно это:

@Controller('users')  // Reflect.defineMetadata('path', 'users', UserController)
export class UserController {
  constructor(private userService: UserService) {}
  // design:paramtypes → [UserService]

  @Get(':id')  // Reflect.defineMetadata('method', 'GET', UserController.prototype, 'findOne')
  findOne(@Param('id') id: string) {}
}

// При инициализации NestJS:
// 1. Читает metadata 'path' → создаёт роут
// 2. Читает design:paramtypes → внедряет зависимости
// 3. Читает 'method' на методах → регистрирует HTTP-обработчики
```
</DeepDive>
