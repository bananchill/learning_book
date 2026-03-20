import { Callout, DeepDive } from '@book/ui'

# for...of и for...in

Помимо базовых циклов, JavaScript предлагает два специализированных: `for...of` для перебора **значений** коллекций и `for...in` для перебора **ключей** объектов. Они выглядят похоже, но работают принципиально по-разному — и путаница между ними приводит к частым багам.

## for...of — итерация по значениям

`for...of` — самый удобный цикл для перебора массивов, строк, Map, Set и любых итерируемых объектов. В отличие от обычного `for`, не нужно возиться с индексами — вы сразу получаете значения:

```javascript
// Массив
const colors = ['красный', 'зелёный', 'синий'];
for (const color of colors) {
  console.log(color); // 'красный', 'зелёный', 'синий'
}

// Строка — по символам
for (const char of 'hello') {
  console.log(char); // 'h', 'e', 'l', 'l', 'o'
}

// Map — по парам [ключ, значение]
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log(`${key}: ${value}`); // 'a: 1', 'b: 2'
}

// Set — уникальные значения
const set = new Set([1, 2, 3, 2, 1]);
for (const item of set) {
  console.log(item); // 1, 2, 3
}
```

### Индекс в for...of

Если нужен индекс вместе со значением — используйте `entries()`:

```javascript
const fruits = ['яблоко', 'банан', 'вишня'];
for (const [index, fruit] of fruits.entries()) {
  console.log(`${index}: ${fruit}`);
  // 0: яблоко, 1: банан, 2: вишня
}
```

## for...in — итерация по ключам объекта

`for...in` перебирает **перечисляемые** свойства объекта, включая унаследованные от прототипа. Он предназначен для объектов, а не массивов — для массивов используйте `for...of`. При работе с объектами всегда фильтруйте собственные свойства, чтобы не перебирать унаследованные:

```javascript
const user = { name: 'Иван', age: 25, role: 'admin' };

for (const key in user) {
  console.log(`${key}: ${user[key]}`);
  // name: Иван, age: 25, role: admin
}
```

<Callout type="warning">
`for...in` перебирает и унаследованные свойства прототипа! Используйте `hasOwnProperty()` или `Object.keys()` для безопасной итерации.
</Callout>

```javascript
// Безопасный вариант
for (const key in obj) {
  if (Object.hasOwn(obj, key)) { // только собственные свойства
    console.log(key, obj[key]);
  }
}

// Лучше: Object.keys() сразу фильтрует собственные свойства
for (const key of Object.keys(obj)) {
  console.log(key, obj[key]);
}
```

## Главное отличие

| | `for...of` | `for...in` |
|---|---|---|
| Итерирует по | **Значениям** | **Ключам/именам свойств** |
| Работает с | Итерируемыми (Array, String, Map, Set) | Объектами |
| Включает прототип | Нет | Да (нужна проверка) |

```javascript
const arr = ['a', 'b', 'c'];

for (const val of arr) {
  console.log(val);   // 'a', 'b', 'c' — значения
}

for (const key in arr) {
  console.log(key);   // '0', '1', '2' — индексы как строки!
}
```

<DeepDive title="Что делает объект итерируемым?">

Объект итерируем если у него есть метод `Symbol.iterator`. Он должен возвращать итератор — объект с методом `next()`.

```javascript
// Кастомный итерируемый
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        if (current <= last) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
};

for (const n of range) {
  console.log(n); // 1, 2, 3, 4, 5
}
```

</DeepDive>
