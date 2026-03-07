---
title: "Частые проблемы и ловушки"
parent: "ch01-closures"
order: 3
---

## Классика: цикл с var и setTimeout

Это самый известный баг, связанный с замыканиями. Он подробно разобран в [MDN — Closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) (раздел «Creating closures in loops: A common mistake»):

```js
// ❌ Баг: выведет "5 5 5 5 5"
for (var i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100)
}
```

**Почему?** Все 5 коллбэков замкнулись на **одну переменную** `i`. К моменту срабатывания таймеров цикл завершился и `i === 5`.

### Решение 1: let

```js
// ✅ Выведет "0 1 2 3 4"
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), 100)
}
```

`let` создаёт новую привязку на каждой итерации — каждый коллбэк получает свою `i`.

### Решение 2: IIFE

```js
// ✅ Работает и с var
for (var i = 0; i < 5; i++) {
  ;(function (j) {
    setTimeout(() => console.log(j), 100)
  })(i)
}
```

IIFE создаёт новое окружение с параметром `j`, копируя текущее значение `i`.

### Решение 3: отдельная функция

```js
function createTimer(value) {
  return () => console.log(value)
}

for (var i = 0; i < 5; i++) {
  setTimeout(createTimer(i), 100)
}
```

## Утечки памяти

Замыкание удерживает ссылку на **весь** Lexical Environment внешней функции, не только на используемые переменные:

```js
// ❌ heavyData не будет собран GC
function setup() {
  const heavyData = new Array(1_000_000).fill('x')

  document.getElementById('btn').addEventListener('click', () => {
    console.log('Кнопка нажата')
    // heavyData не используется, но замыкание удерживает окружение setup()
  })
}
```

### Как избежать

```js
// ✅ Вынести нужные данные
function setup() {
  const heavyData = loadData()
  const summary = heavyData.length // берём только то, что нужно

  document.getElementById('btn').addEventListener('click', () => {
    console.log(`Элементов: ${summary}`)
  })
  // heavyData может быть собран GC
}
```

### Не забывай removeEventListener

```js
function attachHandler(element) {
  const handler = () => { /* ... */ }
  element.addEventListener('click', handler)

  // Верни функцию для очистки
  return () => element.removeEventListener('click', handler)
}

const cleanup = attachHandler(button)
// Когда обработчик больше не нужен:
cleanup()
```

## this и замыкания

`this` не захватывается замыканием как обычная переменная:

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
fn() // undefined (this === window/undefined в strict mode)
```

### Решение: стрелочная функция

```js
const obj = {
  name: 'Объект',
  getName() {
    return () => {
      return this.name // ✅ стрелочная функция берёт this из замыкания
    }
  },
}

obj.getName()() // "Объект"
```

Стрелочные функции не имеют собственного `this` — они берут его из лексического окружения. Это единственный случай, когда `this` ведёт себя как обычная переменная замыкания.

## Stale closure в React

```jsx
// ❌ count всегда 0 в замыкании
function Counter() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1) // замыкание захватило count = 0
    }, 1000)
    return () => clearInterval(timer)
  }, []) // пустой deps → эффект не пересоздаётся
}
```

```jsx
// ✅ Решение: функциональный updater
setCount((prev) => prev + 1) // не зависит от замыкания
```

## Итого: чеклист проблем

| Проблема | Признак | Решение |
|----------|---------|---------|
| Цикл с var | Все коллбэки видят одно значение | `let`, IIFE, отдельная функция |
| Утечка памяти | Обработчик держит тяжёлые данные | Вынести нужное, `removeEventListener` |
| this в замыкании | `this === undefined` | Стрелочная функция |
| Stale closure | Данные устарели | Функциональный updater, deps |
