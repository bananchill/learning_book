---
title: "Классы как синтаксический сахар"
---

import { Callout, DeepDive } from '@book/ui'

## Зачем появились классы

До ES6 (2015) наследование в JavaScript делалось через функции-конструкторы и прямую работу с `prototype`. Это работало, но выглядело непривычно для разработчиков из других языков и было легко допустить ошибку.

Классы — это **синтаксический сахар**: более читаемый синтаксис для того же прототипного механизма. Под капотом ничего не изменилось — это по-прежнему прототипы, но записанные удобнее.

## Синтаксис классов

```js
class Animal {
  constructor(name, sound) {
    // constructor вызывается при new Animal(...)
    // this — новый создаваемый объект
    this.name = name    // собственное свойство экземпляра
    this.sound = sound  // собственное свойство экземпляра
  }

  // Методы, объявленные в теле класса, попадают в Animal.prototype
  // Они разделяются между всеми экземплярами (не копируются)
  speak() {
    console.log(`${this.name} говорит: ${this.sound}`)
  }

  // Геттер — выглядит как свойство, но вычисляется при каждом обращении
  get info() {
    return `${this.name} (${this.sound})`
  }
}

const cat = new Animal('Мурка', 'Мяу')
cat.speak()          // "Мурка говорит: Мяу"
console.log(cat.info) // "Мурка (Мяу)"
```

Что здесь произошло:
1. `new Animal('Мурка', 'Мяу')` создал новый пустой объект
2. Установил его `[[Prototype]]` на `Animal.prototype`
3. Вызвал `constructor`, передав аргументы — `constructor` записал `name` и `sound` в объект
4. Вернул готовый объект

## Что генерирует class под капотом

Класс — это обёртка над теми же механизмами, которые мы видели в предыдущих подглавах. Вот эквивалентный код без `class`:

```js
// Записано через class:
class Animal {
  constructor(name) { this.name = name }
  speak() { console.log(this.name) }
}

// Эквивалентно (примерно):
function Animal(name) {
  this.name = name
}
Animal.prototype.speak = function() {
  console.log(this.name)
}
```

Методы класса живут в `prototype` — это одна функция на все экземпляры, а не копия в каждом объекте:

```js
const a = new Animal('Рекс')
const b = new Animal('Мурка')

// Метод speak — один и тот же объект в памяти
a.speak === b.speak                     // true
a.speak === Animal.prototype.speak      // true
Object.getPrototypeOf(a) === Animal.prototype // true
```

## Наследование: extends и super

`extends` позволяет одному классу наследовать методы другого. `super` — это способ обратиться к родительскому классу.

```js
class Dog extends Animal {
  constructor(name) {
    // super() вызывает конструктор родителя (Animal)
    // Это ОБЯЗАТЕЛЬНО сделать до обращения к this
    super(name, 'Гав')
    this.tricks = [] // собственное свойство Dog
  }

  learn(trick) {
    this.tricks.push(trick)
  }

  // Переопределяем метод родителя
  speak() {
    super.speak()                  // вызываем оригинальный speak из Animal
    console.log('(виляет хвостом)')
  }
}

const rex = new Dog('Рекс')
rex.speak()
// "Рекс говорит: Гав"
// "(виляет хвостом)"
rex.learn('сидеть')
console.log(rex.tricks) // ["сидеть"]
```

Что делает `extends` на уровне прототипов:
- `Dog.prototype.[[Prototype]]` → `Animal.prototype` (экземпляры наследуют методы)
- `Dog.[[Prototype]]` → `Animal` (сам класс наследует статические методы)

Что делает `super`:
- `super(...)` в `constructor` — вызывает конструктор родителя, чтобы инициализировать `this`
- `super.method()` в методах — вызывает одноимённый метод из прототипа родителя

<Callout type="warning">
В конструкторе дочернего класса `super()` нужно вызвать **до** любого обращения к `this`. Если забыть — будет `ReferenceError`. Это ограничение именно синтаксиса классов — в прототипном подходе без `class` такого нет.
</Callout>

## Статические методы и свойства

Обычные методы класса принадлежат **экземплярам** (через `prototype`). Статические методы принадлежат **самому классу** — их вызывают на классе, а не на объекте:

