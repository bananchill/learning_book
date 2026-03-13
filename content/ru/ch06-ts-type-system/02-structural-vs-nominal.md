---
title: "Структурная vs номинальная типизация"
parent: "ch06-ts-type-system"
order: 2
---

## Два подхода к совместимости типов

Когда ты пишешь `const x: A = y`, компилятор проверяет: совместим ли `y` с типом `A`? Ответ зависит от **системы типизации**.

### Номинальная типизация (Java, C#, Swift)

Совместимость определяется **именем типа**. Два класса с одинаковой структурой несовместимы, если это разные классы:

```java
// Java — номинальная типизация
class Dog { String name; }
class Cat { String name; }

Dog dog = new Cat(); // ❌ Ошибка: Cat не является Dog
```

Неважно, что `Dog` и `Cat` идентичны по структуре — имена разные, значит типы несовместимы.

### Структурная типизация (TypeScript, Go)

Совместимость определяется **формой (shape)**. Если объект содержит нужные свойства — он совместим:

```ts
// TypeScript — структурная типизация
interface Dog { name: string }
interface Cat { name: string }

const dog: Dog = { name: 'Рекс' }
const cat: Cat = dog // ✅ OK — структура совпадает
```

TypeScript не смотрит на имена `Dog` и `Cat`. Он видит: у обоих есть `name: string` — значит совместимы. Это **duck typing на уровне типов**: «если выглядит как утка и крякает как утка — это утка».

## Почему TypeScript выбрал структурную типизацию

TypeScript проектировался для описания существующего JavaScript-кода. В JavaScript нет классов-в-Java-смысле — есть объекты с произвольными свойствами. Структурная типизация естественно ложится на эту модель:

```ts
// Не нужно наследовать интерфейс — достаточно иметь нужные поля
interface Printable {
  toString(): string
}

function print(item: Printable) {
  console.log(item.toString())
}

// Любой объект с toString() подходит
print({ toString: () => 'hello' })  // ✅
print(42)                            // ✅ — у number есть toString()
print([1, 2, 3])                     // ✅ — у массива есть toString()
```

Из официальных TypeScript Design Goals: «Использовать структурную систему типов» — цель #9.

## Практические последствия

### Совместимость «по наличию»

Объект совместим с типом, если у него есть **как минимум** все требуемые свойства. Лишние свойства — не проблема:

```ts
interface Point2D { x: number; y: number }
interface Point3D { x: number; y: number; z: number }

const p3: Point3D = { x: 1, y: 2, z: 3 }
const p2: Point2D = p3 // ✅ — у p3 есть x и y

// Обратное не работает:
const p2only: Point2D = { x: 1, y: 2 }
const p3from2: Point3D = p2only // ❌ — нет z
```

`Point3D` является подтипом `Point2D` — у него больше свойств, значит он «умеет» всё, что умеет `Point2D`.

### Excess property checking — исключение из правил

Есть одно место, где TypeScript ведёт себя «строже» структурной типизации — **литеральные объекты**:

```ts
interface Config {
  host: string
  port: number
}

// ❌ Ошибка: 'prot' does not exist in type 'Config' (опечатка!)
const config: Config = { host: 'localhost', prot: 3000 }

// ✅ OK — через промежуточную переменную проверки нет
const raw = { host: 'localhost', prot: 3000 }
const config2: Config = raw // ✅ — но port будет undefined!
```

<Callout type="info">
Excess property checking работает только для свежих объектных литералов (fresh object literals). Это эвристика для ловли опечаток, а не правило системы типов.
</Callout>

## Когда структурная типизация создаёт проблемы

### Случайная совместимость

Два типа с разной семантикой, но одинаковой структурой — взаимозаменяемы:

```ts
interface UserId { value: number }
interface OrderId { value: number }

function getUser(id: UserId) { /* ... */ }

const orderId: OrderId = { value: 42 }
getUser(orderId) // ✅ — но это баг! Мы передали ID заказа вместо ID пользователя
```

TypeScript не знает, что `UserId` и `OrderId` — семантически разные вещи. Для него это одна и та же форма.

### Решение: Branded Types

Branded types — паттерн эмуляции номинальной типизации. Добавляем «невидимое» свойство-бренд, которое делает типы несовместимыми:

```ts
// Бренд — phantom type, не существует в рантайме
type UserId = number & { readonly __brand: unique symbol }
type OrderId = number & { readonly __brand: unique symbol }

// Конструктор — единственный способ создать branded значение
function createUserId(id: number): UserId {
  return id as UserId
}

function createOrderId(id: number): OrderId {
  return id as OrderId
}

function getUser(id: UserId) { /* ... */ }

const userId = createUserId(1)
const orderId = createOrderId(2)

getUser(userId)  // ✅
getUser(orderId) // ❌ Ошибка компиляции!
getUser(42)      // ❌ Ошибка: number не совместим с UserId
```

<Callout type="tip">
Branded types не добавляют рантайм-оверхед. Бренд существует только на уровне типов и стирается при компиляции. В рантайме UserId — обычный number.
</Callout>

<DeepDive title="Вариантность: ковариантность и контравариантность">
Структурная совместимость зависит от **позиции** типа:
- **Ковариантность** (return types, readonly свойства): если `A <: B`, то `F<A> <: F<B>`. Массив `string[]` совместим с `(string | number)[]` (для чтения).
- **Контравариантность** (параметры функций с `strictFunctionTypes`): если `A <: B`, то `F<B> <: F<A>`. Функция `(x: Animal) => void` совместима с `(x: Dog) => void`, не наоборот.
- **Бивариантность** (параметры методов без strict): и так, и так. Это unsound, но удобно для обработчиков событий DOM.

Флаг `strictFunctionTypes` (включён в strict mode) переключает параметры функций с бивариантной на контравариантную проверку.
</DeepDive>

## Итого

| Подход | Совместимость по | Языки | Плюсы | Минусы |
|--------|-----------------|-------|-------|--------|
| Номинальная | Имя типа | Java, C#, Swift | Строгое различение типов | Нужно явное наследование |
| Структурная | Форма (shape) | TypeScript, Go | Гибкость, duck typing | Случайная совместимость |

- TypeScript выбрал структурную типизацию для совместимости с JavaScript
- Excess property checking — эвристика для литералов, не правило типов
- Branded types — паттерн для номинальной типизации без рантайм-оверхеда
