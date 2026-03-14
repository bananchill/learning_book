import { Callout, DeepDive } from '@book/ui'

# Стрелочные функции

ES6 стрелочные функции — более краткий синтаксис и особое поведение `this`.

## Синтаксис

```javascript
// Обычная функция
const double = function(x) { return x * 2; };

// Стрелочная функция
const double = (x) => { return x * 2; };

// Краткая форма — без {} и return для одного выражения
const double = x => x * 2;

// Без параметров
const greet = () => 'Привет!';

// Несколько параметров — скобки обязательны
const add = (a, b) => a + b;

// Возврат объекта — оборачиваем в скобки
const makeUser = name => ({ name, createdAt: Date.now() });
```

## this в стрелочных функциях

Ключевое отличие: стрелочные функции **не имеют собственного `this`**. Они захватывают `this` из окружающего лексического контекста:

```javascript
// Проблема с обычной функцией
class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    setInterval(function() {
      this.seconds++; // this = undefined (strict) или window (non-strict)
      console.log(this.seconds); // NaN или ошибка
    }, 1000);
  }
}

// Решение со стрелочной функцией
class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    setInterval(() => {
      this.seconds++; // this = экземпляр Timer (захвачен из start())
      console.log(this.seconds); // 1, 2, 3...
    }, 1000);
  }
}
```

## Когда использовать стрелочные функции

**Используйте для:**
- Коллбеков (`arr.map(x => x * 2)`)
- Коротких выражений
- Функций внутри методов (для правильного `this`)

**Не используйте для:**
- Методов объекта — `this` будет не то
- Конструкторов — нельзя с `new`
- Обработчиков событий где нужен `this = element`
- Функций с `arguments`

```javascript
// Плохо — this будет не тем
const user = {
  name: 'Иван',
  greet: () => `Привет, ${this.name}!` // this = глобальный, не user
};

// Хорошо
const user = {
  name: 'Иван',
  greet() { return `Привет, ${this.name}!`; } // сокращённая запись метода
};
```

<Callout type="info">
Правило: используйте стрелочные функции как функции-значения (коллбеки, замыкания). Используйте обычные функции как методы и конструкторы.
</Callout>

<DeepDive title="Стрелочная функция и prototype">

Стрелочные функции не имеют свойства `prototype`. Это значит, что их нельзя использовать как конструкторы:

```javascript
const Foo = () => {};
new Foo(); // TypeError: Foo is not a constructor
```

Также у стрелочных функций нет `arguments` и они не могут быть генераторами (`function*`).

</DeepDive>
