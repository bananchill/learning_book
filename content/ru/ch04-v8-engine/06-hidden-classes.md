---
title: "Hidden Classes и Inline Caches"
parent: "ch04-v8-engine"
order: 6
---

import { Callout, DeepDive } from '@book/ui'

## Проблема: динамические объекты

В C или Java компилятор знает структуру объекта заранее — какие поля, какие типы, по каким смещениям в памяти. Доступ к полю — одна машинная инструкция.

В JavaScript объекты — динамические словари. Свойства можно добавлять, удалять, переименовывать в любой момент. Наивная реализация — хеш-таблица: медленный поиск по строковому ключу на каждое обращение к свойству.

V8 решает эту проблему через **Hidden Classes** — внутренние структуры, которые описывают «форму» объекта и позволяют обращаться к свойствам по фиксированному смещению, как в статически типизированных языках.

## Что такое Hidden Class

Hidden Class (внутреннее название в V8 — **Map**) — это метаданные объекта, описывающие:

- Какие свойства есть у объекта
- В каком порядке они были добавлены
- По какому смещению каждое свойство хранится в памяти
- Тип каждого свойства (writable, enumerable, configurable)

Каждый объект в V8 содержит указатель на свой Hidden Class. Объекты с одинаковой структурой разделяют один Hidden Class:

```js
const a = { x: 1, y: 2 }
const b = { x: 10, y: 20 }
// a и b имеют один Hidden Class:
//   Map { x: offset 0, y: offset 1 }

const c = { y: 1, x: 2 }
// c имеет ДРУГОЙ Hidden Class — порядок свойств отличается
```

Когда V8 знает Hidden Class объекта, доступ к свойству `obj.x` — это чтение по заранее известному смещению. Никакого поиска по имени.

## Transition chains: дерево переходов

Когда вы добавляете свойство к объекту, V8 не создаёт новый Hidden Class с нуля. Он строит **цепочку переходов** (transition chain):

```js
const obj = {}       // Map_0: {} (пустой объект)
obj.x = 1            // Map_1: { x: offset 0 }
obj.y = 2            // Map_2: { x: offset 0, y: offset 1 }
obj.z = 3            // Map_3: { x: offset 0, y: offset 1, z: offset 2 }
```

Переходы образуют **дерево**. Если другой объект проходит ту же последовательность добавлений, V8 переиспользует уже существующие Maps:

```js
function createPoint(x, y) {
  const p = {}    // Map_0
  p.x = x         // Map_0 → Map_1 (переход "добавить x")
  p.y = y         // Map_1 → Map_2 (переход "добавить y")
  return p
}

const p1 = createPoint(1, 2)   // Map_2
const p2 = createPoint(10, 20) // Map_2 — тот же Hidden Class
const p3 = createPoint(5, 7)   // Map_2 — и этот тоже
```

Все три объекта разделяют один Hidden Class → V8 может оптимизировать доступ к их свойствам одинаково.

### Ветвление дерева

Если объекты расходятся в структуре, дерево ветвится:

```js
const a = {}   // Map_0
a.x = 1        // Map_0 → Map_1

const b = {}   // Map_0
b.y = 1        // Map_0 → Map_3 (другая ветка!)

// Дерево переходов:
//         Map_0 {}
//        /       \
//  +"x"          +"y"
//  Map_1{x}      Map_3{y}
```

<Callout type="warning">
Добавление свойств в разном порядке создаёт разные Hidden Classes, даже если итоговый набор свойств одинаковый. `{x, y}` и `{y, x}` — разные формы.
</Callout>

## In-object vs out-of-object свойства

V8 хранит свойства объекта двумя способами:

**In-object properties** — размещены прямо в теле объекта, рядом с указателем на Map. Это самый быстрый доступ — одна инструкция по смещению.

**Out-of-object (backing store)** — если свойств много или они добавлены позже, V8 выносит их в отдельный массив (properties array).

```js
// V8 заранее выделяет слоты для in-object свойств
const obj = { a: 1, b: 2, c: 3 }
// Все три — in-object, быстрый доступ

// Объект-литерал с большим количеством свойств
const big = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 /* ... */ }
// Первые N — in-object, остальные → backing store
```

Объекты, созданные через конструктор или литерал, получают зарезервированные слоты для in-object свойств. V8 анализирует конструктор и угадывает, сколько свойств будет добавлено.

## Fast mode vs Dictionary mode

Объекты в V8 работают в одном из двух режимов:

**Fast mode** (по умолчанию) — свойства хранятся по смещениям, Hidden Class описывает структуру. Доступ — одна инструкция.

**Dictionary mode** (slow properties) — свойства хранятся в хеш-таблице. Доступ медленнее, но гибче.

V8 переключает объект в dictionary mode, когда:

```js
// 1. Удаление свойства через delete
const obj = { x: 1, y: 2, z: 3 }
delete obj.y  // → dictionary mode!

// 2. Слишком много динамических добавлений свойств
const cache = {}
for (let i = 0; i < 1000; i++) {
  cache[`key_${i}`] = i  // после определённого порога → dictionary mode
}

// 3. Добавление computed property с непредсказуемым именем
obj[dynamicKey] = value
```

