---
title: "Шпаргалка: Прототипы и наследование"
---

## Прототипная цепочка

```
obj → Object.prototype → null
arr → Array.prototype → Object.prototype → null
fn  → Function.prototype → Object.prototype → null
```

## Основные методы

```js
// Получить прототип
Object.getPrototypeOf(obj)

// Создать объект с прототипом
const child = Object.create(parent)

// Проверить собственность свойства (ES2022)
Object.hasOwn(obj, 'key')

// Собственные enumerable ключи (без прототипа)
Object.keys(obj)
```

## Классы

```js
class Animal {
  #private = 0           // приватное поле
  static count = 0       // статическое свойство

  constructor(name) {
    this.name = name     // собственное свойство
  }

  speak() { /* в Animal.prototype */ }
  get info() { return this.name }
}

class Dog extends Animal {
  constructor(name) {
    super(name)          // ОБЯЗАТЕЛЕН до this
  }

  speak() {
    super.speak()        // вызов метода родителя
  }
}
```

## instanceof vs hasOwnProperty

```js
dog instanceof Dog      // проверяет цепочку прототипов
dog instanceof Animal   // тоже true (Dog extends Animal)

dog.hasOwnProperty('name') // только собственные свойства
Object.hasOwn(dog, 'name') // ES2022, предпочтительно

// Надёжнее instanceof:
Array.isArray(arr)
Object.prototype.toString.call(x) === '[object Array]'
```

## Что НЕ делать

```js
// НИКОГДА не делай:
Object.prototype.myMethod = function() {}  // отравляет все объекты

// НЕ злоупотребляй:
obj.__proto__ = newProto  // устаревший способ, используй setPrototypeOf

// ОСТОРОЖНО:
obj instanceof MyClass  // может врать при смене прототипа
```
