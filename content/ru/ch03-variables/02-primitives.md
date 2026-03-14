import { Callout, DeepDive } from '@book/ui'

# Примитивные типы

В JavaScript 7 примитивных типов. Примитивы — неизменяемые (immutable) значения, которые хранятся непосредственно, а не по ссылке.

## string

Строки в JavaScript — последовательности символов Unicode. Иммутабельны.

```javascript
const greeting = 'Привет';       // одинарные кавычки
const name = "Мир";              // двойные кавычки
const message = `${greeting}, ${name}!`; // шаблонный литерал

// Строки иммутабельны
let str = 'hello';
str[0] = 'H'; // Не работает — строка не изменится
str = 'Hello'; // Это работает — создаётся новая строка
```

## number

JavaScript использует формат IEEE 754 (64-bit floating point) для всех чисел.

```javascript
const integer = 42;
const float = 3.14;
const negative = -7;

// Специальные значения
const infinity = Infinity;
const negInfinity = -Infinity;
const notANumber = NaN;

// NaN — особое значение: не равно даже самому себе
console.log(NaN === NaN); // false
console.log(Number.isNaN(NaN)); // true — правильная проверка

// Проблема точности float
console.log(0.1 + 0.2); // 0.30000000000000004
```

<Callout type="warning">
`0.1 + 0.2 !== 0.3` — это не баг JavaScript, а особенность IEEE 754. Для денег используйте целые числа (копейки) или библиотеку Decimal.
</Callout>

## boolean

Два значения: `true` и `false`.

```javascript
const isActive = true;
const isEmpty = false;
const isAdmin = user.role === 'admin'; // результат сравнения
```

## null

`null` означает намеренное отсутствие значения — разработчик явно сказал "здесь пусто".

```javascript
let selectedUser = null; // пользователь ещё не выбран

// null — это примитив, но typeof возвращает 'object' (исторический баг)
typeof null; // 'object' — известный баг JavaScript, не исправлен для обратной совместимости
```

## undefined

`undefined` — переменная объявлена, но значение не присвоено.

```javascript
let uninitialised; // undefined — JS автоматически
console.log(uninitialised); // undefined

function greet(name) {
  // name будет undefined если аргумент не передан
  console.log(name);
}
greet(); // undefined
```

## symbol (ES6)

Symbol — уникальный идентификатор. Два символа с одинаковым описанием НЕ равны.

```javascript
const id1 = Symbol('id');
const id2 = Symbol('id');
console.log(id1 === id2); // false — каждый Symbol уникален

// Применение: уникальные ключи объекта
const ID = Symbol('userId');
const user = {
  name: 'Иван',
  [ID]: 42 // символьный ключ не отображается в for...in
};
```

## bigint (ES2020)

BigInt для чисел, превышающих `Number.MAX_SAFE_INTEGER` (2^53 - 1).

```javascript
const big = 9007199254740991n; // суффикс n
const sum = big + 1n; // 9007199254740992n

// Нельзя смешивать number и bigint
42 + 1n; // TypeError
Number(42n) + 1; // 43 — явное приведение
```

<DeepDive title="Почему null — примитив, но typeof возвращает object?">

Это исторический баг JavaScript из 1995 года. В первой реализации движка значения хранились с тегом типа в первых битах. Тег для объектов был `000`. Значение `null` представлялось как нулевой указатель — тоже `000`. Поэтому `typeof null` вернул `'object'`.

Баг был обнаружен быстро, но к тому времени уже существовал код, который полагался на `typeof null === 'object'`. Исправление сломало бы миллионы сайтов. Баг остался в спецификации навсегда.

</DeepDive>
