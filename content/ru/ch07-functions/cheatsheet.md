import { Callout } from '@book/ui'

# Шпаргалка: Функции

## Синтаксис

```javascript
// Declaration — поднимается
function name(params) { return value; }

// Expression — не поднимается
const name = function(params) { return value; };

// Arrow — нет this, arguments, prototype
const name = (params) => value;
const name = param => value;          // один параметр без скобок
const name = () => ({ key: value });  // возврат объекта
```

## Параметры

```javascript
function f(a, b = 10, ...rest) { }
//              ↑дефолт  ↑rest параметры (массив)
```

## Arrow vs обычная функция

| | Обычная | Стрелочная |
|---|---|---|
| `this` | Своё | Из окружения |
| `arguments` | Есть | Нет |
| `new` | Да | Нет |
| Методы | Да | Нет |

## Рекурсия — обязательные элементы

```javascript
function recurse(n) {
  if (base_case) return result; // ← базовый случай
  return recurse(smaller_n);    // ← рекурсивный вызов
}
```

<Callout type="tip">
Правило: если функция может быть написана итеративно без потери читаемости — пишите итеративно. Рекурсия оправдана для деревьев и рекурсивных структур данных.
</Callout>
