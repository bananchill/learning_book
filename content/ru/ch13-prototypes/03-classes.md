---
title: "Классы как синтаксический сахар"
---

import { Callout, DeepDive } from '@book/ui'

## Синтаксис классов

ES6 классы — это синтаксический сахар над прототипным наследованием. Под капотом они используют те же прототипы и функции-конструкторы.

```js
class Animal {
  constructor(name, sound) {
    this.name = name    // собственное свойство экземпляра
    this.sound = sound
  }

  // Метод попадает в Animal.prototype
  speak() {
    console.log(`${this.name} говорит: ${this.sound}`)
  }

  // Геттер
  get info() {
    return `${this.name} (${this.sound})`
  }
}

const cat = new Animal('Мурка', 'Мяу')
cat.speak()          // "Мурка говорит: Мяу"
console.log(cat.info) // "Мурка (Мяу)"
```

## Под капотом: что генерирует class

```js
// Это:
class Animal {
  constructor(name) { this.name = name }
  speak() { console.log(this.name) }
}

// Эквивалентно (приблизительно):
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function() {
  console.log(this.name)
}

// Методы класса живут в прототипе
const a = new Animal('Рекс')
Object.getPrototypeOf(a) === Animal.prototype // true
a.speak === Animal.prototype.speak            // true
```

## Наследование: extends и super

```js
class Dog extends Animal {
  constructor(name) {
    super(name, 'Гав') // вызов конструктора родителя — ОБЯЗАТЕЛЕН
    this.tricks = []
  }

  learn(trick) {
    this.tricks.push(trick)
  }

  speak() {
    super.speak()                  // вызов метода родителя
    console.log('(виляет хвостом)')
  }
}

const rex = new Dog('Рекс')
rex.speak() // "Рекс говорит: Гав" + "(виляет хвостом)"
rex.learn('сидеть')
console.log(rex.tricks) // ["сидеть"]
```

<Callout type="warning">
В конструкторе дочернего класса `super()` нужно вызвать **до** обращения к `this`. Иначе — `ReferenceError: Must call super constructor`. Это ограничение именно классов — в прототипном подходе без классов такого нет.
</Callout>

## Статические методы и свойства

```js
class MathUtils {
  static PI = 3.14159

  static circleArea(r) {
    return MathUtils.PI * r * r
  }

  static format(n, decimals = 2) {
    return n.toFixed(decimals)
  }
}

MathUtils.circleArea(5) // 78.53975
// new MathUtils() — можно, но бессмысленно

// Статические методы наследуются
class ExtMath extends MathUtils {
  static sphereVolume(r) {
    return (4/3) * MathUtils.PI * r ** 3
  }
}

ExtMath.circleArea(3) // унаследован от MathUtils
```

## Приватные поля (ES2022)

```js
class BankAccount {
  #balance = 0    // приватное поле — недоступно снаружи

  deposit(amount) {
    if (amount > 0) this.#balance += amount
  }

  get balance() {
    return this.#balance
  }
}

const account = new BankAccount()
account.deposit(100)
console.log(account.balance)  // 100
// account.#balance           // SyntaxError
```

<DeepDive>
**Отличия class от function-конструктора:**

1. `class` нельзя вызвать без `new` — `TypeError`. Функцию-конструктор можно (получишь мусор в глобале)
2. Методы класса **неперечислимы** (`enumerable: false`) — не появятся в `for...in`
3. Тело класса выполняется в **строгом режиме** (strict mode) автоматически
4. `class` нельзя использовать до объявления (TDZ)
5. `extends` настраивает и `prototype`, и `[[Prototype]]` самих функций-конструкторов — для наследования статических методов
</DeepDive>

## Миксины — альтернатива множественному наследованию

JavaScript не поддерживает множественное наследование через классы, но можно использовать миксины:

```js
// Миксин — функция, принимающая класс и возвращающая расширенный
const Serializable = (Base) => class extends Base {
  toJSON() {
    return JSON.stringify(this)
  }
  static fromJSON(json) {
    return Object.assign(new this(), JSON.parse(json))
  }
}

const Timestamped = (Base) => class extends Base {
  constructor(...args) {
    super(...args)
    this.createdAt = new Date()
  }
}

class User extends Timestamped(Serializable(class {})) {
  constructor(name) {
    super()
    this.name = name
  }
}

const user = new User('Алиса')
user.toJSON()    // '{"name":"Алиса","createdAt":"..."}'
user.createdAt   // Date объект
```
