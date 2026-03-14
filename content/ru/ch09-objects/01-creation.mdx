import { Callout, DeepDive } from '@book/ui'

# Создание и доступ к свойствам

## Создание объектов

```javascript
// Объектный литерал — предпочтительный способ
const user = {
  name: 'Иван',
  age: 25,
  'last name': 'Петров',  // ключ с пробелом — в кавычках
};

// Вычисляемые ключи (ES6)
const field = 'email';
const user2 = {
  [field]: 'ivan@example.com',        // ключ из переменной
  [`${field}_verified`]: false,        // динамический ключ
};

// Сокращённые свойства (ES6)
const name = 'Иван';
const age = 25;
const user3 = { name, age }; // вместо { name: name, age: age }
```

## Dot notation и Bracket notation

```javascript
const user = { name: 'Иван', 'last name': 'Петров' };

// Dot notation — простые ключи
user.name          // 'Иван'
user.age           // undefined — нет такого свойства

// Bracket notation — динамические ключи или с пробелами
user['last name']  // 'Петров'
const key = 'name';
user[key]          // 'Иван' — ключ из переменной

// Запись через bracket
user['newProp'] = 42;
```

## Проверка наличия свойства

```javascript
const obj = { a: 1, b: undefined };

// 'key' in obj — проверяет наличие свойства (включая undefined)
'a' in obj          // true
'b' in obj          // true — свойство есть, значение undefined
'c' in obj          // false

// obj.key !== undefined — не надёжно!
obj.b !== undefined // false — свойство есть, но это undefined
obj.c !== undefined // false — свойства нет И оно undefined — не различить!

// Object.hasOwn — только собственные свойства (рекомендуется)
Object.hasOwn(obj, 'a')  // true
Object.hasOwn(obj, 'b')  // true
```

<Callout type="tip">
Используйте `Object.hasOwn(obj, key)` для надёжной проверки — это современный замена `obj.hasOwnProperty(key)`.
</Callout>

## Методы объекта

```javascript
const user = {
  name: 'Иван',
  greet() {
    return `Привет, ${this.name}!`;
  },
  // Эквивалент:
  // greet: function() { ... }
};

user.greet(); // 'Привет, Иван!'
```

<DeepDive title="Object.create — прототипное наследование">

`Object.create(proto)` создаёт объект с указанным прототипом:

```javascript
const animal = {
  speak() {
    return `${this.name} издаёт звук`;
  }
};

const dog = Object.create(animal);
dog.name = 'Бобик';
dog.speak(); // 'Бобик издаёт звук' — метод из прототипа

// {} эквивалентно Object.create(Object.prototype)
```

В современном коде чаще используются классы, но Object.create полезен для создания объектов без прототипа: `Object.create(null)` — объект-словарь без inherited свойств.

</DeepDive>
