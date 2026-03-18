import { Callout, DeepDive } from '@book/ui'

# Производительность циклов

## Кэширование длины массива

Каждое обращение к `arr.length` может стать точкой доступа к свойству. Кэширование убирает это:

```javascript
const arr = new Array(1_000_000).fill(1);

// Без кэширования — arr.length читается каждую итерацию
for (let i = 0; i < arr.length; i++) { ... }

// С кэшированием длины
const len = arr.length;
for (let i = 0; i < len; i++) { ... }
```

<Callout type="info">
Современный V8 оптимизирует `arr.length` в цикле автоматически. Но явное кэширование — хорошая практика: сигнализирует читателю, что вы знаете об этом.
</Callout>

## Цикл vs методы массива

Для большинства задач методы массива (`map`, `filter`, `reduce`) предпочтительнее цикла:

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Цикл — императивно, много кода
const doubled = [];
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    doubled.push(numbers[i] * 2);
  }
}

// Методы — декларативно, читаемо
const doubled2 = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2);
```

**Цикл предпочтителен когда:**
- Нужен ранний выход (`break`) — методы не поддерживают
- Очень большой массив (10M+ элементов) — методы создают промежуточные массивы
- Нужно мутировать элементы по индексу

## Избегайте создания объектов в цикле

```javascript
// Плохо — создаёт объект на каждой итерации
for (let i = 0; i < 1000; i++) {
  processItem({ index: i, value: arr[i] }); // новый {} каждый раз
}

// Лучше — объект создаётся один раз
const item = {};
for (let i = 0; i < arr.length; i++) {
  item.index = i;
  item.value = arr[i];
  processItem(item);
}
```

<Callout type="info">
Этот раздел использует `async/await` и `Promise`. Если вы ещё не знакомы с асинхронностью — вернитесь к нему после [главы Асинхронность](/frontend/javascript/ch02-async).
</Callout>

<DeepDive title="Async в циклах">

```javascript
// Последовательное выполнение — await в цикле
for (const id of userIds) {
  const user = await fetchUser(id); // ждём каждый запрос
  console.log(user.name);
}

// Параллельное выполнение — Promise.all
const users = await Promise.all(userIds.map(id => fetchUser(id)));
```

<Callout type="tip">
Если запросы независимы — `Promise.all` быстрее последовательного цикла. Если порядок важен или есть лимиты API — последовательный цикл.
</Callout>

</DeepDive>

<DeepDive title="Jank и циклы в браузере">

Длинный синхронный цикл блокирует UI поток браузера. Если цикл занимает более 16ms — возникает "jank" (заметные задержки анимации).

Решения:
1. **Web Workers** — выполнять тяжёлые вычисления в отдельном потоке
2. **Chunking** — разбить работу на куски через setTimeout/requestAnimationFrame:

```javascript
async function processLargeArray(arr) {
  const CHUNK_SIZE = 1000;
  for (let i = 0; i < arr.length; i += CHUNK_SIZE) {
    const chunk = arr.slice(i, i + CHUNK_SIZE);
    processChunk(chunk);
    await new Promise(resolve => setTimeout(resolve, 0)); // отдать управление UI
  }
}
```

</DeepDive>
