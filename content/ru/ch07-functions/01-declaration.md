import { Callout, DeepDive } from '@book/ui'

# Объявление функций

## Function Declaration

Классическое объявление функции через ключевое слово `function`:

```javascript
function greet(name) {
  return `Привет, ${name}!`;
}

console.log(greet('Иван')); // 'Привет, Иван!'
```

**Особенность:** Function Declaration поднимается (hoisting) — функцию можно вызвать до её объявления в коде:

```javascript
sayHello(); // 'Привет!' — работает до объявления!

function sayHello() {
  console.log('Привет!');
}
```

## Function Expression

Функция, присвоенная переменной:

```javascript
const greet = function(name) {
  return `Привет, ${name}!`;
};

// Именованное выражение функции (NFE)
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1); // fact доступна внутри
};
```

**Отличие от Declaration:** Function Expression НЕ поднимается. Обращение до присваивания — ReferenceError (для `const`/`let`) или TypeError (для `var`):

```javascript
greet(); // TypeError: greet is not a function
var greet = function() { console.log('hi'); };

hello(); // ReferenceError: Cannot access 'hello' before initialization
const hello = function() { console.log('hello'); };
```

## Анонимные и именованные функции

```javascript
// Анонимная функция (нет имени)
const sum = function(a, b) { return a + b; };
sum.name; // 'sum' — V8 выводит имя из переменной

// Именованная функция-выражение
const sum2 = function mySum(a, b) { return a + b; };
sum2.name; // 'mySum'

// В stack trace именованные функции отображаются лучше
```

<Callout type="tip">
Для коллбеков используйте именованные функции — так stack trace при ошибке будет более информативным.
</Callout>

## Функции как значения первого класса

В JavaScript функция — это объект. Её можно передавать, хранить в массиве, возвращать:

```javascript
// Функция как аргумент
[1, 2, 3].map(function double(x) { return x * 2; });

// Функция как возвращаемое значение
function makeMultiplier(n) {
  return function(x) { return x * n; }; // замыкание!
}
const triple = makeMultiplier(3);
triple(5); // 15
```

<DeepDive title="Разница в hoisting — детали">

При Function Declaration движок V8 на этапе парсинга "поднимает" (hoist) всю функцию в память. Поэтому вызов до объявления работает.

При Function Expression поднимается только объявление переменной (для `var` — как `undefined`), но не присваивание. Поэтому:
- `var fn = function(){}` — до присваивания `fn === undefined`
- `let/const fn = function(){}` — до присваивания TDZ

</DeepDive>
