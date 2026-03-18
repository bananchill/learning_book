import { Callout } from '@book/ui'

# Utility Types разбор

TypeScript предоставляет богатый набор встроенных utility types. Разберём самые важные.

## Работа со свойствами объектов

Эта группа utility types предназначена для трансформации объектных типов — выбора нужных полей, скрытия лишних, изменения модификаторов. Это самые часто используемые утилиты в повседневной разработке. Типичный сценарий: у вас есть полная модель данных (например, `User`), и из неё нужно создать DTO для API-ответа без конфиденциальных полей, форму обновления с опциональными полями или иммутабельную версию для хранилища.

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
  createdAt: Date
}

// Pick<T, K> — берём только указанные поля
type PublicUser = Pick<User, 'id' | 'name' | 'email'>
// { id: number, name: string, email: string }

// Omit<T, K> — убираем указанные поля
type SafeUser = Omit<User, 'password'>
// { id: number, name: string, email: string, createdAt: Date }

// Partial<T> — все поля опциональны
type UpdateUserDto = Partial<Omit<User, 'id' | 'createdAt'>>
// { name?: string, email?: string, password?: string }

// Required<T> — все поля обязательны
type FullUser = Required<User>

// Readonly<T> — все поля readonly
type ImmutableUser = Readonly<User>
```

## Работа с union типами

Следующая группа утилит работает не с объектами, а с union типами — объединениями значений через `|`. Они позволяют фильтровать union, оставляя только нужные члены (`Extract`), удаляя ненужные (`Exclude`) или убирая `null`/`undefined` (`NonNullable`). Эти утилиты незаменимы, когда вы работаете с дискриминированными union или хотите сузить тип из стороннего API.

```typescript
type Status = 'active' | 'inactive' | 'banned' | 'deleted'

// Extract<T, U> — оставляем только совместимые с U
type ActiveStatuses = Extract<Status, 'active' | 'inactive'>
// 'active' | 'inactive'

// Exclude<T, U> — убираем совместимые с U
type ValidStatuses = Exclude<Status, 'deleted'>
// 'active' | 'inactive' | 'banned'

// NonNullable<T> — убираем null и undefined
type Defined = NonNullable<string | null | undefined>
// string
```

## Record<K, V>

`Record<K, V>` создаёт объектный тип, где каждый ключ из `K` имеет значение типа `V`. Это идеальный инструмент для описания словарей и маппингов, когда набор ключей известен заранее. Если передать в `K` union строковых литералов, TypeScript потребует наличия записи для каждого члена union, что защищает от пропущенных вариантов.

```typescript
// Record<K, V> — словарь с ключами K и значениями V
type StatusMessages = Record<Status, string>
const messages: StatusMessages = {
  active: 'Активен',
  inactive: 'Неактивен',
  banned: 'Заблокирован',
  deleted: 'Удалён'
}

// Полезно с keyof
type UserFields = Record<keyof User, string>
// Все поля User, но значения — строки
```

## Типы функций

Эта группа утилит извлекает информацию из сигнатур функций. `ReturnType<T>` возвращает тип результата функции, а `Parameters<T>` — кортеж типов её аргументов. Они особенно полезны, когда вы пишете обёртки, декораторы или middleware: вместо дублирования типов вручную, вы выводите их прямо из оригинальной функции. Если сигнатура функции изменится, типы обёрток обновятся автоматически.

```typescript
function createUser(name: string, age: number, admin?: boolean): User {
  return { id: 1, name, email: '', password: '', createdAt: new Date() }
}

// ReturnType<T> — тип возвращаемого значения
type CreateUserResult = ReturnType<typeof createUser>  // User

// Parameters<T> — кортеж типов параметров
type CreateUserArgs = Parameters<typeof createUser>
// [name: string, age: number, admin?: boolean]

// Пример использования Parameters
function logged<T extends (...args: any[]) => any>(fn: T) {
  return function(...args: Parameters<T>): ReturnType<T> {
    console.log('Вызов с аргументами:', args)
    const result = fn(...args)
    console.log('Результат:', result)
    return result
  }
}
```

<Callout type="tip">
`Parameters<T>` и `ReturnType<T>` особенно полезны при написании декораторов, middleware и обёрток функций — вы сохраняете полную информацию о сигнатуре оригинальной функции.
</Callout>

## Полный список utility types

Ниже приведена сводная таблица всех встроенных utility types в TypeScript. Большинство из них реализованы через mapped types и conditional types, которые мы разобрали в предыдущих подглавах. Понимание их внутреннего устройства позволяет не только использовать готовые утилиты, но и создавать свои собственные для специфических задач проекта.

| Тип | Описание |
|-----|----------|
| `Partial<T>` | Все поля опциональны |
| `Required<T>` | Все поля обязательны |
| `Readonly<T>` | Все поля readonly |
| `Pick<T, K>` | Только поля K из T |
| `Omit<T, K>` | Все поля T кроме K |
| `Record<K, V>` | Словарь с ключами K и значениями V |
| `Extract<T, U>` | Члены T, совместимые с U |
| `Exclude<T, U>` | Члены T, несовместимые с U |
| `NonNullable<T>` | T без null и undefined |
| `ReturnType<T>` | Тип возвращаемого значения функции |
| `Parameters<T>` | Кортеж типов параметров функции |
| `ConstructorParameters<T>` | Параметры конструктора |
| `InstanceType<T>` | Тип экземпляра класса |
| `Awaited<T>` | Распаковка Promise |
| `ThisType<T>` | Указывает тип this |
