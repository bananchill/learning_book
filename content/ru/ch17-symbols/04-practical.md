import { Callout } from '@book/ui'

# Практическое применение

Символы — не просто теоретическая концепция. Они решают конкретные задачи: скрытие деталей реализации, создание уникальных констант и настройка поведения объектов через метапрограммирование.

## Приватные-like ключи

До появления приватных полей (`#field`) символы были основным способом скрыть внутренние свойства объекта. Символьные ключи не появляются в `for...in`, `Object.keys()` и `JSON.stringify()`, что делает их невидимыми для большинства кода.

```javascript
const _balance = Symbol('balance');
const _validate = Symbol('validate');

class Account {
  constructor(initialBalance) {
    this[_balance] = initialBalance;
  }

  [_validate](amount) {
    if (amount <= 0) throw new Error('Сумма должна быть положительной');
    if (amount > this[_balance]) throw new Error('Недостаточно средств');
  }

  withdraw(amount) {
    this[_validate](amount);
    this[_balance] -= amount;
    return this[_balance];
  }

  get balance() {
    return this[_balance];
  }
}

const account = new Account(1000);
console.log(account.balance);      // 1000
console.log(account._balance);     // undefined — строкового ключа нет
console.log(Object.keys(account)); // [] — символы не видны
```

Внешний код не может случайно перезаписать или прочитать символьное свойство, потому что у него нет ссылки на символ. Это обеспечивает достаточный уровень инкапсуляции для большинства задач.

<Callout type="warning">
Символы не обеспечивают настоящую приватность. Метод `Object.getOwnPropertySymbols()` возвращает все символьные ключи объекта. Для истинной приватности используйте приватные поля класса (`#field`), появившиеся в ES2022.
</Callout>

## Уникальные константы

Символы идеально подходят для создания уникальных констант, похожих на enum. В отличие от строк, символы гарантированно не пересекутся со значениями из другого кода.

```javascript
// Со строками — риск коллизии
const STATUS_PENDING = 'pending'; // что если другая библиотека тоже использует 'pending'?

// С символами — уникальность гарантирована
const Status = Object.freeze({
  PENDING:  Symbol('pending'),
  ACTIVE:   Symbol('active'),
  INACTIVE: Symbol('inactive')
});

function setStatus(user, status) {
  if (status === Status.PENDING) {
    console.log('Ожидание активации...');
  } else if (status === Status.ACTIVE) {
    console.log('Пользователь активен');
  }
}

setStatus({}, Status.PENDING); // 'Ожидание активации...'
setStatus({}, 'pending');       // Ничего — строка не равна символу
```

Символьные константы невозможно подделать случайно: даже `Symbol('pending') !== Status.PENDING`. Только явная ссылка на нужный символ позволяет с ним работать.

## Метапрограммирование

Символы дают доступ к внутренним механизмам JavaScript. Комбинируя несколько well-known символов, можно создавать объекты с уникальным поведением, которое полностью интегрируется со встроенными конструкциями языка.

```javascript
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  // Настраиваем приведение типов
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.celsius;
    if (hint === 'string') return `${this.celsius}°C`;
    return this.celsius;
  }

  // Настраиваем вывод типа
  get [Symbol.toStringTag]() {
    return 'Temperature';
  }

  // Делаем итерируемым — выдаёт температуры от 0 до текущей
  [Symbol.iterator]() {
    let current = 0;
    const max = this.celsius;

    return {
      next() {
        if (current <= max) {
          return { value: current++, done: false };
        }
        return { done: true };
      }
    };
  }
}

const temp = new Temperature(3);

// toPrimitive в действии
console.log(+temp);       // 3
console.log(`Сейчас ${temp}`); // 'Сейчас 3°C'

// toStringTag в действии
console.log(Object.prototype.toString.call(temp)); // '[object Temperature]'

// iterator в действии
console.log([...temp]); // [0, 1, 2, 3]
```

Каждый well-known символ отвечает за свой аспект поведения. Комбинируя их, вы создаёте объекты, которые ведут себя как встроенные типы JavaScript — с поддержкой итерации, приведения типов и точного определения типа.
