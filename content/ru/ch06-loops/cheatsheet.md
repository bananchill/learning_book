import { Callout } from '@book/ui'

# Шпаргалка: Циклы

## Когда что использовать

| Цикл | Применение |
|---|---|
| `for` | Счётчик, итерация с индексом |
| `while` | Неизвестное число итераций |
| `do...while` | Минимум одна итерация |
| `for...of` | Итерация по значениям итерируемого |
| `for...in` | Ключи объекта (с осторожностью) |

## Синтаксис

```javascript
for (let i = 0; i < n; i++) { }

while (condition) { }

do { } while (condition);

for (const item of iterable) { }

for (const key of Object.keys(obj)) { }
```

## break и continue

```javascript
for (const x of arr) {
  if (x === skip) continue;  // пропустить
  if (x === stop) break;     // выйти из цикла
}
```

## Цикл vs метод

```javascript
// Нужен break → цикл
for (const item of arr) {
  if (item.match) { result = item; break; }
}

// Нет break → метод (предпочтительно)
const result = arr.find(item => item.match);
```

<Callout type="tip">
Правило: если можно использовать `find`, `some`, `every`, `map`, `filter`, `reduce` — используйте их вместо цикла. Код читается декларативно.
</Callout>
