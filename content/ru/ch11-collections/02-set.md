import { Callout, DeepDive } from '@book/ui'

# Set — множество уникальных значений

Set хранит коллекцию значений, где **каждое значение встречается только один раз**. Повторная попытка добавить существующее значение просто игнорируется. Это делает Set идеальным инструментом для работы с уникальными данными.

## Создание и методы

Set создаётся конструктором `new Set()`. Основные методы — `add`, `has`, `delete` и `clear`.

```javascript
const set = new Set();

// Добавляем значения
set.add(1);
set.add(2);
set.add(3);
set.add(2); // дубликат — игнорируется

console.log(set.size); // 3 (не 4!)

// Проверяем наличие
console.log(set.has(2)); // true
console.log(set.has(5)); // false

// Удаляем значение
set.delete(2);
console.log(set.size); // 2

// Очищаем
set.clear();
console.log(set.size); // 0
```

Метод `add` возвращает сам Set, поэтому вызовы можно объединять в цепочку.

```javascript
const tags = new Set()
  .add('javascript')
  .add('typescript')
  .add('vue');
```

## Удаление дубликатов

Самый частый сценарий использования Set — быстрое удаление дубликатов из массива. Паттерн `[...new Set(array)]` стал стандартным приёмом.

```javascript
const numbers = [1, 2, 3, 2, 1, 4, 5, 4, 3];
const unique = [...new Set(numbers)];
console.log(unique); // [1, 2, 3, 4, 5]

// Работает и со строками
const words = ['кот', 'собака', 'кот', 'рыба', 'собака'];
const uniqueWords = [...new Set(words)];
console.log(uniqueWords); // ['кот', 'собака', 'рыба']

// Подсчёт уникальных символов в строке
const text = 'абракадабра';
const uniqueChars = new Set(text);
console.log(uniqueChars.size); // 5 (а, б, р, к, д)
```

## Итерация

Set поддерживает `for...of` и `forEach`. Порядок элементов совпадает с порядком их добавления.

```javascript
const languages = new Set(['JavaScript', 'Python', 'Go', 'Rust']);

// for...of
for (const lang of languages) {
  console.log(lang);
}

// forEach (первые два аргумента одинаковы — у Set нет ключей)
languages.forEach((value, sameValue) => {
  console.log(value === sameValue); // true
});

// Конвертация в массив для методов массива
const sorted = [...languages].sort();
console.log(sorted); // ['Go', 'JavaScript', 'Python', 'Rust']
```

<Callout type="info">
Set использует алгоритм SameValueZero для проверки уникальности — так же, как Map сравнивает ключи. Поэтому `NaN` в Set может быть только один, а объекты сравниваются по ссылке.
</Callout>

## Операции над множествами

Математические операции над множествами — объединение, пересечение, разность — часто нужны при фильтрации данных. В ES2025 появились встроенные методы, но полезно знать и ручные реализации.

Ручные реализации через spread и `filter` работают в любом окружении.

```javascript
const frontend = new Set(['JS', 'TS', 'HTML', 'CSS']);
const backend = new Set(['JS', 'TS', 'Python', 'Go']);

// Объединение (union) — все элементы из обоих множеств
const union = new Set([...frontend, ...backend]);
console.log([...union]); // ['JS', 'TS', 'HTML', 'CSS', 'Python', 'Go']

// Пересечение (intersection) — только общие элементы
const intersection = new Set([...frontend].filter(x => backend.has(x)));
console.log([...intersection]); // ['JS', 'TS']

// Разность (difference) — элементы из первого, которых нет во втором
const difference = new Set([...frontend].filter(x => !backend.has(x)));
console.log([...difference]); // ['HTML', 'CSS']
```

Встроенные методы ES2025 делают то же самое, но читаются нагляднее и работают эффективнее на больших коллекциях.

```javascript
// ES2025 — встроенные методы Set
const union2 = frontend.union(backend);
const intersection2 = frontend.intersection(backend);
const difference2 = frontend.difference(backend);

// Проверка подмножества
const webCore = new Set(['JS', 'HTML', 'CSS']);
console.log(webCore.isSubsetOf(frontend));   // true
console.log(frontend.isSupersetOf(webCore)); // true

// Проверка отсутствия пересечений
const python = new Set(['Python', 'Django']);
console.log(python.isDisjointFrom(new Set(['JS', 'TS']))); // true
```
