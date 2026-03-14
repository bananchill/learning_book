import { Callout } from '@book/ui'

# Шпаргалка: DOM API

## Поиск элементов

```javascript
document.querySelector('.class')          // первый
document.querySelectorAll('li')           // все (статический)
document.getElementById('id')             // по ID (быстро)
el.closest('.parent')                     // ближайший родитель
el.matches('.active')                     // проверить селектор
```

## Создание и вставка

```javascript
const el = document.createElement('div')
el.textContent = 'Текст'                  // безопасно
el.innerHTML = '<b>Жирный</b>'            // ОПАСНО с user input

parent.append(el)                         // в конец
parent.prepend(el)                        // в начало
existing.before(newEl)                    // перед
existing.after(newEl)                     // после
el.remove()                               // удалить
```

## Классы и стили

```javascript
el.classList.add('active')
el.classList.remove('active')
el.classList.toggle('active')
el.classList.contains('active')           // boolean

el.style.color = 'red'
el.style.fontSize = '16px'               // camelCase
getComputedStyle(el).color               // вычисленный стиль
```

## data-атрибуты

```javascript
el.dataset.userId = '42'                 // → data-user-id="42"
el.dataset.userId                        // '42' (строка)
delete el.dataset.role
```

## Производительность

```javascript
// Батчинг через DocumentFragment
const frag = document.createDocumentFragment()
items.forEach(item => frag.appendChild(createItem(item)))
container.appendChild(frag)             // 1 reflow

// Читать → потом писать (не чередовать)
const height = el.offsetHeight          // чтение
el.style.top = height + 'px'            // запись — OK
```

<Callout type="warning">
Никогда не вставляйте пользовательский ввод через innerHTML — это XSS уязвимость. Используйте textContent.
</Callout>
