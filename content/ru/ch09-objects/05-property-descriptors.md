import { Callout, DeepDive } from '@book/ui'

# Дескрипторы свойств

Каждое свойство объекта — это не просто пара «ключ-значение». За кулисами у него есть скрытые атрибуты, которые управляют его поведением: можно ли перезаписать, удалить или увидеть в цикле.

## Что такое дескриптор свойства

Дескриптор — это объект, описывающий характеристики свойства. У обычных свойств есть четыре атрибута: `value`, `writable`, `enumerable` и `configurable`. Метод `Object.getOwnPropertyDescriptor` позволяет их увидеть.

```javascript
const user = { name: 'Иван', age: 25 };

const descriptor = Object.getOwnPropertyDescriptor(user, 'name');
console.log(descriptor);
// {
//   value: 'Иван',
//   writable: true,      — можно менять значение
//   enumerable: true,     — видно в for...in и Object.keys
//   configurable: true    — можно удалять и переопределять
// }
```

Когда вы создаёте свойство обычным присваиванием, все флаги по умолчанию `true`. Но через `Object.defineProperty` значения по умолчанию — `false`.

## Object.defineProperty

Этот метод позволяет создать свойство с точным контролем над его поведением. Каждый флаг управляет конкретным аспектом: `writable` запрещает изменение значения, `enumerable` скрывает свойство из перечисления, `configurable` блокирует удаление и переопределение.

```javascript
const product = {};

Object.defineProperty(product, 'id', {
  value: 42,
  writable: false,       // нельзя менять
  enumerable: true,
  configurable: false     // нельзя удалить или переопределить
});

product.id = 100;         // Молча игнорируется (TypeError в strict mode)
console.log(product.id);  // 42

delete product.id;        // Молча игнорируется
console.log(product.id);  // 42
```

```javascript
const settings = {};

// enumerable: false — свойство скрыто от перечисления
Object.defineProperty(settings, '_internal', {
  value: 'секрет',
  enumerable: false
});

settings.visible = 'видно';

console.log(Object.keys(settings));    // ['visible'] — _internal не видно
console.log(settings._internal);       // 'секрет' — но доступ напрямую работает
```

Для определения нескольких свойств сразу есть `Object.defineProperties`:

```javascript
const item = {};

Object.defineProperties(item, {
  name: { value: 'Книга', writable: true, enumerable: true, configurable: true },
  price: { value: 500, writable: false, enumerable: true, configurable: false }
});
```

<Callout type="warning">
Если `configurable: false`, свойство нельзя переопределить через повторный `defineProperty` (кроме смены `writable` с `true` на `false`). Это необратимая операция — будьте внимательны.
</Callout>

## Геттеры и сеттеры

Свойства-аксессоры не хранят значение напрямую — вместо `value`/`writable` у них `get` и `set`. Геттер вызывается при чтении свойства, сеттер — при записи. Это удобно для вычисляемых значений, валидации и логирования.

```javascript
const user = {
  firstName: 'Иван',
  lastName: 'Петров',

  // Сокращённый синтаксис в литерале объекта
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  set fullName(value) {
    const parts = value.split(' ');
    this.firstName = parts[0];
    this.lastName = parts[1];
  }
};

console.log(user.fullName);   // 'Иван Петров' — вызвался геттер
user.fullName = 'Мария Сидорова'; // вызвался сеттер
console.log(user.firstName);  // 'Мария'
```

```javascript
// Валидация через сеттер с помощью defineProperty
const account = { _balance: 0 };

Object.defineProperty(account, 'balance', {
  get() {
    return this._balance;
  },
  set(value) {
    if (value < 0) {
      throw new Error('Баланс не может быть отрицательным');
    }
    this._balance = value;
  },
  enumerable: true,
  configurable: true
});

account.balance = 100;
console.log(account.balance); // 100
account.balance = -50;        // Error: Баланс не может быть отрицательным
```

<Callout type="info">
Свойство не может быть одновременно аксессором и свойством данных. Если указаны `get`/`set`, нельзя указывать `value`/`writable` — и наоборот.
</Callout>

## Защита объектов

JavaScript предоставляет три уровня защиты объекта от изменений. Каждый следующий уровень строже предыдущего. Все три метода работают поверхностно — вложенные объекты не затрагиваются.

```javascript
// Object.preventExtensions — нельзя добавлять новые свойства
const obj1 = { a: 1 };
Object.preventExtensions(obj1);
obj1.b = 2;          // Молча игнорируется
obj1.a = 10;         // Работает — существующие свойства можно менять
delete obj1.a;       // Работает — можно удалять

// Object.seal — нельзя добавлять и удалять, все свойства non-configurable
const obj2 = { a: 1 };
Object.seal(obj2);
obj2.b = 2;          // Молча игнорируется
obj2.a = 10;         // Работает — значения менять можно
delete obj2.a;       // Молча игнорируется — удалять нельзя

// Object.freeze — полная заморозка, нельзя ничего
const obj3 = { a: 1 };
Object.freeze(obj3);
obj3.b = 2;          // Молча игнорируется
obj3.a = 10;         // Молча игнорируется
delete obj3.a;       // Молча игнорируется
```

| Метод | Новые свойства | Удаление | Изменение значений | configurable |
|---|---|---|---|---|
| `preventExtensions` | Нет | Да | Да | Не меняет |
| `seal` | Нет | Нет | Да | `false` |
| `freeze` | Нет | Нет | Нет | `false` |

Для проверки состояния объекта используйте `Object.isExtensible()`, `Object.isSealed()` и `Object.isFrozen()`.

<DeepDive title="Object.getOwnPropertyDescriptors и полное копирование">

Оператор spread `{...obj}` и `Object.assign` копируют только значения свойств. Если в объекте есть геттеры и сеттеры, они вызываются при копировании, а в результате получается обычное свойство с вычисленным значением:

```javascript
const original = {
  _name: 'Иван',
  get name() { return this._name.toUpperCase(); }
};

const copy = { ...original };
console.log(Object.getOwnPropertyDescriptor(copy, 'name'));
// { value: 'ИВАН', writable: true, ... } — геттер потерян!

// Полное копирование с сохранением дескрипторов
const fullCopy = Object.create(
  Object.getPrototypeOf(original),
  Object.getOwnPropertyDescriptors(original)
);
console.log(Object.getOwnPropertyDescriptor(fullCopy, 'name'));
// { get: [Function], set: undefined, ... } — геттер сохранён ✓
```

`Object.getOwnPropertyDescriptors` возвращает все дескрипторы сразу — это единственный надёжный способ скопировать объект вместе с аксессорами и флагами свойств.

</DeepDive>
