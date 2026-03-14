import { Callout, DeepDive } from '@book/ui'

# Параметры и аргументы

**Параметры** — переменные в определении функции. **Аргументы** — значения, переданные при вызове.

## Дефолтные параметры (ES6)

```javascript
function greet(name = 'Гость', greeting = 'Привет') {
  return `${greeting}, ${name}!`;
}

greet()               // 'Привет, Гость!'
greet('Иван')         // 'Привет, Иван!'
greet('Иван', 'Здравствуй') // 'Здравствуй, Иван!'
greet(undefined, 'Привет') // 'Привет, Гость!' — undefined триггерит дефолт
greet(null, 'Привет') // 'Привет, null!' — null НЕ триггерит дефолт
```

Дефолты могут использовать предыдущие параметры:

```javascript
function createUser(name, role = 'user', id = `${role}_${Date.now()}`) {
  return { name, role, id };
}
```

## Rest параметры

`...rest` собирает все оставшиеся аргументы в массив:

```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3, 4, 5); // 15
sum();              // 0 — пустой массив

// Комбинация с обычными параметрами
function log(level, ...messages) {
  console.log(`[${level}]`, messages.join(' '));
}
log('INFO', 'Пользователь', 'вошёл');
```

<Callout type="info">
Rest параметр должен быть последним. `function f(a, ...rest, b)` — SyntaxError.
</Callout>

## arguments объект (устаревший)

До ES6 для переменного числа аргументов использовался `arguments`:

```javascript
function sum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
```

`arguments` — не настоящий массив (нет `.map`, `.filter`). Недоступен в стрелочных функциях. Предпочитайте rest-параметры.

## Передача объекта как параметра

Для функций с 3+ параметрами — используйте деструктуризацию:

```javascript
// Плохо — порядок важен, трудно читать при вызове
function createUser(name, email, role, age, isActive) { ... }
createUser('Иван', 'ivan@example.com', 'admin', 25, true);

// Хорошо — именованные параметры
function createUser({ name, email, role = 'user', age, isActive = true }) {
  return { name, email, role, age, isActive };
}
createUser({ name: 'Иван', email: 'ivan@example.com', role: 'admin', age: 25 });
```

<DeepDive title="Передача по значению vs по ссылке">

JavaScript всегда передаёт **по значению**. Но для объектов значением является ссылка:

```javascript
function mutate(obj) {
  obj.x = 42; // Мутируем оригинал через ссылку!
}

function reassign(obj) {
  obj = { x: 42 }; // Переназначаем локальную переменную — оригинал не меняется
}

const o = { x: 1 };
mutate(o);    // o.x === 42 — изменился!
reassign(o);  // o.x === 42 — оригинал не изменился
```

</DeepDive>
