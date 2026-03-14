import { Callout, DeepDive } from '@book/ui'

# Итерационные методы

Итерационные методы — декларативный способ работы с массивами. Каждый принимает коллбек и применяет его к каждому элементу.

## forEach — выполнить для каждого

```javascript
const fruits = ['яблоко', 'банан', 'вишня'];

fruits.forEach((fruit, index, array) => {
  console.log(`${index}: ${fruit}`);
});
// 0: яблоко, 1: банан, 2: вишня
```

**Не возвращает значение (undefined)**. Используйте для побочных эффектов (вывод, запись в DOM).

## map — трансформировать каждый элемент

```javascript
const nums = [1, 2, 3, 4, 5];

const doubled = nums.map(n => n * 2);
// [2, 4, 6, 8, 10]

const strings = nums.map(n => `Число ${n}`);
// ['Число 1', 'Число 2', ...]

// map с объектами
const users = [{ id: 1, name: 'Иван' }, { id: 2, name: 'Мария' }];
const names = users.map(user => user.name); // ['Иван', 'Мария']
const withStatus = users.map(user => ({ ...user, active: true }));
```

## filter — отфильтровать элементы

```javascript
const nums = [1, 2, 3, 4, 5, 6, 7, 8];

const evens = nums.filter(n => n % 2 === 0);
// [2, 4, 6, 8]

const bigNums = nums.filter(n => n > 5);
// [6, 7, 8]

// filter с объектами
const activeUsers = users.filter(user => user.isActive);
const admins = users.filter(user => user.role === 'admin');
```

## reduce — свернуть в одно значение

```javascript
const nums = [1, 2, 3, 4, 5];

// Сумма
const sum = nums.reduce((acc, n) => acc + n, 0); // 15

// Произведение
const product = nums.reduce((acc, n) => acc * n, 1); // 120

// Максимальное значение
const max = nums.reduce((acc, n) => Math.max(acc, n), -Infinity); // 5

// Из массива в объект
const users = [{ id: 1, name: 'Иван' }, { id: 2, name: 'Мария' }];
const byId = users.reduce((map, user) => {
  map[user.id] = user;
  return map;
}, {});
// { 1: {id:1, name:'Иван'}, 2: {id:2, name:'Мария'} }
```

<Callout type="tip">
Начальное значение (второй аргумент reduce) — обязательно при работе с объектами или пустыми массивами.
</Callout>

## find и findIndex — найти первый подходящий

```javascript
const users = [
  { id: 1, name: 'Иван', age: 25 },
  { id: 2, name: 'Мария', age: 30 },
  { id: 3, name: 'Пётр', age: 25 }
];

// find — возвращает первый совпадающий элемент
const ivan = users.find(u => u.name === 'Иван');
// { id: 1, name: 'Иван', age: 25 }

const notFound = users.find(u => u.name === 'Николай');
// undefined

// findIndex — возвращает индекс
const mariaIdx = users.findIndex(u => u.name === 'Мария');
// 1
```

## some и every — проверить условие

```javascript
const nums = [1, 2, 3, 4, 5];

// some — хотя бы один соответствует
nums.some(n => n > 4);    // true — 5 > 4
nums.some(n => n > 10);   // false

// every — все соответствуют
nums.every(n => n > 0);   // true
nums.every(n => n % 2 === 0); // false
```

<DeepDive title="reduce — самый универсальный метод">

Теоретически `reduce` может заменить `map`, `filter`, `find` и другие методы:

```javascript
// map через reduce
const doubled = nums.reduce((acc, n) => [...acc, n * 2], []);

// filter через reduce
const evens = nums.reduce((acc, n) => n % 2 === 0 ? [...acc, n] : acc, []);
```

Но это не значит, что нужно так делать. `map` и `filter` более читаемы. `reduce` используйте когда нужно нестандартное свёртывание — в объект, подсчёт, группировка.

</DeepDive>
