# Реактивность: Vue 3 под капотом

`reactive()` во Vue 3 реализован именно через `Proxy`. Понимание этого помогает лучше работать с реактивностью и объяснять её поведение.

import { Callout, CrossLink, DeepDive } from '@book/ui'

## Упрощённая реализация reactive()

```js
// Трекер зависимостей
const activeEffect = { fn: null }
const deps = new WeakMap() // target → Map<prop → Set<effect>>

function track(target, prop) {
  if (!activeEffect.fn) return
  if (!deps.has(target)) deps.set(target, new Map())
  const targetDeps = deps.get(target)
  if (!targetDeps.has(prop)) targetDeps.set(prop, new Set())
  targetDeps.get(prop).add(activeEffect.fn)
}

function trigger(target, prop) {
  deps.get(target)?.get(prop)?.forEach(fn => fn())
}

// Реактивный объект
function reactive(obj) {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      track(target, prop)              // регистрируем зависимость
      return Reflect.get(target, prop, receiver)
    },
    set(target, prop, value, receiver) {
      const result = Reflect.set(target, prop, value, receiver)
      trigger(target, prop)            // уведомляем подписчиков
      return result
    }
  })
}

// Эффект — функция, автоматически перезапускающаяся при изменениях
function effect(fn) {
  activeEffect.fn = fn
  fn() // первый запуск — собираем зависимости
  activeEffect.fn = null
}
```

## Как это работает на практике

```js
const state = reactive({ count: 0, name: 'Алиса' })

// effect автоматически отслеживает зависимости
effect(() => {
  console.log(`${state.name}: ${state.count}`)
})
// сразу выводит: "Алиса: 0"

state.count = 1   // автоматически: "Алиса: 1"
state.name = 'Боб' // автоматически: "Боб: 1"
state.count = 5   // автоматически: "Боб: 5"
```

<Callout type="info">
Именно поэтому во Vue деструктуризация `const { count } = reactive({count: 0})` «теряет» реактивность — `count` становится примитивным значением, не обёрнутым в Proxy. Решение: `toRefs()`.
</Callout>

## Почему Proxy лучше Object.defineProperty

Vue 2 использовал `Object.defineProperty` — и это имело ограничения:

```js
// Vue 2: не обнаруживало новые свойства
const state = reactive({ count: 0 })
state.newProp = 'hello' // ❌ не реактивно!

// Требовалось: Vue.set(state, 'newProp', 'hello')

// Vue 3 с Proxy: любые изменения перехватываются
const state3 = reactive({})
state3.newProp = 'hello' // ✅ реактивно!
```

<DeepDive title="WeakMap и управление памятью">
Карта зависимостей хранится в `WeakMap(target → ...)`. WeakMap позволяет сборщику мусора удалить зависимости автоматически, когда оригинальный объект (target) больше не доступен. Это предотвращает утечки памяти при удалении реактивных объектов.
</DeepDive>

<CrossLink chapter="ch13-prototypes" title="Прототипы: receiver и цепочка прототипов" />
