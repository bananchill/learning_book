---
title: "Сборка мусора"
parent: "ch04-v8-engine"
order: 5
---

## Generational GC

V8 использует **generational** (поколенческий) сборщик мусора. Идея: большинство объектов живут недолго. Разделим кучу на два поколения:

- **Young Generation** (~1-8 МБ) — новые объекты. Собирается часто и быстро
- **Old Generation** (~сотни МБ) — выжившие объекты. Собирается редко

```
Heap
├── Young Generation (nursery)
│   ├── Semi-space A (from-space)
│   └── Semi-space B (to-space)
└── Old Generation
    ├── Old Space (обычные объекты)
    ├── Code Space (скомпилированный код)
    └── Large Object Space (>256 КБ)
```

## Young Generation: Scavenge

Scavenge использует алгоритм **Cheney's semi-space copying**:

1. Новые объекты создаются в **from-space**
2. Когда from-space заполнен → запуск Scavenge
3. Живые объекты копируются в **to-space**
4. Мёртвые объекты остаются и «забываются»
5. from-space и to-space меняются ролями

```js
function allocate() {
  const temp = { x: 1 } // → Young Generation (from-space)
  return temp.x          // temp больше не нужен
}
// Следующий Scavenge: temp не скопируется → освобождён
```

Объект, переживший **два** Scavenge-цикла, перемещается в Old Generation (**promotion**).

Scavenge быстрый (~1-2 мс), потому что:
- Young Generation маленький
- Копируются только живые объекты (их обычно мало)
- Не нужно искать и освобождать мёртвые — просто забываем from-space

## Old Generation: Mark-Sweep-Compact

Для Old Generation используется алгоритм **Mark-Sweep-Compact**:

### Mark (маркировка)
GC обходит все достижимые объекты, начиная с **корней** (глобальные переменные, стек, handles):

```
Корни → obj1 → obj3 → obj5 (живые, помечены)
         ↓
        obj2 (живой, помечен)

obj4 (недостижим — мусор)
```

### Sweep (очистка)
GC проходит по памяти и освобождает непомеченные объекты, добавляя их в free list.

### Compact (уплотнение)
Перемещает живые объекты ближе друг к другу, устраняя фрагментацию памяти.

Mark-Sweep-Compact медленнее Scavenge, но Old Generation собирается реже.

## Incremental и Concurrent Marking

Полная маркировка Old Generation может занять десятки миллисекунд — это заметно для пользователя (jank). V8 решает это двумя способами:

### Incremental Marking
GC маркирует объекты **порциями**, чередуясь с исполнением JS:

```
[JS 5мс] [Mark 1мс] [JS 5мс] [Mark 1мс] [JS 5мс] [Sweep]
```

Вместо одной паузы в 10мс — несколько пауз по 1мс.

### Concurrent Marking
GC маркирует объекты **в фоновом потоке**, параллельно с исполнением JS:

```
Main thread: [JS] [JS] [JS] [JS] [Sweep 1мс]
GC thread:   [Mark] [Mark] [Mark] [done]
```

Основной поток почти не останавливается. V8 использует **write barrier** для отслеживания изменений, пока GC работает в фоне.

## Утечки памяти в JS

GC собирает только недостижимые объекты. Если объект достижим — он живёт, даже если вы о нём забыли. Частые причины утечек:

### 1. Забытые обработчики событий

```js
// ❌ Обработчик держит ссылку на heavyData
function setup() {
  const heavyData = new Array(1_000_000)
  element.addEventListener('click', () => {
    console.log(heavyData.length)
  })
}
// element жив → обработчик жив → heavyData жив → утечка

// ✅ Убирай обработчик, когда он не нужен
function setup() {
  const heavyData = new Array(1_000_000)
  const handler = () => console.log(heavyData.length)
  element.addEventListener('click', handler)
  return () => element.removeEventListener('click', handler)
}
```

### 2. Замыкания, удерживающие большие объекты

```js
// ❌ Весь response живёт в замыкании
function process(response) {
  return () => response.data.items.length
}

// ✅ Извлеки нужное значение
function process(response) {
  const count = response.data.items.length
  return () => count
}
```

### 3. Глобальные переменные и кэши без ограничений

```js
// ❌ Кэш растёт бесконечно
const cache = {}
function memoize(key, value) {
  cache[key] = value
}

// ✅ LRU-кэш с ограничением размера
const cache = new Map()
const MAX = 1000
function memoize(key, value) {
  if (cache.size >= MAX) {
    const oldest = cache.keys().next().value
    cache.delete(oldest)
  }
  cache.set(key, value)
}
```

### 4. Detached DOM nodes

```js
// ❌ Ссылка на удалённый DOM-элемент
let detached = document.getElementById('panel')
document.body.removeChild(detached)
// detached всё ещё хранит ссылку → DOM-дерево в памяти
```

## WeakRef и FinalizationRegistry

ES2021 добавил инструменты для работы с «слабыми» ссылками:

### WeakRef

Слабая ссылка не предотвращает сборку мусора:

```js
let obj = { data: 'important' }
const weak = new WeakRef(obj)

weak.deref() // { data: 'important' } — объект жив
obj = null   // единственная сильная ссылка убрана

// После GC:
weak.deref() // undefined — объект собран
```

### FinalizationRegistry

Коллбэк при сборке объекта:

```js
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Объект ${heldValue} собран GC`)
})

let obj = { data: 'heavy' }
registry.register(obj, 'my-object')

obj = null // когда GC соберёт → "Объект my-object собран GC"
```

**Осторожно:** время вызова callback непредсказуемо. Не полагайся на FinalizationRegistry для критичной логики.

<DeepDive>

### Orinoco GC

**Orinoco** — кодовое название GC-подсистемы V8, объединяющей все стратегии:

- **Parallel Scavenge** — Young Generation собирается несколькими потоками одновременно
- **Concurrent Marking** — маркировка Old Generation в фоновом потоке
- **Concurrent Sweeping** — очистка в фоновом потоке
- **Incremental Compaction** — уплотнение порциями
- **Idle-time GC** — V8 использует паузы простоя (idle callbacks) для GC

```
Chrome requestIdleCallback → V8 idle-time GC
```

При 60 FPS каждый кадр занимает ~16мс. Если JS выполнился за 10мс, оставшиеся 6мс V8 может использовать для инкрементальной GC-работы. Это минимизирует влияние GC на производительность UI.

В Node.js idle-time GC работает аналогично, используя паузы event loop.

</DeepDive>

## Итого

| Концепция | Описание |
|-----------|----------|
| Young Generation | Новые объекты, Scavenge (semi-space copying), быстрый (~1-2 мс) |
| Old Generation | Выжившие объекты, Mark-Sweep-Compact, редкий |
| Promotion | Объект пережил 2 Scavenge → перемещение в Old Generation |
| Incremental Marking | Маркировка порциями, чередуясь с JS |
| Concurrent Marking | Маркировка в фоновом потоке, параллельно с JS |
| Утечки памяти | Обработчики, замыкания, кэши без лимита, detached DOM |
| WeakRef | Слабая ссылка — не мешает GC собрать объект |
