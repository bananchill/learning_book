import { Callout, DeepDive } from '@book/ui'

# Сортировка и поиск

## sort — сортировка (мутирующий!)

`sort()` без аргумента сортирует как строки — что ломает числа:

```javascript
// Строковая сортировка по умолчанию
['banana', 'apple', 'cherry'].sort()
// ['apple', 'banana', 'cherry'] ✓

[10, 1, 5, 2].sort()
// [1, 10, 2, 5] ✗ — '10' < '2' лексикографически!

// Числовая сортировка — нужна функция сравнения
[10, 1, 5, 2].sort((a, b) => a - b)
// [1, 2, 5, 10] ✓

// По убыванию
[10, 1, 5, 2].sort((a, b) => b - a)
// [10, 5, 2, 1] ✓
```

### Сортировка объектов

```javascript
const users = [
  { name: 'Пётр', age: 30 },
  { name: 'Иван', age: 25 },
  { name: 'Мария', age: 28 }
];

// По возрасту
users.sort((a, b) => a.age - b.age);

// По имени (строки)
users.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
```

<Callout type="warning">
`sort()` мутирует оригинальный массив! Если нужно сохранить порядок — используйте `toSorted()` (ES2023) или `[...arr].sort()`.
</Callout>

## toSorted — немутирующий sort (ES2023)

```javascript
const original = [3, 1, 2];
const sorted = original.toSorted((a, b) => a - b);
// sorted = [1, 2, 3]
// original = [3, 1, 2] — не изменился!
```

## includes и indexOf — поиск значения

```javascript
const arr = [1, 2, 3, 'hello', NaN];

// includes — есть ли значение (boolean)
arr.includes(2)      // true
arr.includes('world') // false
arr.includes(NaN)    // true — включает NaN!

// indexOf — индекс первого вхождения
arr.indexOf(2)       // 1
arr.indexOf('world') // -1
arr.indexOf(NaN)     // -1 — не находит NaN (использует ===)
```

## flat и flatMap

```javascript
// flat — разворачивает вложенность
[1, [2, 3], [4, [5, 6]]].flat()       // [1, 2, 3, 4, [5, 6]] — 1 уровень
[1, [2, 3], [4, [5, 6]]].flat(2)      // [1, 2, 3, 4, 5, 6] — 2 уровня
[1, [2, [3, [4]]]].flat(Infinity)     // [1, 2, 3, 4] — все уровни

// flatMap — map + flat(1) за один проход
['hello world', 'foo bar'].flatMap(str => str.split(' '))
// ['hello', 'world', 'foo', 'bar']
```

<DeepDive title="Стабильность сортировки">

До ES2019 спецификация не гарантировала стабильность сортировки в V8. Стабильная сортировка — элементы с одинаковым ключом сохраняют взаимный порядок.

С ES2019 все методы сортировки обязаны быть стабильными. V8 использует TimSort — комбинацию merge sort и insertion sort, гарантирующую O(n log n) и стабильность.

Это важно при сортировке по нескольким полям: `users.sort((a, b) => a.age - b.age || a.name.localeCompare(b.name))`.

</DeepDive>
