import { Callout, DeepDive } from '@book/ui'

# switch / case

Когда переменную нужно сравнить с множеством конкретных значений, `if/else if` превращается в длинную лестницу одинаковых проверок. `switch` делает то же самое, но в более компактной и структурированной форме — он берёт одно выражение и поочерёдно проверяет его против нескольких `case`-вариантов.

## Синтаксис

```javascript
const day = 'Monday';

switch (day) {
  case 'Monday':
    console.log('Понедельник');
    break; // Без break — выполнение "провалится" в следующий case!
  case 'Tuesday':
    console.log('Вторник');
    break;
  default:
    console.log('Другой день');
}
```

## Fall-through — намеренный и случайный

Главная ловушка `switch` — **fall-through** (проваливание). Если не написать `break` после `case`, выполнение «проваливается» в следующий `case`, игнорируя его условие. Это поведение унаследовано от языка C и является частой причиной багов. Однако иногда fall-through используется намеренно — для группировки нескольких `case` с одним действием:

```javascript
// Случайный fall-through — баг!
switch (status) {
  case 'active':
    activateUser(); // Если забыть break — выполнится и deactivateUser!
  case 'inactive':
    deactivateUser();
    break;
}

// Намеренный fall-through — несколько case с одним действием
switch (day) {
  case 'Saturday':
  case 'Sunday':
    console.log('Выходной'); // Оба case ведут сюда
    break;
  default:
    console.log('Рабочий день');
}
```

<Callout type="warning">
Всегда заканчивайте каждый `case` оператором `break`, `return` или `throw`. Намеренный fall-through документируйте комментарием `// falls through`.
</Callout>

## switch использует строгое сравнение ===

Важный нюанс: `switch` сравнивает значение выражения с каждым `case` через `===` (строгое сравнение). Это значит, что типы должны совпадать — строка `'1'` не совпадёт с числом `1`:

```javascript
const value = '1'; // Строка '1'

switch (value) {
  case 1:        // Число 1 — НЕ совпадёт! switch использует ===
    console.log('число один');
    break;
  case '1':      // Строка '1' — совпадёт
    console.log('строка один');
    break;
}
```

## Когда использовать switch vs if/else

**switch подходит когда:**
- Одна переменная сравнивается с несколькими конкретными значениями
- Много вариантов (4+) — switch читается чище
- Нужен fall-through для группировки случаев

**if/else лучше когда:**
- Условие — диапазон (`score > 80`)
- Условия разнородные и не связаны
- Мало вариантов (2-3)

```javascript
// Хорошо для switch
switch (httpMethod) {
  case 'GET': handleGet(); break;
  case 'POST': handlePost(); break;
  case 'PUT': handlePut(); break;
  case 'DELETE': handleDelete(); break;
  default: handleUnknown();
}

// Плохо для switch — диапазоны, лучше if/else
if (score >= 90) { grade = 'A'; }
else if (score >= 80) { grade = 'B'; }
```

<DeepDive title="switch с return — более чистый вариант">

В функциях вместо `break` можно использовать `return`:

```javascript
function getDayType(day) {
  switch (day) {
    case 'Saturday':
    case 'Sunday':
      return 'weekend';
    case 'Monday':
    case 'Friday':
      return 'workday';
    default:
      return 'workday';
  }
}
```

Это избавляет от необходимости в `break` и делает код чище.

</DeepDive>
