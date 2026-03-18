---
title: "Первые шаги"
parent: "ch01-intro"
order: 2
---

import { Callout } from '@book/ui'

## Консоль браузера — твой первый инструмент

Самый быстрый способ запустить JavaScript — открыть консоль браузера. Нажми `F12` (или `Ctrl+Shift+J` в Chrome / `Cmd+Option+J` на Mac) и перейди на вкладку **Console**.

Напечатай и нажми Enter:

```js
console.log('Привет, мир!')
// → Привет, мир!

2 + 2
// → 4

'JavaScript'.toUpperCase()
// → 'JAVASCRIPT'
```

Консоль — это полноценная среда выполнения JS. Здесь можно экспериментировать без создания файлов.

## Подключение скрипта к HTML

Чтобы JS-код работал на странице, его нужно подключить через тег `<script>`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Мой сайт</title>
  </head>
  <body>
    <h1>Привет!</h1>

    <!-- Подключаем внешний файл в конце body -->
    <script src="script.js"></script>
  </body>
</html>
```

<Callout type="info">
`document.querySelector` находит HTML-элемент на странице по CSS-селектору. Подробно DOM API рассмотрен в [главе DOM](/frontend/browser/ch28-dom).
</Callout>

```js
// script.js
console.log('Скрипт загружен!')
document.querySelector('h1').textContent = 'Привет, JavaScript!'
```

<Callout type="tip">
Скрипт лучше ставить **перед закрывающим `</body>`**, а не в `<head>` — иначе он выполнится до того, как HTML загрузится, и `querySelector` ничего не найдёт.
</Callout>

## Атрибуты defer и async

Если всё же нужно подключить скрипт в `<head>`, используй атрибуты:

```html
<!-- defer: скрипт загружается параллельно, выполняется после HTML -->
<script src="script.js" defer></script>

<!-- async: скрипт загружается и выполняется сразу, не ждёт HTML -->
<script src="analytics.js" async></script>
```

| | Загрузка | Выполнение | Порядок |
|---|---|---|---|
| Обычный `<script>` | Блокирует HTML | Сразу | По порядку |
| `defer` | Параллельно | После HTML | По порядку |
| `async` | Параллельно | Сразу после загрузки | Не гарантирован |

Для большинства скриптов используй `defer`. `async` — только для независимых скриптов (аналитика, реклама).

## Node.js — JS вне браузера

Node.js позволяет запускать JavaScript на сервере или прямо в терминале:

```bash
# Установка Node.js: nodejs.org
node --version
# → v22.x.x

# Запустить файл
node script.js

# Интерактивный режим (REPL)
node
> 2 + 2
4
```

```js
// script.js — работает в Node.js, не в браузере
const fs = require('fs')
fs.writeFileSync('hello.txt', 'Привет, Node.js!')
console.log('Файл создан')
```

<Callout type="info">
Браузерные API (`document`, `window`, `alert`) в Node.js недоступны — там нет DOM. Node.js добавляет свои API: файловая система, HTTP, криптография.
</Callout>
