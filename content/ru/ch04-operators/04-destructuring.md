import { Callout, DeepDive } from '@book/ui'

# Деструктуризация и spread/rest

Деструктуризация позволяет "распаковать" значения из массивов и объектов в переменные. Spread и rest — оператор `...` с разными ролями.

## Деструктуризация массивов

```javascript
const [a, b, c] = [1, 2, 3];
console.log(a); // 1
console.log(b); // 2

// Пропуск элементов
const [first, , third] = [1, 2, 3];
console.log(third); // 3

// Значения по умолчанию
const [x = 0, y = 0] = [5];
console.log(x); // 5
console.log(y); // 0 — дефолт

// Swap переменных без временной
let m = 1, n = 2;
[m, n] = [n, m];  // m = 2, n = 1

// Rest в массиве
const [head, ...tail] = [1, 2, 3, 4];
console.log(head); // 1
console.log(tail); // [2, 3, 4]
```

## Деструктуризация объектов

```javascript
const user = { name: 'Иван', age: 25, role: 'admin' };

// Базовая деструктуризация
const { name, age } = user;

// Переименование
const { name: userName, age: userAge } = user;
console.log(userName); // 'Иван'

// Дефолтные значения
const { role = 'user', active = true } = user;
console.log(role);   // 'admin' — есть в объекте
console.log(active); // true — дефолт, нет в объекте

// Rest в объекте
const { name: n, ...rest } = user;
console.log(rest); // { age: 25, role: 'admin' }
```

<Callout type="tip">
Деструктуризация в параметрах функции — отличный способ документировать ожидаемую форму аргумента.
</Callout>

## Вложенная деструктуризация

```javascript
const config = {
  server: {
    host: 'localhost',
    port: 3000
  },
  db: {
    name: 'mydb'
  }
};

// Вложенная деструктуризация
const { server: { host, port }, db: { name: dbName } } = config;
console.log(host);   // 'localhost'
console.log(port);   // 3000
console.log(dbName); // 'mydb'
```

## Spread оператор (...)

Spread "разворачивает" итерируемое в отдельные элементы:

```javascript
// В массивах
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
const copy = [...arr1];              // Поверхностная копия

// В объектах
const defaults = { color: 'blue', size: 'medium' };
const custom = { ...defaults, color: 'red' }; // { color: 'red', size: 'medium' }

// В вызовах функций
const nums = [3, 1, 4, 1, 5];
Math.max(...nums); // 5
```

## Rest параметры (...)

Rest собирает оставшиеся аргументы функции в массив:

```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4);  // 10

// Первые аргументы фиксированные, остальные — rest
function log(level, ...messages) {
  console.log(`[${level}]`, ...messages);
}
log('ERROR', 'Файл не найден', 'path:', '/etc/config');
// [ERROR] Файл не найден path: /etc/config
```

<Callout type="info">
Метод `reduce` подробно рассмотрен в [главе Массивы](/frontend/javascript/ch08-arrays/02-iteration).
</Callout>

<DeepDive title="Spread в функциях vs Array.from">

`Math.max(...arr)` работает только для небольших массивов — слишком большой массив вызовет `RangeError: Maximum call stack size exceeded`.

Для больших массивов используйте методы самого массива:

```javascript
const max = nums.reduce((a, b) => Math.max(a, b), -Infinity);
// или
const max = Math.max(...nums); // безопасно до ~100 000 элементов
```

</DeepDive>
