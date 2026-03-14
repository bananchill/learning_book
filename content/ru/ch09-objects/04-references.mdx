import { Callout, DeepDive, CrossLink } from '@book/ui'

# Ссылки и копирование объектов

Примитивы хранятся по значению — объекты по ссылке. Это различие порождает неожиданное поведение при копировании и сравнении.

## Значение vs ссылка

```javascript
// Примитивы — копируются по значению
let a = 5;
let b = a;
b = 10;
console.log(a); // 5 — не изменилось

// Объекты — копируются по ссылке
const user = { name: 'Иван' };
const copy = user; // copy указывает на ТОТ ЖЕ объект
copy.name = 'Мария';
console.log(user.name); // 'Мария' — изменилось!
```

`copy` и `user` — это две переменные, но обе указывают на один объект в памяти.

## Сравнение объектов

```javascript
const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log(a === b); // false — разные объекты, хотя содержимое одинаково
console.log(a === c); // true  — одна и та же ссылка
```

<Callout type="info">
Два объекта равны `===` только если они — один и тот же объект (одна ссылка). Для сравнения содержимого нужна ручная проверка или `JSON.stringify` (с ограничениями).
</Callout>

## Поверхностное копирование

Создаёт новый объект, но вложенные объекты всё ещё передаются по ссылке.

```javascript
const original = {
  name: 'Иван',
  address: { city: 'Москва' }
};

// Способ 1: spread
const shallow1 = { ...original };

// Способ 2: Object.assign
const shallow2 = Object.assign({}, original);

// Поверхностные свойства скопированы
shallow1.name = 'Мария';
console.log(original.name); // 'Иван' — не изменилось ✓

// Вложенные объекты — всё ещё ссылки
shallow1.address.city = 'Питер';
console.log(original.address.city); // 'Питер' — изменилось! ✗
```

## Глубокое копирование

Копирует весь граф объекта, включая вложенные объекты.

### structuredClone (современный стандарт)

```javascript
const original = {
  name: 'Иван',
  address: { city: 'Москва' },
  tags: ['js', 'ts'],
  createdAt: new Date()
};

const deep = structuredClone(original);

deep.address.city = 'Питер';
console.log(original.address.city); // 'Москва' ✓

deep.tags.push('vue');
console.log(original.tags); // ['js', 'ts'] ✓

// Поддерживает Date, Map, Set, ArrayBuffer и другие
console.log(deep.createdAt instanceof Date); // true ✓
```

### JSON.parse/JSON.stringify (старый способ)

```javascript
const deep = JSON.parse(JSON.stringify(original));
// Ограничения:
// — теряет Date (становится строкой)
// — теряет undefined
// — теряет функции
// — не работает с циклическими ссылками
```

<Callout type="warning">
`structuredClone` не поддерживает функции, DOM-узлы и объекты с прототипами (классы). Для таких случаев — библиотека `lodash.cloneDeep`.
</Callout>

## Заморозка объектов

```javascript
const config = Object.freeze({
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  nested: { retries: 3 }
});

config.apiUrl = 'другой'; // Молча игнорируется (TypeError в strict mode)
console.log(config.apiUrl); // 'https://api.example.com'

// freeze — поверхностная: вложенные объекты изменяемы
config.nested.retries = 10; // Работает!
```

<DeepDive title="Глубокая заморозка">

Для глубокой заморозки нужно рекурсивно обойти все вложенные объекты:

```javascript
function deepFreeze(obj) {
  Object.getOwnPropertyNames(obj).forEach(name => {
    const value = obj[name];
    if (typeof value === 'object' && value !== null) {
      deepFreeze(value); // рекурсия для вложенных объектов
    }
  });
  return Object.freeze(obj);
}

const frozen = deepFreeze({ nested: { x: 1 } });
frozen.nested.x = 2; // TypeError в strict mode
```

</DeepDive>

<CrossLink chapter="ch03-variables" section="references">
Подробнее о примитивах и ссылках — в главе «Переменные и типы данных».
</CrossLink>
