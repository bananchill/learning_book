---
title: "try/catch/finally"
---

import { Callout, DeepDive } from '@book/ui'

## Базовый синтаксис

```js
try {
  // код, который может выбросить ошибку
  const data = JSON.parse(invalidJson)
} catch (error) {
  // error — объект Error (или что угодно, что было выброшено)
  console.error('Ошибка парсинга:', error.message)
} finally {
  // выполняется ВСЕГДА — и при ошибке, и без неё
  console.log('Попытка парсинга завершена')
}
```

## Объект Error

```js
try {
  throw new Error('Что-то пошло не так')
} catch (error) {
  console.log(error.name)    // "Error"
  console.log(error.message) // "Что-то пошло не так"
  console.log(error.stack)   // стек вызовов (зависит от движка)
}
```

## Повторное бросание ошибки

Важный паттерн: перехватывать только ожидаемые ошибки, остальные — пробрасывать выше:

```js
function parseConfig(json) {
  try {
    return JSON.parse(json)
  } catch (error) {
    // Перехватываем только SyntaxError (ожидаемая ошибка парсинга)
    if (error instanceof SyntaxError) {
      console.warn('Неверный JSON, используем дефолт')
      return {}
    }
    // Другие ошибки пробрасываем — они неожиданны
    throw error
  }
}
```

<Callout type="warning">
Антипаттерн: `catch (e) {}` — «проглатывание» ошибки без обработки. Это скрывает проблему и делает отладку невозможной. Всегда хотя бы логируй ошибку.
</Callout>

## finally — гарантированное выполнение

`finally` выполняется всегда — полезно для освобождения ресурсов:

```js
function readFile(path) {
  let fileHandle = null
  try {
    fileHandle = openFile(path)
    return processFile(fileHandle)
  } catch (error) {
    console.error('Ошибка чтения файла:', error)
    return null
  } finally {
    // Закрываем файл всегда, даже если было исключение
    if (fileHandle) {
      fileHandle.close()
    }
  }
}
```

<DeepDive>
Интересное взаимодействие `finally` и `return`:

```js
function test() {
  try {
    return 'из try'
  } finally {
    return 'из finally'  // перекрывает return из try!
  }
}
console.log(test()) // "из finally"

// finally также перекрывает throw:
function test2() {
  try {
    throw new Error('ошибка')
  } finally {
    return 'спасён'  // подавляет исключение!
  }
}
test2() // "спасён" — ошибка подавлена
```

Это поведение редко нужно намеренно — обычно это источник багов.
</DeepDive>

## Что можно выбросить через throw

В JavaScript можно выбросить что угодно — но лучше всегда бросать объекты `Error`:

```js
// Можно, но плохо:
throw 'Строка ошибки'   // нет стека, нет типа
throw 42                 // вообще не информативно
throw { code: 404 }     // нет стека вызовов

// Правильно:
throw new Error('Описание')        // базовая ошибка
throw new TypeError('Неверный тип')
throw new RangeError('Вне диапазона')
```

## try/catch только для исключительных ситуаций

```js
// ПЛОХО: использовать исключения для контроля потока
function getUserAge(user) {
  try {
    return user.age
  } catch (e) {
    return 0  // если user === null
  }
}

// ХОРОШО: проверить заранее
function getUserAge(user) {
  if (!user) return 0
  return user.age ?? 0
}
```
