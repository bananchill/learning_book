---
title: "Object.create и прототипное наследование"
---

import { Callout } from '@book/ui'

## Object.create

`Object.create(proto)` создаёт новый объект с заданным прототипом. Это самый явный способ настроить прототипную цепочку.

```js
const animal = {
  breathe() {
    console.log(this.name + ' дышит')
  },
  eat() {
    console.log(this.name + ' ест')
  }
}

// Создаём dog с прототипом animal
const dog = Object.create(animal)
dog.name = 'Рекс'
dog.bark = function() {
  console.log(this.name + ' говорит: Гав!')
}

dog.bark()    // "Рекс говорит: Гав!"
dog.breathe() // "Рекс дышит" — унаследовано

// Цепочка: dog → animal → Object.prototype → null
Object.getPrototypeOf(dog) === animal // true
```

## Object.create(null) — объект без прототипа

```js
// Чистый объект — без наследования от Object.prototype
const dict = Object.create(null)
dict.key = 'значение'

// Нет toString, hasOwnProperty и прочего
dict.toString // undefined
// Идеально как «словарь» — нет конфликтов с унаследованными ключами
```

## Фабричный паттерн с Object.create

Более идиоматичный подход — фабричная функция, которая создаёт объекты с нужным прототипом:

```js
// Прототип для всех животных
const animalPrototype = {
  speak() {
    console.log(`${this.name} говорит: ${this.sound}`)
  },
  toString() {
    return `[Animal: ${this.name}]`
  }
}

// Фабрика
function createAnimal(name, sound) {
  const animal = Object.create(animalPrototype)
  animal.name = name
  animal.sound = sound
  return animal
}

const cat = createAnimal('Мурка', 'Мяу')
const dog = createAnimal('Рекс', 'Гав')

cat.speak() // "Мурка говорит: Мяу"
dog.speak() // "Рекс говорит: Гав"

// Метод speak НЕ копируется в каждый объект — он один в прототипе
cat.speak === dog.speak // true — одна функция!
```

## hasOwnProperty и Object.hasOwn

Разница между собственными и унаследованными свойствами важна при итерации:

```js
const base = { baseMethod() {} }
const obj = Object.create(base)
obj.ownProp = 42
obj.anotherProp = 'hello'

// Собственные свойства
console.log(Object.keys(obj))              // ["ownProp", "anotherProp"]
console.log(Object.values(obj))            // [42, "hello"]
console.log(Object.entries(obj))           // [["ownProp", 42], ["anotherProp", "hello"]]

// Проверка собственности
Object.hasOwn(obj, 'ownProp')    // true
Object.hasOwn(obj, 'baseMethod') // false

// for...in включает унаследованные
for (const key in obj) console.log(key) // ownProp, anotherProp, baseMethod
```

<Callout type="info">
`Object.hasOwn(obj, key)` — предпочтительный способ проверки собственности в современном коде (ES2022+). Безопаснее чем `obj.hasOwnProperty(key)`, который может быть переопределён.
</Callout>

## Многоуровневое прототипное наследование

```js
const living = {
  isAlive: true,
  breathe() { console.log('дышу') }
}

const animal = Object.create(living)
animal.eat = function() { console.log(this.name + ' ест') }

const dog = Object.create(animal)
dog.name = 'Рекс'
dog.bark = function() { console.log('Гав!') }

// Цепочка: dog → animal → living → Object.prototype → null
dog.bark()    // своё
dog.eat()     // от animal
dog.breathe() // от living
dog.isAlive   // true — от living

// Производительность: длинные цепочки медленнее (поиск по каждому уровню)
```

## Когда использовать Object.create

- Нужно явно управлять прототипом без синтаксиса классов
- Фабричные функции (альтернатива конструкторам)
- `Object.create(null)` — для словарей без наследования
- Реализация паттернов делегирования
