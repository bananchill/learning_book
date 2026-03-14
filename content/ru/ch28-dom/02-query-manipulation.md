import { Callout, DeepDive } from '@book/ui'

# Поиск и манипуляции

## Поиск элементов

```javascript
// querySelector — первый элемент по CSS-селектору
const btn = document.querySelector('#submit-btn')
const first = document.querySelector('.card')

// querySelectorAll — все элементы по CSS-селектору (статический NodeList)
const cards = document.querySelectorAll('.card')
const inputs = document.querySelectorAll('input[type="text"]')

// Поиск внутри элемента
const form = document.querySelector('form')
const formInputs = form.querySelectorAll('input')

// Устаревшие методы (но быстрее для ID)
document.getElementById('myId')          // самый быстрый способ по ID
document.getElementsByClassName('name')  // HTMLCollection (живая)
document.getElementsByTagName('div')     // HTMLCollection (живая)
```

<Callout type="info">
`querySelector` / `querySelectorAll` принимают любые CSS-селекторы: `.class`, `#id`, `[attr]`, `parent > child`, `:not()`, `:nth-child()` и т.д.
</Callout>

## Создание элементов

```javascript
// Создаём элемент
const div = document.createElement('div')
const span = document.createElement('span')
const img = document.createElement('img')

// Настраиваем
div.className = 'card'
div.textContent = 'Привет!'

// Создание текстового узла
const text = document.createTextNode('Текст')

// Клонирование
const clone = div.cloneNode(true)  // true = глубокое клонирование
```

## Вставка в DOM

```javascript
const container = document.querySelector('.container')
const newEl = document.createElement('div')

// Современные методы
container.append(newEl)           // в конец (может принимать строки)
container.prepend(newEl)          // в начало
container.before(newEl)           // перед container
container.after(newEl)            // после container

// Вставка на конкретную позицию
container.insertBefore(newEl, container.firstElementChild)

// insertAdjacentElement / insertAdjacentHTML
container.insertAdjacentHTML('beforeend', '<p>Текст</p>')
// 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
```

## Удаление и замена

```javascript
const el = document.querySelector('.old')

// Удаление
el.remove()                           // современный способ
el.parentNode.removeChild(el)         // старый способ

// Замена
el.replaceWith(newEl)                 // современный
el.parentNode.replaceChild(newEl, el) // старый
```

## innerHTML vs textContent

```javascript
const div = document.querySelector('div')

// textContent — только текст, безопасно
div.textContent = '<b>Жирный</b>'
// Выведет буквально: <b>Жирный</b> (без HTML разметки)

// innerHTML — парсит HTML, ОПАСНО с пользовательским вводом!
div.innerHTML = '<b>Жирный</b>'
// Выведет: Жирный (с форматированием)

// НИКОГДА не делайте так:
const userInput = '<script>alert("XSS")</script>'
div.innerHTML = userInput  // XSS уязвимость!

// Безопасно:
div.textContent = userInput // отображается как текст
```

<DeepDive title="Parsing HTML без XSS: DOMParser и sanitize">

```javascript
// DOMParser для безопасного парсинга HTML
const parser = new DOMParser()
const doc = parser.parseFromString('<b>Привет</b>', 'text/html')
const bold = doc.querySelector('b')
container.appendChild(bold.cloneNode(true))

// В современных браузерах: Element.setHTML (с sanitizer)
// container.setHTML('<b>text</b>', { sanitizer: new Sanitizer() })

// Простая санитация пользовательского ввода:
function sanitize(html) {
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML // все теги экранированы
}
```
</DeepDive>
