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

## Бинарный поиск — быстрый поиск в отсортированном массиве

Методы `find`, `indexOf`, `includes` перебирают массив последовательно — это **линейный поиск** O(n). Для массива из миллиона элементов это миллион проверок. Если массив **отсортирован**, можно использовать **бинарный поиск** O(log n) — он на каждом шаге отбрасывает половину массива. Миллион элементов → всего ~20 сравнений:

```javascript
function binarySearch(sortedArr, target) {
  let left = 0;
  let right = sortedArr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (sortedArr[mid] === target) return mid;       // нашли
    if (sortedArr[mid] < target) left = mid + 1;     // ищем в правой половине
    else right = mid - 1;                            // ищем в левой половине
  }

  return -1; // не найдено
}

const sorted = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
binarySearch(sorted, 23); // 5 (индекс)
binarySearch(sorted, 10); // -1 (не найдено)
```

<Callout type="tip">
Бинарный поиск работает **только** с отсортированным массивом. Если массив не отсортирован, сначала отсортируйте его (`toSorted`) — но учтите, что `sort` стоит O(n log n), поэтому бинарный поиск выгоден, если вы ищете по одному массиву многократно.
</Callout>

## includes и indexOf — поиск значения

`includes` — простая проверка «есть ли элемент в массиве» (возвращает `boolean`). `indexOf` — возвращает позицию первого вхождения (или `-1`). Ключевое отличие: `includes` корректно находит `NaN`, а `indexOf` — нет (он использует `===`, а `NaN !== NaN`):

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

Метод `flat` «выравнивает» вложенные массивы до указанной глубины — по умолчанию один уровень, а `Infinity` разворачивает все уровни. Метод `flatMap` совмещает `map` и `flat(1)` в одном проходе, что удобно когда callback возвращает массив — например, при разбиении строк на слова или при раскрытии вложенных структур.

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
