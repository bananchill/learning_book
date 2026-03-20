import { Callout, DeepDive } from '@book/ui'

# Деструктуризация и spread/rest

До ES2015 извлечение значений из объектов и массивов выглядело громоздко: `const name = user.name; const age = user.age; const role = user.role;` — три строки для трёх переменных. **Деструктуризация** решает эту проблему — она позволяет «распаковать» значения из структур данных в переменные одной строкой. **Spread** (`...`) разворачивает структуру в отдельные элементы, а **rest** (`...`) собирает оставшиеся элементы обратно в структуру. Один и тот же синтаксис `...`, но роль определяется контекстом.

## Деструктуризация массивов

В массивах деструктуризация работает **по позиции** — первый элемент попадает в первую переменную, второй — во вторую:

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

В объектах деструктуризация работает **по имени свойства**, а не по позиции. Имя переменной должно совпадать с ключом объекта (или нужно явно задать псевдоним):

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

Деструктуризация особенно мощна в параметрах функций. Вместо принятия объекта целиком и обращения к его свойствам внутри, вы сразу описываете, какие поля ожидаете — это одновременно и документация, и удобство:

```javascript
// Без деструктуризации
function createUser(options) {
  const name = options.name;
  const age = options.age || 18;
  // ...
}

// С деструктуризацией — сразу видно, что функция ожидает
function createUser({ name, age = 18, role = 'user' }) {
  console.log(name, age, role);
}

createUser({ name: 'Иван', age: 25 }); // 'Иван' 25 'user'
```

## Вложенная деструктуризация

Деструктуризация может проникать на любой уровень вложенности. Но будьте осторожны: если промежуточный объект окажется `undefined`, код выбросит `TypeError`. Для безопасности используйте дефолтные значения на каждом уровне или optional chaining:

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

Spread «разворачивает» итерируемый объект (массив, строку, Set) в отдельные элементы. Это самый удобный способ копировать и объединять массивы и объекты. Важный нюанс: spread создаёт **поверхностную копию** (shallow copy) — вложенные объекты копируются по ссылке, а не по значению:

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

// Осторожно: spread — это shallow copy!
const original = { a: 1, nested: { b: 2 } };
const copy = { ...original };
copy.nested.b = 99;
console.log(original.nested.b); // 99 — вложенный объект изменился!
```

## Rest параметры (...)

Rest — это тот же `...`, но в обратной роли: вместо разворачивания он **собирает** оставшиеся элементы в массив. Rest-параметр всегда должен быть последним в списке:

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