```js
class MathUtils {
  // Статическое свойство — на самом классе
  static PI = 3.14159

  // Статический метод — вызывается как MathUtils.circleArea()
  static circleArea(r) {
    return MathUtils.PI * r * r
  }
}

MathUtils.circleArea(5)  // 78.53975
MathUtils.PI             // 3.14159

// На экземпляре статических методов нет
const m = new MathUtils()
m.circleArea // undefined — метод не в prototype, а на самом классе
```

Когда использовать `static`:
- Утилитарные функции, не привязанные к конкретному экземпляру (`Math.max`, `Array.isArray`)
- Фабричные методы для создания экземпляров альтернативным способом
- Константы, общие для всех экземпляров

Статические методы **наследуются** дочерними классами:

```js
class ExtMath extends MathUtils {
  static sphereVolume(r) {
    return (4/3) * MathUtils.PI * r ** 3
  }
}

ExtMath.circleArea(3) // работает — унаследовано от MathUtils
ExtMath.PI            // 3.14159 — тоже унаследовано
```

## Приватные поля (ES2022)

По умолчанию все свойства объекта в JavaScript доступны снаружи. Приватные поля (с `#`) решают эту проблему — они видны **только внутри класса**:

```js
class BankAccount {
  #balance = 0 // приватное поле — снаружи не прочитать и не записать

  deposit(amount) {
    if (amount <= 0) throw new Error('Сумма должна быть положительной')
    this.#balance += amount
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Недостаточно средств')
    this.#balance -= amount
  }

  // Геттер — единственный способ прочитать баланс снаружи
  get balance() {
    return this.#balance
  }
}

const account = new BankAccount()
account.deposit(100)
console.log(account.balance)  // 100 — через геттер
// account.#balance            // SyntaxError — доступ запрещён
// account.balance = 999       // Нет сеттера — запись не сработает
```

Приватные поля — это настоящая приватность на уровне языка. В отличие от конвенции с `_underscorе`, к ним невозможно обратиться снаружи никаким способом.

<DeepDive title="Чем class отличается от function-конструктора">

Хотя `class` — синтаксический сахар, есть важные отличия от `function`:

1. **Без `new` — ошибка.** `Animal()` без `new` выбросит `TypeError`. Функцию-конструктор можно вызвать без `new` — и получить баг (свойства запишутся в глобальный объект)

2. **Методы неперечислимы.** Методы класса имеют `enumerable: false` — не появятся в `for...in`. У прототипных методов, добавленных вручную, `enumerable: true`

3. **Автоматический strict mode.** Тело класса всегда выполняется в строгом режиме — нельзя использовать необъявленные переменные, `with`, и т.д.

4. **Нет hoisting (TDZ).** Класс нельзя использовать до объявления — `new Animal()` до `class Animal {}` выбросит ошибку. Функции-конструкторы «всплывают» (hoisting)

5. **Наследование статики.** `extends` настраивает цепочку прототипов и для `prototype` (методы экземпляров), и для самого класса (статические методы). Вручную это делать сложнее

</DeepDive>

## Миксины — альтернатива множественному наследованию

В JavaScript класс может наследовать только от одного родителя (`extends` принимает один класс). Но иногда нужно добавить поведение из нескольких источников. Для этого используют **миксины** — функции, которые принимают класс и возвращают расширенный:

```js
// Миксин: добавляет сериализацию
const Serializable = (Base) => class extends Base {
  toJSON() {
    return JSON.stringify(this)
  }
}

// Миксин: добавляет дату создания
const Timestamped = (Base) => class extends Base {
  constructor(...args) {
    super(...args)
    this.createdAt = new Date()
  }
}

// Применяем оба миксина
class User extends Timestamped(Serializable(class {
  constructor(name) {
    super()
    this.name = name
  }
})) {}

const user = new User('Алиса')
user.toJSON()     // '{"name":"Алиса","createdAt":"..."}'
user.createdAt    // Date объект
```

Читается изнутри наружу: базовый класс → Serializable → Timestamped → User.

<Callout type="tip">
Миксины — продвинутый паттерн. Для большинства задач достаточно обычного наследования или композиции (объединение объектов через свойства).
</Callout>
