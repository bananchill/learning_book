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

### Как работает instanceof

Прежде чем разбирать ловушки, убедимся, что понимаем механику. Выражение `obj instanceof Foo` делает следующее:

1. Берёт объект `Foo.prototype`
2. Идёт по цепочке прототипов `obj`: `obj → obj.[[Prototype]] → obj.[[Prototype]].[[Prototype]] → ...`
3. Если где-то в цепочке встретился `Foo.prototype` — возвращает `true`
4. Если дошёл до `null` (конец цепочки) и не встретил — `false`

```js
class Animal {}
class Dog extends Animal {}

const rex = new Dog()

rex instanceof Dog    // true — Dog.prototype есть в цепочке rex
rex instanceof Animal // true — Animal.prototype тоже есть (на уровень выше)
rex instanceof Object // true — Object.prototype есть в любой цепочке
```

Теперь — к ловушкам.

### Ловушка 1: разные контексты (iframes)

Представьте, что на странице есть `<iframe>`. Внутри iframe — отдельный мир JavaScript: свои глобальные объекты, свой `Array`, свой `Object`, свой `Function`. Они **не совпадают** с `Array`, `Object` и `Function` из основной страницы, хотя работают одинаково.

Почему? Потому что каждый контекст (realm) при загрузке создаёт **свои копии** всех встроенных конструкторов. `Array` на главной странице и `Array` внутри iframe — это две разные функции с двумя разными объектами `prototype`.

```js
// На главной странице
const myArray = [1, 2, 3]
myArray instanceof Array // true — создан через Array этой страницы

// Массив, созданный ВНУТРИ iframe
const iframe = document.querySelector('iframe')
const iframeArray = iframe.contentWindow.eval('[1, 2, 3]')

// instanceof сравнивает с Array НАШЕЙ страницы
iframeArray instanceof Array // false!
// Потому что iframeArray.[[Prototype]] → iframe.Array.prototype
// А мы сравниваем с window.Array.prototype — это другой объект!

// Array.isArray работает правильно в любом контексте
Array.isArray(iframeArray) // true
```

Та же проблема возникает с `Object`, `RegExp`, `Date` и любыми другими встроенными типами, если объект передан между контекстами (iframe, Web Worker с postMessage, vm-модули в Node.js).

### Ловушка 2: замена прототипа после создания объектов

`instanceof` проверяет **текущее** значение `Constructor.prototype`. Если вы замените `prototype` после создания объекта, старые объекты «отвяжутся»:

```js
function User() {}
const alice = new User()

// В этот момент:
// alice.[[Prototype]] → User.prototype (объект A)
alice instanceof User // true

// Заменяем prototype на НОВЫЙ объект
User.prototype = { role: 'admin' }

// Теперь User.prototype — объект B
// Но alice.[[Prototype]] всё ещё указывает на объект A!
alice instanceof User // false — объект A ≠ объект B

// Новые объекты привязаны к объекту B
const bob = new User()
bob instanceof User // true
```

Это редко случается нарочно, но может произойти при неаккуратной работе с прототипами в библиотеках.

### Ловушка 3: примитивы — не объекты

`instanceof` работает с **объектами**. Примитивы (`string`, `number`, `boolean`) — не объекты, поэтому `instanceof` для них всегда `false`:

```js
'привет' instanceof String  // false — это примитив, а не объект
42 instanceof Number         // false
true instanceof Boolean      // false

// Объекты-обёртки — это объекты, для них работает:
new String('привет') instanceof String // true
new Number(42) instanceof Number       // true

// Но объекты-обёртки почти никогда не нужны!
// Для проверки типа примитивов используйте typeof:
typeof 'привет' === 'string' // true
typeof 42 === 'number'        // true
```

### Что использовать вместо instanceof

| Задача | Ненадёжно | Надёжно |
|--------|-----------|---------|
| Проверить массив | `x instanceof Array` | `Array.isArray(x)` |
| Проверить тип примитива | `x instanceof String` | `typeof x === 'string'` |
| Проверить наличие метода | `x instanceof Iterable` | `typeof x[Symbol.iterator] === 'function'` |
| Проверить тип объекта | `x instanceof Date` | `Object.prototype.toString.call(x) === '[object Date]'` |

Последний подход — **duck typing** («если ходит как утка и крякает как утка, то это утка»). Вместо вопроса «от какого конструктора создан объект?» спрашиваем «умеет ли объект делать то, что нам нужно?»:

```js
// Duck typing: нам не важно, ЧТО это — важно, ЧТО оно умеет
function processItems(collection) {
  // Вместо: if (collection instanceof Array)
  // Проверяем: можно ли перебирать?
  if (collection != null && typeof collection[Symbol.iterator] === 'function') {
    for (const item of collection) {
      console.log(item)
    }
  }
}

// Работает с массивами, Set, Map, строками, генераторами...
processItems([1, 2, 3])
processItems(new Set([4, 5, 6]))
processItems('abc')
```

## Антипаттерн 4: смешивание подходов

Когда в одном проекте часть кода использует `class`, а часть — функции-конструкторы с ручной настройкой `prototype`, код становится непоследовательным. Новый разработчик не поймёт, какой стиль «правильный», и будет путаться:

```js
// Непоследовательно: старый стиль + новый стиль в одном проекте
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function() {
  console.log(this.name)
}

class Dog extends Animal { // работает, но зачем миксовать?
  bark() { console.log('Гав') }
}
```

Технически это работает — `extends` умеет наследовать от функций-конструкторов. Но это создаёт путаницу: часть иерархии написана в одном стиле, часть — в другом. Выберите один подход и придерживайтесь его:

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
