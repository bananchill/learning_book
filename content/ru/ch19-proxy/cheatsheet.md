# Шпаргалка: Proxy и Reflect

## Создание Proxy

```js
const proxy = new Proxy(target, handler)
// target — оригинальный объект
// handler — объект с ловушками (traps)
```

## Основные ловушки

| Ловушка | Когда срабатывает | Сигнатура |
|---------|-------------------|-----------|
| `get` | `proxy.prop`, `proxy[prop]` | `(target, prop, receiver)` |
| `set` | `proxy.prop = val` | `(target, prop, value, receiver)` → `true/false` |
| `has` | `prop in proxy` | `(target, prop)` → `boolean` |
| `deleteProperty` | `delete proxy.prop` | `(target, prop)` → `true/false` |
| `apply` | `proxyFn(args)` | `(target, thisArg, args)` |
| `construct` | `new ProxyCls(args)` | `(target, args)` → object |
| `ownKeys` | `Object.keys()`, `for...in` | `(target)` → array |

## Reflect — корректное делегирование

```js
// В ловушке всегда используй Reflect для стандартного поведения
get(target, prop, receiver) {
  return Reflect.get(target, prop, receiver) // НЕ target[prop]!
}
set(target, prop, value, receiver) {
  return Reflect.set(target, prop, value, receiver) // НЕ target[prop]=value!
}
```

## Частые паттерны

```js
// Валидация
set(target, prop, value) {
  if (!isValid(value)) throw new TypeError(...)
  return Reflect.set(target, prop, value)
}

// Значения по умолчанию
get(target, prop, receiver) {
  return Reflect.has(target, prop) ? Reflect.get(target, prop, receiver) : DEFAULT
}

// Логирование
get(target, prop, receiver) {
  console.log('get:', prop)
  return Reflect.get(target, prop, receiver)
}

// Иммутабельность
set(target, prop) { throw new TypeError('readonly!') }
deleteProperty(target, prop) { throw new TypeError('readonly!') }
```

## Подводные камни

- `set` должен возвращать `true` (иначе TypeError в strict mode)
- `deleteProperty` должен возвращать `true` при успехе
- Деструктуризация реактивного объекта теряет реактивность
- Proxy не работает с примитивами — только с объектами и функциями
- `typeof proxy` и `instanceof` работают с оригинальным target
