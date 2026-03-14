import { Callout, DeepDive } from '@book/ui'

# Рекурсия

Рекурсия — функция, которая вызывает саму себя. Мощный инструмент для задач, которые можно разбить на меньшие подзадачи той же структуры.

## Структура рекурсивной функции

Каждая рекурсивная функция должна иметь:
1. **Базовый случай** — условие завершения рекурсии (без него — бесконечный стек)
2. **Рекурсивный случай** — вызов себя с уменьшенным аргументом

```javascript
function countdown(n) {
  // Базовый случай — остановиться при 0
  if (n <= 0) {
    console.log('Готово!');
    return;
  }

  console.log(n);
  countdown(n - 1); // Рекурсивный вызов с уменьшенным n
}

countdown(3);
// 3
// 2
// 1
// Готово!
```

## Классический пример: факториал

```javascript
// Рекурсивный факториал
function factorial(n) {
  if (n <= 1) return 1;       // Базовый случай
  return n * factorial(n - 1); // Рекурсивный случай
}

factorial(5); // 5 * 4 * 3 * 2 * 1 = 120

// Стек вызовов:
// factorial(5) = 5 * factorial(4)
//              = 5 * 4 * factorial(3)
//              = 5 * 4 * 3 * factorial(2)
//              = 5 * 4 * 3 * 2 * factorial(1)
//              = 5 * 4 * 3 * 2 * 1
//              = 120
```

## Когда рекурсия уместна

**Рекурсия хороша для:**
- Древовидных структур (обход DOM, файловой системы)
- Алгоритмов "разделяй и властвуй" (quicksort, merge sort)
- Задач, где решение выражается через меньшее подрешение

```javascript
// Обход вложенных комментариев
function renderComments(comments) {
  return comments.map(comment => ({
    text: comment.text,
    replies: comment.replies.length
      ? renderComments(comment.replies) // Рекурсия для вложенных
      : []
  }));
}
```

<Callout type="warning">
JavaScript имеет ограниченный размер стека вызовов (обычно ~10 000 — 15 000 кадров). Глубокая рекурсия вызовет `RangeError: Maximum call stack size exceeded`.
</Callout>

## Stack Overflow и его предотвращение

```javascript
// Опасно — стек может переполниться для больших n
function sum(n) {
  if (n <= 0) return 0;
  return n + sum(n - 1);
}
sum(100000); // RangeError!

// Итеративная версия — безопасна
function sumIterative(n) {
  let result = 0;
  for (let i = 1; i <= n; i++) result += i;
  return result;
}
```

<DeepDive title="Хвостовая рекурсия (TCO)">

Хвостовой вызов — рекурсивный вызов как последнее действие функции. Теоретически движок может оптимизировать такой вызов, не добавляя новый кадр стека:

```javascript
// НЕ хвостовая — результат factorial(n-1) используется в умножении
function factorial(n) {
  return n * factorial(n - 1);
}

// Хвостовая — аккумулятор передаётся как аргумент
function factorialTCO(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTCO(n - 1, n * acc); // последнее действие — вызов
}
```

V8 поддерживает TCO только в строгом режиме и не всегда. На практике для больших данных лучше использовать итерацию.

</DeepDive>
