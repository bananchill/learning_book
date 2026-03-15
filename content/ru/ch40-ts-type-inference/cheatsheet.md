# Шпаргалка: Вывод типов и совместимость

## Вывод типов (Type Inference)

```typescript
// Базовый вывод
let x = 3;             // number
const y = 3;           // 3 (литерал)
let arr = [1, "a"];    // (number | string)[]

// Best common type -- выбирается из кандидатов
let zoo = [new Cat(), new Dog()]; // (Cat | Dog)[]

// Contextual typing -- тип из контекста
window.addEventListener("click", (e) => {
  e.clientX; // e: MouseEvent -- выведен из контекста
});

// Вывод в дженериках
function identity<T>(v: T): T { return v; }
identity("hi"); // T = string
```

## Структурная совместимость

```typescript
// S совместим с T, если S содержит все свойства T
interface HasName { name: string }
interface Person { name: string; age: number }

let named: HasName = { name: "Алиса", age: 30 } as Person; // OK
// Person -> HasName: OK (Person имеет name)
// HasName -> Person: Ошибка (нет age)
```

## Совместимость функций

```typescript
// Меньше параметров -> совместимо с большим числом
let f1 = (a: number) => 0;
let f2 = (a: number, b: number) => 0;
f2 = f1; // OK

// Возвращаемый тип: ковариантность
let getAnimal: () => Animal;
let getCat: () => Cat;
getAnimal = getCat; // OK: Cat <: Animal

// Параметры (strict): контравариантность
let handleAnimal: (a: Animal) => void;
let handleCat: (a: Cat) => void;
handleCat = handleAnimal; // OK: контравариантность
```

## Вариантность

| Позиция | Направление | Правило |
|---------|------------|---------|
| Возвращаемый тип | Ковариантность | `() => Cat` <: `() => Animal` |
| Параметр (strict) | Контравариантность | `(Animal) => void` <: `(Cat) => void` |
| Параметр (не-strict) | Бивариантность | Оба направления |
| Method syntax | Бивариантность | Всегда, даже при strict |

## Совместимость enum и классов

```typescript
// Разные enum несовместимы
enum A { X }
enum B { X }
// let a: A = B.X; // Ошибка

// Классы: сравниваются только instance-члены
// private/protected нарушают совместимость
```

## Аннотации вариантности (TS 4.7+)

```typescript
type Producer<out T> = () => T;            // ковариантный
type Consumer<in T> = (v: T) => void;      // контравариантный
type Mapper<in T, out U> = (v: T) => U;    // контра- T, ко- U
type ReadWrite<in out T> = { get(): T; set(v: T): void }; // инвариантный
```

## Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| Excess property check | Объектный литерал с лишним свойством | Через промежуточную переменную или расширьте тип |
| Widening | `let x = "hi"` -> `string`, а не `"hi"` | Используйте `as const` или `const` |
| Unsound array covariance | `Cat[]` можно присвоить `Animal[]` | Используйте `readonly` массивы |
| Бивариантность методов | Method syntax не проверяется strict | Используйте function property syntax |
