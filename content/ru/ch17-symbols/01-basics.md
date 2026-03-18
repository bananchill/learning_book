import { Callout, DeepDive } from '@book/ui'

# Что такое Symbol

Symbol — примитивный тип данных, появившийся в ES2015. Каждый символ уникален и неизменяем. Два вызова `Symbol()` никогда не дают одинаковое значение, даже если передать одинаковое описание.

## Создание символов

Символ создаётся вызовом функции `Symbol()`. Необязательный строковый аргумент — это описание, которое используется только для отладки и никак не влияет на уникальность символа.

```javascript
const sym1 = Symbol();
const sym2 = Symbol('описание');

console.log(typeof sym1); // 'symbol'
console.log(sym2);        // Symbol(описание)
console.log(sym2.toString()); // 'Symbol(описание)'
```

Оператор `typeof` возвращает `'symbol'` — это отдельный примитивный тип, наравне с `string`, `number` и `boolean`.

## Уникальность

Главное свойство символов — абсолютная уникальность. Даже символы с одинаковым описанием не равны друг другу. Описание — просто метка для разработчика, а не идентификатор.

```javascript
const a = Symbol('id');
const b = Symbol('id');

console.log(a === b); // false — всегда разные
console.log(a == b);  // false — даже нестрогое сравнение
```

Это кардинально отличает символы от строк: `'id' === 'id'` даёт `true`, а `Symbol('id') === Symbol('id')` — всегда `false`.

## Символы как ключи объектов

Символы можно использовать как ключи свойств объекта. Такие свойства невидимы для стандартных методов перечисления — они не появляются в `for...in`, `Object.keys()` и `JSON.stringify()`.

```javascript
const id = Symbol('userId');
const user = {
  name: 'Иван',
  [id]: 42 // квадратные скобки обязательны
};

console.log(user[id]); // 42
console.log(user.id);  // undefined — точечная нотация не работает

// Символьные ключи не видны стандартным методам
console.log(Object.keys(user));           // ['name']
console.log(JSON.stringify(user));         // '{"name":"Иван"}'

for (const key in user) {
  console.log(key); // 'name' — символ не выводится
}
```

Для доступа к символьным свойствам существует специальный метод `Object.getOwnPropertySymbols()`. Он возвращает массив всех символьных ключей объекта.

```javascript
const symbols = Object.getOwnPropertySymbols(user);
console.log(symbols);        // [Symbol(userId)]
console.log(user[symbols[0]]); // 42
```

<Callout type="warning">
`Symbol` — это НЕ конструктор. Вызов `new Symbol()` выбрасывает `TypeError`. Символы — примитивы, как числа или строки. Создавайте их только через `Symbol()` без `new`.
</Callout>

<DeepDive title="Symbol.prototype.description">

До ES2019 единственным способом получить описание символа было преобразование в строку и парсинг: `String(sym).slice(7, -1)`. Начиная с ES2019 доступно свойство `description`, которое возвращает описание напрямую.

```javascript
const sym = Symbol('моё описание');

// ES2019+
console.log(sym.description); // 'моё описание'

// Символ без описания
const empty = Symbol();
console.log(empty.description); // undefined
```

Свойство `description` доступно только для чтения. Оно возвращает `undefined`, если описание не было передано при создании символа, и пустую строку, если было передано `Symbol('')`.

</DeepDive>
