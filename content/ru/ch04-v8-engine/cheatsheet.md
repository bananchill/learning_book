---
title: "Шпаргалка: Движок V8"
parent: "ch04-v8-engine"
---

## Pipeline V8

```
Source → Parser → AST → Ignition (байткод) → [Maglev] → TurboFan (машинный код)
```

## Ключевые факты

- **Ignition** — интерпретатор, собирает type feedback
- **TurboFan** — JIT-компилятор, спекулятивные оптимизации на основе type feedback
- **Деоптимизация** — откат в Ignition, если спекуляция неверна
- **Hidden class** — описывает форму объекта, доступ по смещению
- **Inline cache** — кэш поиска свойств: monomorphic → polymorphic → megamorphic
- **Context** — объект в куче для переменных, захваченных замыканием

## Hidden Classes — правила

```js
// ✅ Одинаковый порядок свойств → один hidden class
const a = { x: 1, y: 2 }
const b = { x: 3, y: 4 }

// ❌ Разный порядок → разные hidden classes
const c = { y: 1, x: 2 }

// ❌ delete ломает hidden class
delete obj.prop

// ✅ Присвой undefined вместо delete
obj.prop = undefined
```

## Inline Caches — правила

```js
// ✅ Мономорфный — один shape → максимальная скорость
function getX(p) { return p.x }
getX({ x: 1, y: 2 })
getX({ x: 3, y: 4 })

// ❌ Мегаморфный — много разных shape → медленный lookup
getX({ x: 1, a: 0 })
getX({ x: 1, b: 0 })
getX({ x: 1, c: 0 })
```

## Context Allocation

```js
function outer() {
  let captured = 1  // → Context (куча) — используется в inner
  let local = 2     // → стек — НЕ используется в inner

  return () => captured
}
```

## GC — два поколения

```
Young Generation (Scavenge)     Old Generation (Mark-Sweep-Compact)
├── Быстрый (~1-2 мс)           ├── Медленнее, но реже
├── Копирует живые объекты       ├── Маркирует достижимые
└── 2 выживания → promotion      └── Sweeps мёртвые, compacts живые
```

## Частые баги

```js
// ❌ Утечка: замыкание держит большой объект
function process(bigData) {
  return () => bigData.length
}

// ✅ Извлеки значение
function process(bigData) {
  const len = bigData.length
  return () => len
}

// ❌ eval ломает все оптимизации
function bad() { eval(''); return () => x }

// ❌ Кэш без лимита → утечка памяти
const cache = {}
```

## Чеклист

- [ ] Создаёшь объекты с одинаковым порядком свойств?
- [ ] Не используешь `delete` для свойств?
- [ ] В горячих путях — мономорфные объекты?
- [ ] Не захватываешь лишнее в замыканиях?
- [ ] Нет `eval` / `with` в замыканиях?
- [ ] Кэши с ограничением размера?
- [ ] Удаляешь обработчики событий при cleanup?
