---
title: "Object.create и прототипное наследование"
---

import { Callout, DeepDive } from '@book/ui'

## Зачем нужен Object.create

В предыдущей подглаве мы видели, как `Object.setPrototypeOf()` устанавливает прототип уже существующего объекта. Но это неэффективно — V8 вынужден перестраивать внутренние структуры объекта.

`Object.create(proto)` решает задачу иначе: он **создаёт новый пустой объект** и сразу назначает ему нужный прототип. Это самый явный и чистый способ работы с прототипами.

```js
const animal = {
  breathe() {
    console.log(this.name + ' дышит')
  },
  eat() {
    console.log(this.name + ' ест')
  }
}

// Object.create создаёт новый объект, чей прототип — animal
const dog = Object.create(animal)
```

Что произошло? `dog` — это пустой объект `{}`, но его внутренняя ссылка `[[Prototype]]` указывает на `animal`. Поэтому `dog` может пользоваться методами `animal`, как будто они его собственные:

```js
dog.name = 'Рекс'
dog.bark = function() {
  console.log(this.name + ' говорит: Гав!')
}

dog.bark()    // "Рекс говорит: Гав!" — собственный метод
dog.breathe() // "Рекс дышит" — метод из прототипа (animal)
dog.eat()     // "Рекс ест" — тоже из прототипа

// Проверяем цепочку
Object.getPrototypeOf(dog) === animal // true
```

Ключевой момент: метод `breathe` **не копируется** в `dog`. Он остаётся в `animal`. Когда мы вызываем `dog.breathe()`, JavaScript:

1. Ищет `breathe` в самом `dog` — не находит
2. Идёт по ссылке `[[Prototype]]` к `animal` — находит
3. Вызывает `animal.breathe()`, но `this` указывает на `dog` (потому что вызов был через `dog`)

## Object.create(null) — объект без прототипа

Обычно все объекты наследуют от `Object.prototype` — именно поэтому у каждого `{}` есть `toString()`, `hasOwnProperty()` и другие встроенные методы. Но иногда это мешает.

`Object.create(null)` создаёт объект **вообще без прототипа** — чистый словарь, в котором нет ничего, кроме того, что вы сами туда положите:

```js
const dict = Object.create(null)
dict.key = 'значение'

console.log(dict.key)      // "значение"
console.log(dict.toString) // undefined — нет toString!
console.log('key' in dict) // true
```

Зачем это нужно? Представьте, что вы храните данные, где ключи приходят от пользователя. Если использовать обычный объект `{}`, ключ `"toString"` или `"constructor"` **перезапишет** одноимённый унаследованный метод:

```js
// Опасно: обычный объект
const cache = {}
cache['toString'] = 'какое-то значение'
cache.toString() // TypeError: cache.toString is not a function!

// Безопасно: Object.create(null)
const safeCache = Object.create(null)
safeCache['toString'] = 'какое-то значение'
// Никаких конфликтов — у safeCache нет унаследованных методов
```

<Callout type="tip">
Используйте `Object.create(null)` когда создаёте словарь (lookup-таблицу), куда ключи приходят извне. В современном коде для этого чаще используют `Map`, но `Object.create(null)` по-прежнему встречается в библиотеках и конфигурациях.
</Callout>

## Фабричный паттерн

Вручную создавать объект через `Object.create` и добавлять свойства по одному — утомительно. На практике используют **фабричную функцию** — обычную функцию, которая создаёт и возвращает готовый объект:

```js
// Шаг 1: определяем общие методы в отдельном объекте-прототипе
const animalProto = {
  speak() {
    console.log(`${this.name} говорит: ${this.sound}`)
  },
  toString() {
    return `[Animal: ${this.name}]`
  }
}

// Шаг 2: фабричная функция создаёт экземпляры
function createAnimal(name, sound) {
  const animal = Object.create(animalProto) // создаём объект с нужным прототипом
  animal.name = name   // записываем собственные свойства
  animal.sound = sound
  return animal
}

// Шаг 3: используем
const cat = createAnimal('Мурка', 'Мяу')
const dog = createAnimal('Рекс', 'Гав')

cat.speak() // "Мурка говорит: Мяу"
dog.speak() // "Рекс говорит: Гав"
```

Почему это хорошо? Метод `speak` существует **в единственном экземпляре** — в объекте `animalProto`. Все животные разделяют его через прототипную цепочку. Это экономит память: неважно, сколько объектов вы создадите — метод один:

