import { Callout, DeepDive } from '@book/ui'

# Объект arguments

`arguments` — специальный массивоподобный объект, доступный внутри обычных функций. Он содержит все переданные аргументы, независимо от того, сколько параметров объявлено.

## Что такое arguments

Внутри каждой обычной функции автоматически создаётся объект `arguments`. Он похож на массив — имеет числовые индексы и свойство `.length`, но настоящим массивом не является.

```javascript
function showArgs(a, b) {
  console.log(arguments[0]); // 1
  console.log(arguments[1]); // 2
  console.log(arguments[2]); // 3 — нет параметра, но аргумент доступен
  console.log(arguments.length); // 3
}

showArgs(1, 2, 3);

// arguments — не массив!
function tryArrayMethod() {
  // arguments.map(x => x * 2); // TypeError: arguments.map is not a function
  console.log(Array.isArray(arguments)); // false
}
```

## arguments vs rest-параметры

Rest-параметры (`...args`) — это современная замена `arguments`. Главное отличие: rest-параметры дают настоящий массив со всеми методами.

```javascript
// Старый способ — arguments
function sumOld() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

// Современный способ — rest-параметры
function sumNew(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

sumOld(1, 2, 3);  // 6
sumNew(1, 2, 3);  // 6
```

<Callout type="tip">
Всегда используйте rest-параметры (`...args`) вместо `arguments` в новом коде. Это чище, понятнее и даёт настоящий массив.
</Callout>

## Преобразование arguments в массив

Если вы работаете с legacy-кодом, где уже используется `arguments`, его можно преобразовать в настоящий массив тремя способами.

```javascript
function example() {
  // Современные способы
  const arr1 = Array.from(arguments);
  const arr2 = [...arguments];

  // Старый способ (до ES6)
  const arr3 = Array.prototype.slice.call(arguments);

  // Теперь можно использовать методы массива
  return arr1.filter(x => x > 2);
}

example(1, 2, 3, 4); // [3, 4]
```

## Когда arguments всё ещё полезен

В современном JavaScript практических причин использовать `arguments` почти нет. Вы встретите его в старом коде и библиотеках, написанных до ES6.

```javascript
// Legacy-код: перенаправление всех аргументов в другую функцию
function legacyWrapper() {
  // arguments.callee — ссылка на саму функцию (DEPRECATED)
  // Запрещён в strict mode, не используйте
  return originalFunction.apply(this, arguments);
}

// Современный эквивалент — гораздо проще
function modernWrapper(...args) {
  return originalFunction(...args);
}
```

<Callout type="warning">
Стрелочные функции **не имеют** собственного `arguments`. Они наследуют его из внешней обычной функции. Если `arguments` нужен — используйте rest-параметры или `function`.
</Callout>

<DeepDive title="arguments и строгий режим">

В нестрогом режиме `arguments` связан с именованными параметрами — изменение одного меняет другое. В строгом режиме эта связь разорвана:

```javascript
// Нестрогий режим — связь между arguments и параметрами
function sloppy(a) {
  arguments[0] = 99;
  console.log(a); // 99 — a тоже изменился!
}

// Строгий режим — связи нет
function strict(a) {
  'use strict';
  arguments[0] = 99;
  console.log(a); // исходное значение — a не изменился
}
```

Это одна из причин, почему строгий режим рекомендован — поведение предсказуемее.

</DeepDive>
