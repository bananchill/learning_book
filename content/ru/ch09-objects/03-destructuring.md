import { Callout, DeepDive } from '@book/ui'

# Деструктуризация объектов

Деструктуризация извлекает свойства объекта в именованные переменные — элегантнее, чем многократное обращение к полям.

## Базовая деструктуризация

```javascript
const user = { name: 'Иван', age: 25, role: 'admin' };

// Классический способ
const name = user.name;
const age = user.age;

// Деструктуризация
const { name, age } = user;
// name === 'Иван', age === 25
```

## Переименование

```javascript
const { name: userName, age: userAge } = user;
// userName === 'Иван', userAge === 25
// Переменных name и age не создаётся
```

## Дефолтные значения

```javascript
const { name = 'Аноним', role = 'user', active = true } = user;
// Дефолт применяется только если значение === undefined
// role = 'admin' (есть в объекте), active = true (дефолт — нет в объекте)

// Совмещение переименования и дефолта
const { name: displayName = 'Гость' } = user;
```

## Вложенная деструктуризация

```javascript
const config = {
  server: {
    host: 'localhost',
    port: 3000,
    ssl: false
  },
  database: {
    host: 'db.local',
    name: 'mydb'
  }
};

// Вложенная деструктуризация
const { server: { host, port }, database: { name: dbName } } = config;
// host = 'localhost', port = 3000, dbName = 'mydb'
// server и database — не создаются как переменные
```

<Callout type="warning">
При вложенной деструктуризации `server` — это не переменная, а паттерн. `console.log(server)` даст ReferenceError.
</Callout>

## Rest в деструктуризации

```javascript
const user = { id: 1, name: 'Иван', age: 25, role: 'admin', email: 'i@i.com' };

const { id, name, ...rest } = user;
// id = 1, name = 'Иван'
// rest = { age: 25, role: 'admin', email: 'i@i.com' }
```

## Деструктуризация в параметрах функции

```javascript
// Без деструктуризации
function greet(user) {
  return `Привет, ${user.name}! Роль: ${user.role}`;
}

// С деструктуризацией — ясно что нужно функции
function greet({ name, role = 'пользователь' }) {
  return `Привет, ${name}! Роль: ${role}`;
}
greet({ name: 'Иван', role: 'admin' });
greet({ name: 'Мария' }); // role = 'пользователь' по умолчанию
```

<DeepDive title="Деструктуризация при обмене переменных">

Хотя деструктуризация объектов не используется для swap (в отличие от массивов), с массивами это элегантно:

```javascript
let a = 1, b = 2;
[a, b] = [b, a]; // swap без временной переменной
// a = 2, b = 1
```

</DeepDive>
