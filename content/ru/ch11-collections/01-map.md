import { Callout, DeepDive } from '@book/ui'

# Map — ассоциативный массив

Map хранит пары «ключ → значение», как обычный объект. Ключевое отличие — ключом может быть **любой тип**: объект, функция, число, даже `NaN`. У обычного объекта ключи всегда приводятся к строкам.

## Создание и базовые операции

Map создаётся конструктором `new Map()`. Для работы с данными используются методы `set`, `get`, `has` и `delete`.

```javascript
const map = new Map();

// Добавляем пары ключ-значение
map.set('name', 'Иван');
map.set(42, 'ответ');
map.set(true, 'да');

// Получаем значения
console.log(map.get('name')); // 'Иван'
console.log(map.get(42));     // 'ответ'

// Проверяем наличие ключа
console.log(map.has(42));     // true
console.log(map.has('age'));  // false

// Удаляем пару
map.delete(true);
console.log(map.size); // 2

// Очищаем всю коллекцию
map.clear();
console.log(map.size); // 0
```

Метод `set` возвращает сам Map, поэтому вызовы можно объединять в цепочку.

```javascript
const config = new Map()
  .set('theme', 'dark')
  .set('lang', 'ru')
  .set('fontSize', 16);
```

## Инициализация из массива пар

Map можно сразу заполнить данными, передав массив пар `[ключ, значение]` в конструктор. Это удобно для создания Map из существующих данных.

```javascript
const statusCodes = new Map([
  [200, 'OK'],
  [404, 'Not Found'],
  [500, 'Internal Server Error']
]);

console.log(statusCodes.get(404)); // 'Not Found'
console.log(statusCodes.size);     // 3
```

Конвертация также работает в обратную сторону — из Map обратно в массив.

```javascript
const entries = [...statusCodes]; // [[200, 'OK'], [404, 'Not Found'], ...]
const obj = Object.fromEntries(statusCodes); // { '200': 'OK', '404': 'Not Found', ... }
```

## Итерация

Map поддерживает несколько способов перебора. В отличие от объектов, порядок элементов **всегда** соответствует порядку вставки.

```javascript
const users = new Map([
  ['admin', { role: 'admin', active: true }],
  ['editor', { role: 'editor', active: true }],
  ['viewer', { role: 'viewer', active: false }]
]);

// for...of перебирает пары [ключ, значение]
for (const [key, value] of users) {
  console.log(`${key}: ${value.role}`);
}

// Отдельно ключи и значения
for (const key of users.keys()) {
  console.log(key); // 'admin', 'editor', 'viewer'
}

for (const value of users.values()) {
  console.log(value.role); // 'admin', 'editor', 'viewer'
}

// forEach — аналог массивов (аргументы: значение, ключ, map)
users.forEach((value, key) => {
  console.log(`${key} → ${value.active}`);
});
```

<Callout type="info">
Map сохраняет порядок вставки элементов. Обычный объект тоже сохраняет порядок строковых ключей, но числовые ключи сортируются первыми — Map лишён этой особенности.
</Callout>

## Объект как ключ

Главная суперсила Map — возможность использовать объекты в качестве ключей. Это открывает паттерн «метаданные к объекту» без модификации самого объекта.

```javascript
const userElement = document.querySelector('#user');
const productElement = document.querySelector('#product');

// Привязываем данные к DOM-элементам, не засоряя их свойствами
const elementData = new Map();
elementData.set(userElement, { clicks: 0, lastVisit: new Date() });
elementData.set(productElement, { views: 0, inCart: false });

// Получаем данные по ссылке на элемент
const data = elementData.get(userElement);
data.clicks++;
```

Такой подход полезен для хранения состояния, привязанного к конкретным объектам — DOM-элементам, экземплярам классов, соединениям.

```javascript
// Подсчёт обращений к функциям
const callCount = new Map();

function trackCall(fn) {
  const count = callCount.get(fn) || 0;
  callCount.set(fn, count + 1);
}

function greet() { return 'Привет'; }
function farewell() { return 'Пока'; }

trackCall(greet);
trackCall(greet);
trackCall(farewell);

console.log(callCount.get(greet));    // 2
console.log(callCount.get(farewell)); // 1
```

<DeepDive title="Как Map сравнивает ключи (SameValueZero)">

Map использует алгоритм **SameValueZero** для сравнения ключей. Он работает почти как `===`, но с одним отличием: `NaN` считается равным `NaN`.

```javascript
const map = new Map();

// NaN === NaN → false, но Map считает их одним ключом
map.set(NaN, 'не число');
console.log(map.get(NaN)); // 'не число'

// -0 и +0 считаются одним ключом
map.set(0, 'ноль');
console.log(map.get(-0)); // 'ноль'

// Объекты сравниваются по ссылке
const a = { id: 1 };
const b = { id: 1 };
map.set(a, 'первый');
map.set(b, 'второй');
console.log(map.size); // 3 (NaN, 0, a, b — но a и b разные ключи)
```

Это означает, что два разных объекта с одинаковым содержимым — это два разных ключа. Map сравнивает объекты по ссылке, а не по значению.

</DeepDive>
