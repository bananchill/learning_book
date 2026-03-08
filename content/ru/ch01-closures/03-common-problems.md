---
title: "Частые проблемы и ловушки"
parent: "ch01-closures"
order: 3
---

## Цикл с var и setTimeout

Самый известный баг замыканий:

```js
// ❌ Выведет "5 5 5 5 5"
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100)
}
```

`var` создаёт одну переменную `i` на весь вызов. Все 5 колбэков замыкаются на неё. К моменту срабатывания таймеров цикл завершён, `i === 5`.

### Решение: let

```js
// ✅ Выведет "0 1 2 3 4"
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100)
}
```

`let` создаёт **новую привязку** на каждой итерации. Каждый колбэк замыкается на свою копию `i`.

### Решение: IIFE (до ES2015)

```js
for (var i = 0; i < 5; i++) {
  ;(function (j) {
    setTimeout(() => console.log(j), 100)
  })(i)
}
```

IIFE создаёт новое окружение с параметром `j`, копируя текущее значение `i`.

## Утечки памяти

Замыкание удерживает окружение внешней функции. Если в нём тяжёлые объекты — они не будут собраны GC:

```js
// ❌ heavyData висит в памяти, пока жив обработчик
function setup() {
  const heavyData = new Array(1_000_000).fill('x')

  document.getElementById('btn').addEventListener('click', () => {
    console.log('Кнопка нажата')
    // heavyData не используется, но замыкание удерживает окружение
  })
}
```

### Как избежать

Извлечь нужное **до** создания замыкания:

```js
// ✅ heavyData может быть собран GC
function setup() {
  const heavyData = loadData()
  const summary = heavyData.length

  document.getElementById('btn').addEventListener('click', () => {
    console.log(`Элементов: ${summary}`)
  })
}
```

Всегда снимай обработчики, когда они больше не нужны:

```js
function attachHandler(element) {
  const handler = () => { /* ... */ }
  element.addEventListener('click', handler)
  return () => element.removeEventListener('click', handler)
}
```

## this и замыкания

Замыкание **не захватывает** `this` — значение `this` определяется способом вызова:

```js
const obj = {
  name: 'Объект',
  getName() {
    return function () {
      return this.name // ❌ this зависит от способа вызова
    }
  },
}

const fn = obj.getName()
fn() // undefined (this !== obj)
```

Стрелочные функции — исключение. Они берут `this` из лексического окружения:

```js
const obj = {
  name: 'Объект',
  getName() {
    return () => this.name // ✅ this из getName
  },
}

obj.getName()() // "Объект"
```

## Stale closure в React

Каждый рендер создаёт новое замыкание. Проблема — когда старое замыкание использует устаревшие данные:

```jsx
// ❌ count всегда 0 в замыкании setInterval
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1) // замыкание захватило count = 0
    }, 1000)
    return () => clearInterval(timer)
  }, []) // пустой deps → замыкание создано один раз
}
```

Замыкание `setInterval` захватило `count = 0` первого рендера. На каждом тике: `0 + 1 = 1`.

```jsx
// ✅ Функциональный updater — не зависит от замыкания
setCount(prev => prev + 1)
```

## Итого

| Проблема | Признак | Решение |
|----------|---------|---------|
| Цикл с var | Все коллбэки видят одно значение | `let` или IIFE |
| Утечка памяти | Обработчик держит тяжёлые данные | Извлечь нужное, `removeEventListener` |
| this в замыкании | `this === undefined` | Стрелочная функция |
| Stale closure | Данные устарели (React, setInterval) | Функциональный updater, актуальный deps |
