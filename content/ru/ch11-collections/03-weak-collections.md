import { Callout, DeepDive } from '@book/ui'

# WeakMap и WeakSet

WeakMap и WeakSet — это «слабые» версии Map и Set. Они хранят **слабые ссылки** на объекты-ключи: если на объект больше нет других ссылок, сборщик мусора удалит его — даже если он всё ещё в WeakMap/WeakSet.

## WeakMap

WeakMap похож на Map, но с жёсткими ограничениями: ключами могут быть **только объекты** (не примитивы), а сама коллекция **не поддерживает итерацию**.

```javascript
const weakMap = new WeakMap();

const user = { name: 'Иван' };
const session = { id: 'abc123' };

// Ключи — только объекты
weakMap.set(user, { role: 'admin' });
weakMap.set(session, { expires: '2025-12-31' });

console.log(weakMap.get(user));    // { role: 'admin' }
console.log(weakMap.has(session)); // true

// Примитив как ключ — TypeError
// weakMap.set('строка', 123); // TypeError: Invalid value used as weak map key

// Нет size, нет итерации
// weakMap.size      → undefined
// weakMap.keys()    → TypeError
// weakMap.forEach() → TypeError
```

Доступны только четыре метода: `get`, `set`, `has`, `delete`. Ни `size`, ни `keys()`, ни `forEach()`.

## Практика: приватные данные

WeakMap позволяет хранить приватное состояние объекта снаружи, без модификации самого объекта. Когда объект уничтожается, связанные с ним данные автоматически удаляются.

```javascript
// Хранилище приватных данных
const privateData = new WeakMap();

class User {
  constructor(name, password) {
    // Публичные данные — в самом объекте
    this.name = name;

    // Приватные данные — в WeakMap (недоступны снаружи)
    privateData.set(this, { password, loginAttempts: 0 });
  }

  checkPassword(input) {
    const data = privateData.get(this);
    data.loginAttempts++;

    if (data.loginAttempts > 3) {
      throw new Error('Слишком много попыток');
    }
    return input === data.password;
  }
}

const user = new User('Иван', 'secret123');
console.log(user.name);                // 'Иван'
console.log(user.password);            // undefined — нет такого свойства
console.log(user.checkPassword('123')); // false
console.log(user.checkPassword('secret123')); // true
```

## Практика: кеширование

WeakMap идеально подходит для кеша, привязанного к объектам. Когда объект становится ненужным, кеш для него очищается автоматически — никаких утечек памяти.

```javascript
const cache = new WeakMap();

function heavyComputation(obj) {
  // Проверяем кеш
  if (cache.has(obj)) {
    console.log('Из кеша');
    return cache.get(obj);
  }

  // Тяжёлые вычисления
  console.log('Вычисляем...');
  const result = Object.keys(obj).reduce((sum, key) => {
    return sum + String(obj[key]).length;
  }, 0);

  // Сохраняем в кеш
  cache.set(obj, result);
  return result;
}

const data = { title: 'Привет', body: 'Мир' };
heavyComputation(data); // 'Вычисляем...' → 8
heavyComputation(data); // 'Из кеша' → 8

// Когда data выйдет из области видимости и будет
// собран сборщиком мусора — запись в cache исчезнет сама
```

## WeakSet

WeakSet — слабая версия Set. Хранит только объекты, не поддерживает итерацию и `size`. Типичное применение — отслеживание обработанных объектов.

```javascript
const processed = new WeakSet();

function processOrder(order) {
  // Защита от повторной обработки
  if (processed.has(order)) {
    console.log('Заказ уже обработан');
    return;
  }

  // Обрабатываем
  console.log(`Обработка заказа #${order.id}`);
  processed.add(order);
}

const order1 = { id: 1, total: 500 };
const order2 = { id: 2, total: 300 };

processOrder(order1); // 'Обработка заказа #1'
processOrder(order1); // 'Заказ уже обработан'
processOrder(order2); // 'Обработка заказа #2'
```

WeakSet также полезен для предотвращения бесконечных циклов при обходе структур с циклическими ссылками.

```javascript
function deepToString(obj, visited = new WeakSet()) {
  // Защита от циклических ссылок
  if (visited.has(obj)) {
    return '[Circular]';
  }
  visited.add(obj);

  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return `${key}: ${deepToString(value, visited)}`;
    }
    return `${key}: ${value}`;
  });

  return `{ ${entries.join(', ')} }`;
}

// Объект с циклической ссылкой
const node = { name: 'A' };
node.self = node; // ссылается сам на себя

console.log(deepToString(node)); // '{ name: A, self: [Circular] }'
```

<Callout type="warning">
Отсутствие итерации и `size` у WeakMap/WeakSet — это ограничение by design, а не недоработка. Сборщик мусора может удалить объект в любой момент, поэтому результат итерации был бы непредсказуемым. Нельзя перебрать то, что может исчезнуть между итерациями.
</Callout>
