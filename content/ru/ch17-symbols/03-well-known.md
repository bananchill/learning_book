import { Callout, DeepDive } from '@book/ui'

# Well-known символы

JavaScript определяет набор встроенных символов, которые управляют внутренним поведением объектов. Эти символы называются well-known (общеизвестными). Они хранятся как статические свойства `Symbol` и позволяют «вмешиваться» в работу встроенных операций языка.

## Symbol.iterator

Символ `Symbol.iterator` делает объект итерируемым — позволяет использовать его в `for...of`, spread-операторе и деструктуризации. Метод по этому ключу должен возвращать объект-итератор с методом `next()`.

Создадим объект-диапазон, по которому можно итерироваться. Метод `[Symbol.iterator]()` возвращает итератор, который на каждом шаге выдаёт следующее число.

```javascript
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

// Теперь объект работает с for...of
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// И со spread
const numbers = [...range]; // [1, 2, 3, 4, 5]
```

## Symbol.toPrimitive

Символ `Symbol.toPrimitive` позволяет объекту самостоятельно решать, как он преобразуется в примитив. Метод получает подсказку (`hint`): `'number'`, `'string'` или `'default'`.

Без этого символа JavaScript использует `valueOf()` и `toString()`. С ним — полный контроль над приведением типов.

```javascript
const money = {
  amount: 100,
  currency: 'RUB',

  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return this.amount; // для математических операций
    }
    if (hint === 'string') {
      return `${this.amount} ${this.currency}`; // для строкового контекста
    }
    // 'default' — для операций вроде + и ==
    return this.amount;
  }
};

console.log(+money);          // 100       (hint: 'number')
console.log(`${money}`);      // '100 RUB' (hint: 'string')
console.log(money + 50);      // 150       (hint: 'default')
```

## Symbol.hasInstance

Символ `Symbol.hasInstance` позволяет переопределить поведение оператора `instanceof`. По умолчанию `instanceof` проверяет цепочку прототипов, но с этим символом можно задать произвольную логику.

```javascript
class EvenNumber {
  static [Symbol.hasInstance](value) {
    return typeof value === 'number' && value % 2 === 0;
  }
}

console.log(2 instanceof EvenNumber);   // true
console.log(3 instanceof EvenNumber);   // false
console.log('4' instanceof EvenNumber); // false — не число
```

## Symbol.species

Символ `Symbol.species` указывает, какой конструктор использовать при создании производных объектов. Это важно для подклассов встроенных типов вроде `Array`.

Когда метод `map()` или `filter()` создаёт новый массив, он смотрит на `Symbol.species`, чтобы решить, какой конструктор вызвать.

```javascript
class PowerArray extends Array {
  // Методы типа map/filter будут возвращать обычный Array
  static get [Symbol.species]() {
    return Array;
  }
}

const arr = new PowerArray(1, 2, 3);
const mapped = arr.map(x => x * 2);

console.log(mapped instanceof PowerArray); // false
console.log(mapped instanceof Array);      // true
```

<Callout type="info">
Well-known символы — это главный механизм расширения поведения объектов в JavaScript. Они дают доступ к внутренним операциям языка без модификации прототипов встроенных типов.
</Callout>

## Таблица well-known символов

Ниже перечислены все основные well-known символы. Каждый из них позволяет настроить определённый аспект поведения объекта.

| Символ | Назначение |
|--------|-----------|
| `Symbol.iterator` | Определяет итератор по умолчанию для `for...of` |
| `Symbol.asyncIterator` | Определяет асинхронный итератор для `for await...of` |
| `Symbol.toPrimitive` | Управляет приведением объекта к примитиву |
| `Symbol.toStringTag` | Настраивает строку, возвращаемую `Object.prototype.toString()` |
| `Symbol.hasInstance` | Переопределяет поведение `instanceof` |
| `Symbol.species` | Указывает конструктор для производных объектов |
| `Symbol.isConcatSpreadable` | Управляет раскрытием при `Array.prototype.concat()` |
| `Symbol.match` | Определяет поведение при `String.prototype.match()` |
| `Symbol.replace` | Определяет поведение при `String.prototype.replace()` |
| `Symbol.search` | Определяет поведение при `String.prototype.search()` |
| `Symbol.split` | Определяет поведение при `String.prototype.split()` |
| `Symbol.unscopables` | Исключает свойства из `with`-окружения |

<DeepDive title="Symbol.toStringTag">

По умолчанию `Object.prototype.toString()` возвращает `[object Object]`. С помощью `Symbol.toStringTag` можно изменить тег, который появляется вместо `Object`.

```javascript
class Validator {
  get [Symbol.toStringTag]() {
    return 'Validator';
  }
}

const v = new Validator();
console.log(Object.prototype.toString.call(v)); // '[object Validator]'
```

Встроенные типы тоже используют этот механизм: `Map` возвращает `[object Map]`, `Promise` — `[object Promise]`. Это полезно для точного определения типа объекта.

</DeepDive>
