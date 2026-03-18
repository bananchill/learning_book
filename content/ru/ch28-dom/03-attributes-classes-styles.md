import { Callout } from '@book/ui'

# Атрибуты, классы, стили

## Атрибуты

HTML-атрибуты и DOM-свойства -- это связанные, но не тождественные понятия. Атрибуты задаются в HTML-разметке и доступны через методы `getAttribute`/`setAttribute`. DOM-свойства -- это свойства JavaScript-объектов, которые браузер создаёт на основе атрибутов. В большинстве случаев они синхронизированы, но есть исключения: например, `input.value` как DOM-свойство отражает текущее значение поля, а `getAttribute('value')` -- начальное значение из разметки.

```javascript
const input = document.querySelector('input')

// getAttribute / setAttribute / removeAttribute
input.getAttribute('type')          // 'text'
input.setAttribute('placeholder', 'Введите имя')
input.removeAttribute('disabled')
input.hasAttribute('required')      // true/false

// Прямые свойства DOM (не всегда совпадают с атрибутами!)
input.value          // текущее значение поля (DOM свойство)
input.defaultValue   // начальное значение (из атрибута value)
input.disabled       // boolean (DOM свойство)
input.type           // 'text', 'email' и т.д.

// ВАЖНО: getAttribute('class') vs el.className
input.getAttribute('class')  // строка из HTML
input.className              // текущее значение (то же самое)
input.classList              // DOMTokenList — удобнее
```

## classList

Свойство `classList` предоставляет удобный объект `DOMTokenList` для работы с CSS-классами элемента. В отличие от `className`, которое возвращает строку и требует ручного разбора, `classList` позволяет добавлять, удалять, переключать и проверять отдельные классы через понятные методы. Это исключает типичные ошибки, связанные с конкатенацией строк и случайным удалением существующих классов.

```javascript
const btn = document.querySelector('button')

// Добавить класс
btn.classList.add('active')
btn.classList.add('loading', 'disabled')  // несколько сразу

// Удалить класс
btn.classList.remove('loading')

// Переключить (добавить если нет, удалить если есть)
btn.classList.toggle('active')
btn.classList.toggle('active', true)   // только добавить
btn.classList.toggle('active', false)  // только удалить

// Проверить наличие
btn.classList.contains('active')  // true/false

// Заменить один класс другим
btn.classList.replace('old-class', 'new-class')

// Итерация
btn.classList.forEach(cls => console.log(cls))
[...btn.classList]  // преобразовать в массив
```

<Callout type="tip">
Используйте `classList` вместо прямой работы с `className`. Это безопаснее — не нужно парсить строку вручную.
</Callout>

## dataset -- кастомные атрибуты data-*

Атрибуты `data-*` позволяют хранить произвольные данные прямо в HTML-элементах, не нарушая стандарт. В JavaScript к ним можно обращаться через свойство `dataset`, при этом имена автоматически преобразуются из kebab-case (`data-user-id`) в camelCase (`dataset.userId`). Все значения в `dataset` являются строками, поэтому числовые данные нужно преобразовывать вручную.

```javascript
// HTML: <div data-user-id="42" data-role="admin"></div>
const div = document.querySelector('[data-user-id]')

// Чтение (camelCase вместо kebab-case)
div.dataset.userId  // '42' (строка!)
div.dataset.role    // 'admin'

// Запись
div.dataset.lastSeen = Date.now()
// Создаст атрибут data-last-seen="..."

// Удаление
delete div.dataset.role

// Итерация по всем data-атрибутам
for (const [key, value] of Object.entries(div.dataset)) {
  console.log(key, value)
}
```

## Стили

Существует два подхода к управлению стилями из JavaScript. Первый -- inline-стили через свойство `style`, которое напрямую устанавливает значения в атрибут `style` элемента. Второй -- управление CSS-классами (через `classList`), что предпочтительнее для поддержки и переиспользования. Для чтения итоговых вычисленных стилей, включая значения из внешних таблиц стилей, используется `window.getComputedStyle()`.

```javascript
const box = document.querySelector('.box')

// Прямая установка inline стилей
box.style.color = 'red'
box.style.fontSize = '16px'  // camelCase!
box.style.backgroundColor = '#f0f0f0'

// Множественные стили через cssText (перезаписывает все)
box.style.cssText = 'color: red; font-size: 16px; margin: 0'

// Удаление стиля
box.style.color = ''  // очищает inline стиль

// Получение вычисленных стилей (включая CSS из таблиц стилей)
const computed = window.getComputedStyle(box)
computed.color         // 'rgb(255, 0, 0)'
computed.fontSize      // '16px'
computed.display       // 'block'
// computed.color = 'blue' — ошибка! getComputedStyle только для чтения
```
