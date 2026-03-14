import { Callout, DeepDive } from '@book/ui'

# var, let, const

До ES6 (2015) в JavaScript был только `var`. Появление `let` и `const` решило множество проблем, которые `var` создавал. Сегодня `var` в новом коде не используется.

## var — функциональный скоуп

`var` ограничен функцией, а не блоком `{}`:

```javascript
function example() {
  if (true) {
    var x = 10; // var видна во всей функции, не только в блоке if
  }
  console.log(x); // 10 — работает, хотя x объявлена внутри if
}

// for с var — классическая ловушка
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3 — не 0, 1, 2!
}
```

### Всплытие (hoisting) var

Объявления `var` поднимаются в начало функции, но не их значения:

```javascript
console.log(a); // undefined — переменная существует, но значение ещё не присвоено
var a = 5;
console.log(a); // 5
```

## let — блочный скоуп

`let` ограничен блоком `{}`:

```javascript
if (true) {
  let blockVar = 'видна только здесь';
}
console.log(blockVar); // ReferenceError: blockVar is not defined

// for с let — каждая итерация получает свою переменную
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2 — правильно!
}
```

## const — константа

`const` — блочный скоуп + нельзя переназначить:

```javascript
const PI = 3.14159;
PI = 3; // TypeError: Assignment to constant variable

// Но объект или массив можно мутировать!
const user = { name: 'Иван' };
user.name = 'Мария'; // OK — мы меняем содержимое, не переменную
user = {}; // TypeError — нельзя переназначить саму переменную
```

<Callout type="tip">
Правило выбора: по умолчанию используйте `const`. Переключайтесь на `let` только если значение переменной изменится. `var` не используйте никогда.
</Callout>

## Temporal Dead Zone (TDZ)

`let` и `const` существуют в TDZ — периоде до их объявления, когда обращение к ним вызывает ошибку:

```javascript
console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 5;

// В отличие от var:
console.log(y); // undefined (не ошибка!)
var y = 5;
```

<DeepDive title="Почему TDZ — это хорошо?">

TDZ кажется ограничением, но это защита от багов. Классическая ошибка с `var`:

```javascript
// Разработчик имел в виду проверку до объявления
function getUserName() {
  if (user) { // undefined — не ошибка, просто falsy
    return user.name;
  }
  var user = getCurrentUser();
  return user.name;
}
```

С `let` та же ошибка сразу бросит `ReferenceError` — баг будет обнаружен немедленно, а не проявится как непонятное поведение в продакшне.

</DeepDive>
