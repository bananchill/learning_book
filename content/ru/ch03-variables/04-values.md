import { Callout, DeepDive } from '@book/ui'

# Работа со значениями

Понимание разницы между копированием примитивов и объектов — ключ к предотвращению трудноуловимых багов.

## Присваивание и копирование примитивов

Примитивы копируются по значению — создаётся независимая копия:

```javascript
let a = 5;
let b = a; // b получает копию значения 5

a = 10;
console.log(b); // 5 — b не изменилась!

let str1 = 'hello';
let str2 = str1;
str1 = 'world';
console.log(str2); // 'hello' — независимая копия
```

## Объекты и массивы — по ссылке

Переменная хранит не сам объект, а **ссылку** на него в памяти:

```javascript
const obj1 = { name: 'Иван' };
const obj2 = obj1; // obj2 указывает на тот же объект!

obj1.name = 'Мария';
console.log(obj2.name); // 'Мария' — оба смотрят на один объект

// Сравнение объектов сравнивает ссылки, а не содержимое
const a = { x: 1 };
const b = { x: 1 };
console.log(a === b); // false — разные объекты в памяти
console.log(a === a); // true — одна и та же ссылка
```

## Поверхностное копирование (shallow copy)

```javascript
const original = { name: 'Иван', age: 25 };

// Способ 1: Object.assign
const copy1 = Object.assign({}, original);

// Способ 2: spread оператор (предпочтительно)
const copy2 = { ...original };

copy2.name = 'Мария';
console.log(original.name); // 'Иван' — оригинал не изменился
```

<Callout type="warning">
Shallow copy копирует только верхний уровень. Вложенные объекты по-прежнему копируются по ссылке!
</Callout>

```javascript
const user = {
  name: 'Иван',
  address: { city: 'Москва' } // вложенный объект
};

const copy = { ...user };
copy.address.city = 'Питер'; // Изменяем вложенный объект

console.log(user.address.city); // 'Питер' — оригинал тоже изменился!
// address в copy и user — одна и та же ссылка
```

## Глубокое копирование (deep copy)

```javascript
// Способ 1: JSON (простой, но с ограничениями)
const deep1 = JSON.parse(JSON.stringify(original));
// Ограничения: теряет undefined, Date → string, функции теряются

// Способ 2: structuredClone (ES2022, рекомендуется)
const deep2 = structuredClone(original);
// Поддерживает Date, Map, Set, но не функции и символы

// Способ 3: рекурсивная функция (для полного контроля)
function deepClone(value) {
  if (value === null || typeof value !== 'object') {
    return value; // примитивы возвращаем как есть
  }
  if (Array.isArray(value)) {
    return value.map(deepClone);
  }
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => [k, deepClone(v)])
  );
}
```

<DeepDive title="Как JavaScript хранит значения в памяти">

JavaScript движок использует два вида памяти:
- **Stack (стек)** — для примитивов и ссылок. Быстрый доступ, ограниченный размер.
- **Heap (куча)** — для объектов и массивов. Медленнее, но неограниченный размер.

Когда вы пишете `const obj = { x: 1 }`:
1. Объект `{ x: 1 }` создаётся в Heap
2. В Stack записывается ссылка (адрес) на этот объект
3. Переменная `obj` хранит эту ссылку, а не сам объект

Сборщик мусора (Garbage Collector) автоматически удаляет объекты из Heap, когда на них не осталось ссылок.

</DeepDive>
