import { Callout, DeepDive } from '@book/ui'

# DOM-дерево

## Что такое DOM

DOM — это объектная модель HTML-документа. Браузер парсит HTML и строит дерево объектов:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Страница</title>
  </head>
  <body>
    <h1>Заголовок</h1>
    <p>Абзац</p>
  </body>
</html>
```

Это дерево выглядит так:

```
Document
└── html (Element)
    ├── head (Element)
    │   └── title (Element)
    │       └── "Страница" (Text)
    └── body (Element)
        ├── h1 (Element)
        │   └── "Заголовок" (Text)
        └── p (Element)
            └── "Абзац" (Text)
```

## Типы узлов

Каждый узел в DOM-дереве имеет определённый тип, обозначаемый числовым значением `nodeType`. Элементы, текстовые узлы, комментарии и сам документ -- все они являются узлами, но различаются по типу. Понимание типов узлов важно, потому что от этого зависит, какие свойства и методы доступны для каждого конкретного узла.

```javascript
// Основные типы узлов
document.nodeType         // 9 — Document
document.body.nodeType    // 1 — Element
document.createTextNode('text').nodeType  // 3 — Text
document.createComment('...').nodeType    // 8 — Comment

// Константы
Node.ELEMENT_NODE    // 1
Node.TEXT_NODE       // 3
Node.COMMENT_NODE    // 8
Node.DOCUMENT_NODE   // 9
```

## Traversal -- обход дерева

DOM предоставляет набор свойств для навигации по дереву в трёх направлениях: от узла к родителю (`parentNode`), от родителя к детям (`childNodes`, `children`) и между соседними узлами одного уровня (`nextSibling`, `previousSibling`). Важно различать свойства, возвращающие любые узлы (включая текстовые), и свойства, возвращающие только элементы -- на практике чаще нужны именно элементы.

```javascript
const ul = document.querySelector('ul')

// Родительский узел
ul.parentNode         // ближайший родитель (любой узел)
ul.parentElement      // ближайший родитель-элемент

// Дочерние узлы
ul.childNodes         // NodeList: все дочерние узлы (включая текст)
ul.children           // HTMLCollection: только дочерние Elements
ul.firstChild         // первый дочерний узел (может быть текстом)
ul.firstElementChild  // первый дочерний Element
ul.lastChild
ul.lastElementChild

// Соседние узлы
ul.nextSibling         // следующий сосед (любой узел)
ul.nextElementSibling  // следующий Element-сосед
ul.previousElementSibling
```

<Callout type="warning">
`childNodes` включает текстовые узлы (пробелы и переносы строк в HTML). `children` — только элементы. Чаще всего нужен именно `children`.
</Callout>

<DeepDive title="Живые коллекции vs статические снимки">

`HTMLCollection` и `NodeList` (от `querySelectorAll`) ведут себя по-разному:

```javascript
const ul = document.querySelector('ul')

// HTMLCollection — ЖИВАЯ (отражает изменения DOM)
const liveItems = ul.children
console.log(liveItems.length)  // 3

ul.appendChild(document.createElement('li'))
console.log(liveItems.length)  // 4 — автоматически обновилась!

// NodeList от querySelectorAll — СТАТИЧЕСКИЙ снимок
const staticItems = ul.querySelectorAll('li')
console.log(staticItems.length)  // 3

ul.appendChild(document.createElement('li'))
console.log(staticItems.length)  // 3 — не изменился!
```

Это важно при итерации: модификация DOM во время обхода `HTMLCollection` может дать непредсказуемые результаты. Безопаснее конвертировать в массив: `Array.from(ul.children)`.
</DeepDive>
