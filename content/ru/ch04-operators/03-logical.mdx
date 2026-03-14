import { Callout, DeepDive } from '@book/ui'

# Логические операторы

## && — логическое И

`&&` возвращает первый falsy-операнд, или последний, если все truthy:

```javascript
// Базовое использование
true && true    // true
true && false   // false
false && true   // false

// Short-circuit: если левая часть falsy — правая не вычисляется
false && expensiveOperation()  // expensiveOperation не вызовется!

// Возвращает значение, не просто true/false
'hello' && 'world'   // 'world' — обе truthy, вернул последнюю
null && 'world'      // null — первая falsy, вернул её
0 && 'world'         // 0
```

## || — логическое ИЛИ

`||` возвращает первый truthy-операнд, или последний, если все falsy:

```javascript
true || false    // true
false || true    // true
false || false   // false

// Классическое применение: значение по умолчанию
const name = userInput || 'Аноним';  // 'Аноним' если userInput falsy
const port = config.port || 3000;

// Ловушка: 0 и '' — тоже falsy!
const count = userCount || 10;  // Если userCount = 0, получим 10 — неправильно!
```

<Callout type="warning">
Используйте `||` для значений по умолчанию только если 0 и пустая строка недопустимы. Иначе используйте `??`.
</Callout>

## ?? — оператор нулевого слияния (ES2020)

`??` возвращает правый операнд только если левый — `null` или `undefined`:

```javascript
null ?? 'default'       // 'default'
undefined ?? 'default'  // 'default'
0 ?? 'default'          // 0 — не заменяется! 0 не null/undefined
'' ?? 'default'         // '' — не заменяется!
false ?? 'default'      // false — не заменяется!

// Правильный выбор для числовых настроек
const timeout = options.timeout ?? 3000;  // 0 — валидное значение!
const label = options.label ?? 'Default'; // '' — может быть валидно
```

## ! — логическое НЕ

```javascript
!true   // false
!false  // true
!0      // true — falsy-значение
!''     // true
!null   // true

// Двойное отрицание — приведение к boolean
!!0     // false
!!''    // false
!!42    // true
!!'hi'  // true
!!null  // false
```

## Практические паттерны

```javascript
// Условное выполнение
isLoggedIn && showDashboard();  // вместо if (isLoggedIn) showDashboard()

// Опциональное свойство (ES2020: ?.)
const city = user?.address?.city ?? 'Неизвестно';

// Присваивание с дефолтом (logical assignment, ES2021)
config.host ||= 'localhost';   // если host falsy — установить localhost
config.timeout ??= 3000;       // если timeout null/undefined — установить 3000
```

<DeepDive title="Порядок выполнения логических операторов">

Приоритет (от высшего к низшему):
1. `!` (НЕ)
2. `&&` (И)
3. `||` (ИЛИ)
4. `??` (нулевое слияние)

```javascript
// Внимание: нельзя смешивать ?? с || и && без скобок!
a || b ?? c   // SyntaxError в большинстве случаев
(a || b) ?? c // OK — явные скобки
```

</DeepDive>
