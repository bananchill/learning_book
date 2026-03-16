---
title: "Антипаттерны прототипного наследования"
---

import { Callout } from '@book/ui'

## Антипаттерн 1: изменение встроенных прототипов

У каждого встроенного типа в JavaScript есть прототип: `Object.prototype`, `Array.prototype`, `String.prototype` и т.д. Технически в них можно добавлять свои методы — и они станут доступны **всем** объектам этого типа. Это называется **monkey patching**, и это почти всегда плохая идея:

```js
// НЕ ДЕЛАЙТЕ ТАК
Object.prototype.log = function() {
  console.log(this)
}

// Теперь ЛЮБОЙ объект имеет метод log
const obj = { x: 1 }
obj.log() // работает...

// Но for...in теперь включает 'log' для ВСЕХ объектов!
for (const key in { a: 1 }) {
  console.log(key) // "a", "log" — неожиданно!
}
```

Почему это опасно:
- **Конфликты с библиотеками** — другой код может добавить свой `log` с другой логикой
- **Конфликты с будущим стандартом** — если TC39 добавит метод с таким же именем, ваш код сломается
- **Невидимые баги** — разработчики не ожидают, что `Object.prototype` изменён

<Callout type="error">
Никогда не добавляйте свои методы в прототипы встроенных типов. Единственное исключение — полифилы: добавление стандартных методов (вроде `Array.prototype.at`) для старых браузеров, которые их не поддерживают.
</Callout>

## Антипаттерн 2: глубокие цепочки наследования

Когда один класс наследует от другого, который наследует от третьего, и так далее — получается глубокая иерархия. Это одна из самых частых ошибок архитектуры:

```js
class Entity { }
class LivingEntity extends Entity { }
class Animal extends LivingEntity { }
class Mammal extends Animal { }
class Dog extends Mammal { }
class GoldenRetriever extends Dog { }
```

Проблемы глубоких иерархий:

1. **Хрупкость.** Изменение метода в `Entity` может неожиданно сломать `GoldenRetriever` через 5 уровней. Чем длиннее цепочка, тем сложнее предсказать последствия изменений

2. **Жёсткая связность.** `GoldenRetriever` намертво привязан к иерархии. Если завтра нужно сделать робота-собаку, которая `Dog`, но не `Animal` — придётся ломать всю цепочку

3. **Проблема банана и гориллы.** Вам нужен метод «бегать» из класса `Animal`, но вместе с ним вы получаете «дышать», «есть», «спать» и всё остальное из всех предков. Как говорил Джо Армстронг: «Вы хотели банан, а получили гориллу, которая держит банан, и все джунгли в придачу»

На практике 2–3 уровня — это разумный максимум.

### Альтернатива: композиция

Вместо глубокой иерархии — собирайте объект из независимых частей:

```js
// Вместо: Dog extends Mammal extends Animal extends LivingEntity
// Делаем: набор независимых поведений

class Dog {
  constructor(name) {
    this.name = name
    this.health = new Health(100)     // здоровье — отдельный объект
    this.movement = new Movement(10)  // передвижение — отдельный объект
  }

  bark() {
    console.log(this.name + ' говорит: Гав!')
  }
}

// Каждое поведение — отдельный класс, можно переиспользовать
class Health {
  constructor(max) { this.current = max; this.max = max }
  damage(amount) { this.current = Math.max(0, this.current - amount) }
  heal(amount) { this.current = Math.min(this.max, this.current + amount) }
}

class Movement {
  constructor(speed) { this.speed = speed }
  run() { console.log(`Бежит со скоростью ${this.speed}`) }
}
```

Теперь `Health` и `Movement` можно переиспользовать в любом контексте — робот, NPC, транспорт — без привязки к иерархии животных.

## Антипаттерн 3: ловушки instanceof

Оператор `instanceof` проверяет, есть ли `Constructor.prototype` в цепочке прототипов объекта. Звучит просто, но есть несколько ловушек.

### Разные контексты (iframes, realm)

Каждый iframe или realm имеет **свои** глобальные объекты. `Array` в одном iframe — это не тот же `Array`, что в другом:

```js
// Массив, созданный в iframe
const arr = new window.frames[0].Array(1, 2, 3)
arr instanceof Array // false! Это Array из другого контекста
Array.isArray(arr)   // true — надёжная проверка
```

### Замена прототипа после создания

```js
function Foo() {}
const obj = new Foo()

Foo.prototype = {} // заменяем прототип на новый объект

obj instanceof Foo // false! obj всё ещё ссылается на СТАРЫЙ Foo.prototype
```

### Примитивы

```js
'строка' instanceof String           // false — это примитив, не объект
42 instanceof Number                  // false
new String('строка') instanceof String // true — это объект-обёртка
```

### Надёжные альтернативы

Вместо `instanceof` используйте проверки, подходящие под задачу:

```js
// Для массивов — всегда Array.isArray
Array.isArray([1, 2, 3]) // true

// Для типа — typeof (для примитивов)
typeof 'строка' === 'string' // true

// Для duck typing — проверяйте наличие нужного метода
function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function'
}
```

## Антипаттерн 4: смешивание подходов

Когда часть кода использует `class`, а часть — функции-конструкторы с ручной настройкой `prototype`, читать и поддерживать код становится сложно:

```js
// Непоследовательно: function-конструктор + class
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function() {
  console.log(this.name)
}

class Dog extends Animal { // работает, но сбивает с толку
  bark() { console.log('Гав') }
}
```

Выберите один подход и придерживайтесь его. В современном коде — это классы:

```js
// Последовательно: только классы
class Animal {
  constructor(name) { this.name = name }
  speak() { console.log(this.name) }
}

class Dog extends Animal {
  bark() { console.log('Гав') }
}
```

## Антипаттерн 5: потеря прототипа при копировании

Спред-оператор (`...`) и `Object.assign` копируют только **собственные** свойства. Прототип теряется:

```js
const proto = {
  greet() { return `Привет, я ${this.name}` }
}
const original = Object.create(proto)
original.name = 'Алиса'

original.greet() // "Привет, я Алиса" — работает

// Копируем через спред — прототип потерян!
const copy = { ...original }
copy.greet() // TypeError: copy.greet is not a function

// Object.assign — та же проблема
const copy2 = Object.assign({}, original)
copy2.greet() // TypeError
```

Если прототип важен, используйте `Object.create` для копирования:

```js
const correctCopy = Object.create(
  Object.getPrototypeOf(original),             // сохраняем прототип
  Object.getOwnPropertyDescriptors(original)   // копируем собственные свойства
)
correctCopy.greet() // "Привет, я Алиса" — работает!
```

## Итого: что запомнить

| Антипаттерн | Почему плохо | Что делать вместо |
|-------------|-------------|-------------------|
| Менять встроенные прототипы | Ломает чужой код и будущие стандарты | Писать свои утилитарные функции |
| Глубокие иерархии (4+ уровней) | Хрупкость, жёсткая связность | Композиция — собирать из частей |
| Полагаться на `instanceof` | Ломается между контекстами, с примитивами | `Array.isArray`, `typeof`, duck typing |
| Смешивать class и function-конструкторы | Путаница, сложно читать | Выбрать один подход |
| Копировать через `{...obj}` с прототипами | Теряется прототип | `Object.create` + `getOwnPropertyDescriptors` |
