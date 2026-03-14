import { Callout } from '@book/ui'

# Шпаргалка: Операторы и выражения

## Арифметика

```javascript
+  -  *  /  %  **    // основные
1 + '2'  // '12' — конкатенация при строке
+'42'    // 42   — унарный + приводит к числу
```

## && || ?? в одной строке

| Оператор | Возвращает | Когда использовать |
|---|---|---|
| `a && b` | a если falsy, иначе b | Условное выполнение |
| `a \|\| b` | a если truthy, иначе b | Дефолт (не для 0/'') |
| `a ?? b` | a если не null/undefined | Дефолт для любых falsy |

## Деструктуризация

```javascript
// Массив
const [a, b, ...rest] = [1, 2, 3, 4];

// Объект с переименованием и дефолтом
const { name: n = 'Аноним', age = 0 } = user;

// В параметрах функции
function greet({ name, role = 'user' }) { }
```

## Spread и Rest

```javascript
// Spread: разворачивает
const merged = { ...obj1, ...obj2 };
const copy = [...arr];
fn(...args);

// Rest: собирает оставшееся
const [first, ...others] = arr;
const { id, ...data } = obj;
function fn(a, b, ...rest) { }
```

<Callout type="tip">
Запомните: spread "рассыпает" в разные места, rest "собирает" в одно место. Оба используют `...` но в противоположных направлениях.
</Callout>
