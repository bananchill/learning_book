import { Callout, DeepDive } from '@book/ui'

# break, continue, метки

## break — выход из цикла

`break` немедленно завершает выполнение цикла:

```javascript
// Поиск первого элемента
const nums = [3, 7, 2, 8, 4];
let found = -1;

for (let i = 0; i < nums.length; i++) {
  if (nums[i] > 5) {
    found = nums[i];
    break; // Нашли — дальше не ищем
  }
}
console.log(found); // 7

// break в while — безопасный выход
let attempts = 0;
while (true) {
  const result = tryConnect();
  if (result.success) break;
  if (++attempts >= 3) break;
}
```

## continue — пропуск итерации

`continue` пропускает текущую итерацию и переходит к следующей:

```javascript
// Вывод только чётных чисел
for (let i = 0; i < 10; i++) {
  if (i % 2 !== 0) continue; // нечётные — пропускаем
  console.log(i); // 0, 2, 4, 6, 8
}

// Обработка валидных элементов
for (const item of items) {
  if (!item.isValid()) continue; // невалидные пропускаем
  processItem(item);
}
```

<Callout type="tip">
`continue` часто используется как "guard clause" внутри цикла — для пропуска граничных случаев без глубокой вложенности.
</Callout>

## Метки (labels)

Метки позволяют управлять вложенными циклами — выходить из внешнего цикла изнутри внутреннего:

```javascript
// Без меток — break выходит только из внутреннего цикла
outer: for (let i = 0; i < 3; i++) {
  inner: for (let j = 0; j < 3; j++) {
    if (i === 1 && j === 1) {
      break outer; // Выходим из ВНЕШНЕГО цикла
    }
    console.log(`${i},${j}`);
  }
}
// Выводит: 0,0  0,1  0,2  1,0  — и остановился

// continue с меткой — пропустить итерацию внешнего цикла
outer: for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (j === 1) continue outer; // Переходим к следующей итерации ВНЕШНЕГО
    console.log(`${i},${j}`);
  }
}
// Выводит: 0,0  1,0  2,0
```

<Callout type="warning">
Метки — редко используемая функция. Если видите необходимость в метке, подумайте: может лучше вынести вложенный цикл в отдельную функцию?
</Callout>

<DeepDive title="Метки vs вынесение в функцию">

Метки появились в JavaScript ещё до того, как стало ясно, что код с ними трудно читать. Современная альтернатива — вынести тело цикла в функцию:

```javascript
// С меткой — сложнее читать
outer: for (const row of matrix) {
  for (const cell of row) {
    if (cell === target) break outer;
  }
}

// С функцией — чище
function findInMatrix(matrix, target) {
  for (const row of matrix) {
    for (const cell of row) {
      if (cell === target) return true; // return заменяет break outer
    }
  }
  return false;
}
```

</DeepDive>