```js
cat.speak === dog.speak // true — это буквально одна и та же функция
```

## Второй аргумент Object.create

`Object.create` принимает необязательный второй аргумент — объект с **дескрипторами свойств**. Это позволяет создать объект и сразу задать ему свойства с тонкой настройкой:

```js
const dog = Object.create(animalProto, {
  name: {
    value: 'Рекс',
    writable: true,     // можно ли менять значение
    enumerable: true,   // видно ли в for...in и Object.keys
    configurable: true, // можно ли удалить или поменять настройки
  },
  sound: {
    value: 'Гав',
    writable: true,
    enumerable: true,
    configurable: true,
  }
})

dog.speak() // "Рекс говорит: Гав"
```

На практике этот синтаксис используют редко — он слишком многословный. Фабричная функция или класс удобнее.

## Многоуровневое наследование

С помощью `Object.create` можно строить цепочки из нескольких уровней. Каждый уровень добавляет свои методы, а объект на конце цепочки имеет доступ ко всем:

```js
// Уровень 1: всё живое
const living = {
  isAlive: true,
  breathe() {
    console.log(this.name + ' дышит')
  }
}

// Уровень 2: животные (наследуют от living)
const animal = Object.create(living)
animal.eat = function() {
  console.log(this.name + ' ест')
}

// Уровень 3: конкретное животное (наследует от animal)
const dog = Object.create(animal)
dog.name = 'Рекс'
dog.bark = function() {
  console.log(this.name + ' говорит: Гав!')
}

// dog имеет доступ ко всем уровням цепочки:
dog.bark()    // "Рекс говорит: Гав!" — собственный метод
dog.eat()     // "Рекс ест"           — от animal
dog.breathe() // "Рекс дышит"         — от living
dog.isAlive   // true                  — от living
```

Цепочка прототипов: `dog → animal → living → Object.prototype → null`. При вызове метода JavaScript проходит по этой цепочке сверху вниз, пока не найдёт нужное свойство.

<Callout type="warning">
Не стройте длинные цепочки (больше 2–3 уровней). Каждый уровень — это дополнительный поиск. Кроме того, глубокие иерархии сложно отлаживать и поддерживать. Предпочитайте композицию — подробнее об этом в подглаве «Антипаттерны».
</Callout>

## Переопределение методов (shadowing)

Если в объекте и его прототипе есть свойство с одинаковым именем, побеждает собственное свойство — оно «затеняет» (shadow) прототипное:

```js
const base = {
  greet() {
    return 'Привет от base'
  }
}

const child = Object.create(base)
child.greet = function() {
  return 'Привет от child'
}

child.greet() // "Привет от child" — собственный метод затенил прототипный
delete child.greet
child.greet() // "Привет от base" — теперь виден прототипный
```

Это позволяет «переопределять» поведение для конкретного объекта, не трогая прототип. Все остальные объекты, наследующие от `base`, продолжат использовать оригинальный метод.

## Когда использовать Object.create

| Сценарий | Подходит ли Object.create |
|----------|--------------------------|
| Явное управление прототипом | Да — самый прозрачный способ |
| Фабричные функции | Да — альтернатива классам |
| Чистый словарь без наследования | `Object.create(null)` |
| Клонирование с сохранением прототипа | Да — через `Object.create(Object.getPrototypeOf(obj))` |
| Повседневный код с наследованием | Классы удобнее — см. следующую подглаву |

<DeepDive title="Object.create vs new — что происходит внутри">

`new Constructor()` и `Object.create(Constructor.prototype)` делают похожие вещи, но не идентичные:

```js
function Dog(name) { this.name = name }
Dog.prototype.bark = function() { console.log('Гав!') }

// new Dog('Рекс') делает:
// 1. Создаёт пустой объект
// 2. Ставит его [[Prototype]] = Dog.prototype
// 3. Вызывает Dog.call(obj, 'Рекс') — конструктор записывает свойства
// 4. Возвращает объект

// Object.create(Dog.prototype) делает:
// 1. Создаёт пустой объект
// 2. Ставит его [[Prototype]] = Dog.prototype
// 3. Возвращает объект (конструктор НЕ вызывается!)

const a = new Dog('Рекс')
a.name // "Рекс"
a.bark() // "Гав!"

const b = Object.create(Dog.prototype)
b.name // undefined — конструктор не вызывался
b.bark() // "Гав!" — прототип тот же
```

</DeepDive>
