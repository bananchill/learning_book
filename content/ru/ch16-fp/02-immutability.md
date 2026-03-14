---
title: "Иммутабельность"
---

import { Callout } from '@book/ui'

## Зачем иммутабельность

Мутация объектов создаёт неочевидные связи в коде — изменение в одном месте неожиданно влияет на другое.

```js
// Проблема мутации
const user = { name: 'Алиса', age: 25 }
const admins = [user]

function birthday(user) {
  user.age++  // мутируем! Изменяется и в admins!
  return user
}

birthday(user)
console.log(admins[0].age) // 26 — неожиданно!
```

## Создание нового объекта вместо мутации

```js
// Иммутабельный подход: создаём новый объект
function birthday(user) {
  return { ...user, age: user.age + 1 }  // новый объект
}

const user = { name: 'Алиса', age: 25 }
const admins = [user]

const olderUser = birthday(user)
console.log(user.age)       // 25 — не изменился
console.log(olderUser.age)  // 26 — новый объект
console.log(admins[0].age)  // 25 — тоже не изменился
```

## Иммутабельные паттерны для объектов

```js
const state = { user: { name: 'Алиса', settings: { theme: 'dark' } } }

// Обновление вложенного поля (иммутабельно)
const newState = {
  ...state,
  user: {
    ...state.user,
    settings: {
      ...state.user.settings,
      theme: 'light'  // только это изменилось
    }
  }
}

// Удаление поля
const { theme, ...withoutTheme } = state.user.settings
// withoutTheme не содержит theme
```

## Иммутабельные паттерны для массивов

```js
const items = [1, 2, 3, 4, 5]

// Добавить элемент
const withNew = [...items, 6]           // в конец
const withFirst = [0, ...items]         // в начало

// Удалить элемент (по индексу)
const withoutSecond = items.filter((_, i) => i !== 1)  // [1, 3, 4, 5]

// Обновить элемент
const updated = items.map((item, i) => i === 2 ? 99 : item) // [1, 2, 99, 4, 5]

// Вставить в середину
const inserted = [
  ...items.slice(0, 2),
  99,
  ...items.slice(2)
]  // [1, 2, 99, 3, 4, 5]
```

## Object.freeze

`Object.freeze` делает объект «замороженным» — свойства нельзя изменить:

```js
const config = Object.freeze({
  apiUrl: 'https://api.example.com',
  timeout: 5000
})

config.apiUrl = 'другой url' // тихо игнорируется (в strict mode — TypeError)
console.log(config.apiUrl) // 'https://api.example.com'

// Внимание: freeze поверхностный!
const nested = Object.freeze({ inner: { value: 1 } })
nested.inner.value = 99  // работает! inner не заморожен
```

<Callout type="info">
`Object.freeze` — поверхностная заморозка. Для глубокой нужна рекурсия или библиотека (immer, immutable-js). В React-экосистеме обычно хватает поверхностной иммутабельности (новые ссылки для изменённых объектов).
</Callout>

## Immer — иммутабельность через мутации

Библиотека immer позволяет писать «мутирующий» код, но под капотом создаёт иммутабельные обновления:

```js
import produce from 'immer'

const state = { users: [{ id: 1, name: 'Алиса', active: true }] }

// Пишем как будто мутируем, получаем новый объект
const newState = produce(state, draft => {
  draft.users[0].active = false  // выглядит как мутация
  draft.users.push({ id: 2, name: 'Боб', active: true })
})

// state не изменился
console.log(state.users[0].active)    // true
console.log(newState.users[0].active) // false
```