<Callout type="tip">
Избегайте `delete` — используйте присвоение `null` или `undefined`, если хотите «обнулить» свойство, не ломая Hidden Class.
</Callout>

## Inline Caches (IC)

Hidden Classes полезны, но сами по себе не ускоряют код. Ускорение даёт **Inline Cache** — механизм, который запоминает результат поиска свойства и переиспользует его при следующем вызове.

### Как работает IC

При первом выполнении `obj.x`:

1. V8 смотрит на Hidden Class объекта
2. Находит свойство `x` по дескрипторам Hidden Class
3. Определяет смещение (например, offset 0)
4. **Кэширует** пару: `{Hidden Class → offset}` прямо в сгенерированном коде

При следующем вызове с тем же Hidden Class — прямое чтение по смещению, без поиска.

### Три состояния IC

```js
function getName(user) { return user.name }
```

**Monomorphic** — все объекты имеют один Hidden Class:

```js
getName({ name: 'Алиса', age: 25 })
getName({ name: 'Боб', age: 30 })
// IC: один Hidden Class → одно смещение → максимальная скорость
```

**Polymorphic** — 2–4 разных Hidden Class:

```js
getName({ name: 'Алиса', age: 25 })
getName({ name: 'Боб', role: 'admin' }) // другой HC
// IC: два варианта → проверка + ветвление → медленнее
```

**Megamorphic** — 5+ разных Hidden Class:

```js
getName({ name: 'A', a: 1 })
getName({ name: 'B', b: 2 })
getName({ name: 'C', c: 3 })
getName({ name: 'D', d: 4 })
getName({ name: 'E', e: 5 })
// IC: слишком много вариантов → откат к хеш-таблице → медленно
```

| Состояние | Hidden Classes | Скорость | Что происходит |
|-----------|---------------|----------|----------------|
| Monomorphic | 1 | Максимальная | Прямое чтение по смещению |
| Polymorphic | 2–4 | Средняя | Линейный поиск по нескольким вариантам |
| Megamorphic | 5+ | Минимальная | Полный поиск через хеш-таблицу |

## Практические правила

### Инициализируйте свойства в конструкторе

```js
// Хорошо: все свойства в конструкторе, одинаковый порядок
class User {
  constructor(name, age) {
    this.name = name
    this.age = age
    this.role = 'user'   // даже значения по умолчанию — в конструкторе
  }
}

// Плохо: свойства добавляются позже, в разном порядке
class User {
  constructor(name) {
    this.name = name
  }
  setAge(age) { this.age = age }     // новый HC при каждом вызове
  setRole(role) { this.role = role }  // ещё один новый HC
}
```

### Не меняйте структуру после создания

```js
// Плохо: условное добавление свойств
function createUser(data) {
  const user = { name: data.name }
  if (data.age) user.age = data.age       // не у всех будет age
  if (data.email) user.email = data.email // не у всех будет email
  return user
}
// Каждая комбинация — новый Hidden Class

// Хорошо: всегда одинаковая структура
function createUser(data) {
  return {
    name: data.name,
    age: data.age ?? null,
    email: data.email ?? null,
  }
}
// Один Hidden Class для всех
```

### Передавайте однородные объекты в функции

```js
// Плохо: каждый объект — разная структура
processItem({ id: 1, name: 'A' })
processItem({ id: 2, title: 'B' })     // другой HC → полиморфный IC
processItem({ id: 3, label: 'C' })     // ещё один HC
processItem({ id: 4, caption: 'D' })   // ещё один
processItem({ id: 5, heading: 'E' })   // мегаморфный IC!

// Хорошо: единая структура
processItem({ id: 1, text: 'A' })
processItem({ id: 2, text: 'B' })      // тот же HC → мономорфный IC
```

<DeepDive title="Как посмотреть Hidden Classes в Node.js">

Node.js (и Chrome) поддерживают флаги V8 для отладки:

```bash
# Показать информацию об IC (inline caches)
node --trace-ic script.js

# Показать деоптимизации
node --trace-deopt script.js

# Показать компиляцию и оптимизацию
node --trace-opt script.js
```

В Chrome DevTools: Performance → Record → в разделе «Bottom-Up» видны деоптимизации. Также полезен `%HaveSameMap(obj1, obj2)` с флагом `--allow-natives-syntax`:

```js
// node --allow-natives-syntax
const a = { x: 1, y: 2 }
const b = { x: 3, y: 4 }
console.log(%HaveSameMap(a, b)) // true — один Hidden Class

const c = { y: 1, x: 2 }
console.log(%HaveSameMap(a, c)) // false — разные Hidden Classes
```

</DeepDive>

## Итого

| Концепция | Описание |
|-----------|----------|
| Hidden Class (Map) | Описывает форму объекта: свойства, порядок, смещения |
| Transition chain | Цепочка переходов при добавлении свойств; одинаковый порядок → общий HC |
| In-object свойства | Хранятся прямо в теле объекта — самый быстрый доступ |
| Dictionary mode | Откат к хеш-таблице при `delete` или слишком динамичной структуре |
| Inline Cache | Кэш пары {Hidden Class → смещение}; mono → poly → mega |
| Мономорфность | Один HC в IC — максимальная скорость, к ней нужно стремиться |
