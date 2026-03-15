---
title: "Свойства: optional, readonly, index signatures"
parent: "ch34-ts-object-types"
order: 1
---

## Объектные типы в TypeScript

В TypeScript объектный тип описывает форму объекта — его свойства и их типы. Объектный тип можно задать тремя способами:

```ts
// 1. Анонимный объектный тип
function greet(person: { name: string; age: number }) {
  return `Привет, ${person.name}!`;
}

// 2. Интерфейс
interface Person {
  name: string;
  age: number;
}

// 3. Псевдоним типа (type alias)
type Person = {
  name: string;
  age: number;
};
```

Каждое свойство в объектном типе описывает имя и тип. Свойства разделяются точкой с запятой `;` или запятой `,`.

## Необязательные свойства (Optional Properties)

Многие объекты в реальном коде имеют свойства, которые могут отсутствовать. Для обозначения необязательного свойства добавляется `?` после имени:

```ts
interface PaintOptions {
  shape: string;
  xPos?: number;
  yPos?: number;
}

function paintShape(opts: PaintOptions) {
  // xPos и yPos могут быть undefined
  const xPos = opts.xPos; // number | undefined
  const yPos = opts.yPos; // number | undefined
  console.log(`x: ${xPos}, y: ${yPos}`);
}

// Все варианты вызова корректны
paintShape({ shape: "circle" });
paintShape({ shape: "circle", xPos: 100 });
paintShape({ shape: "circle", xPos: 100, yPos: 200 });
```

При чтении необязательного свойства TypeScript сообщает, что оно может быть `undefined`. Это значит, что ты должен обработать отсутствие значения:

```ts
function paintShape(opts: PaintOptions) {
  // Вариант 1: значение по умолчанию через оператор ??
  const xPos = opts.xPos ?? 0;
  const yPos = opts.yPos ?? 0;
  console.log(`x: ${xPos}, y: ${yPos}`);
}
```

Можно использовать деструктуризацию с значениями по умолчанию:

```ts
function paintShape({ shape, xPos = 0, yPos = 0 }: PaintOptions) {
  console.log(`Рисуем ${shape} в (${xPos}, ${yPos})`);
}
```

> Обратите внимание: в деструктуризации нет синтаксиса для аннотации типа. Конструкция `{ shape: Shape }` — это переименование переменной в `Shape`, а не аннотация типа.

## Свойства только для чтения (readonly)

Модификатор `readonly` указывает, что свойство нельзя перезаписать:

```ts
interface SurfaceArea {
  readonly width: number;
  readonly height: number;
}

function calculateArea(surface: SurfaceArea) {
  // Чтение — OK
  const area = surface.width * surface.height;

  // Запись — ошибка!
  // Cannot assign to 'width' because it is a read-only property.
  surface.width = 10;

  return area;
}
```

`readonly` не делает свойство неизменяемым на уровне рантайма — это чисто проверка на уровне TypeScript. Она защищает от случайной перезаписи при разработке.

### readonly не означает глубокую неизменяемость

Важная деталь: `readonly` применяется только к самому свойству, а не к его содержимому:

```ts
interface Home {
  readonly resident: { name: string; age: number };
}

function updateResident(home: Home) {
  // Можно менять свойства вложенного объекта
  home.resident.age++; // OK

  // Нельзя заменить сам объект
  // Cannot assign to 'resident' because it is a read-only property.
  home.resident = { name: "Новый", age: 25 };
}
```

### readonly при проверке совместимости

TypeScript не учитывает `readonly` при проверке совместимости типов:

```ts
interface ReadonlyPerson {
  readonly name: string;
  readonly age: number;
}

interface MutablePerson {
  name: string;
  age: number;
}

let writable: MutablePerson = { name: "Alice", age: 25 };
let readable: ReadonlyPerson = writable; // OK

writable.name = "Bob"; // OK — через writable можно менять
// readable.name = "Bob"; // Ошибка — через readable нельзя
```

Это значит, что `readonly` — это контрактное ограничение, а не абсолютная гарантия неизменяемости.

## Проверка лишних свойств (Excess Property Checks)

Когда ты создаёшь объектный литерал и присваиваешь его типизированной переменной, TypeScript проверяет наличие «лишних» свойств:

```ts
interface SquareConfig {
  color?: string;
  width?: number;
}

function createSquare(config: SquareConfig) {
  return { color: config.color || "red", area: (config.width || 20) ** 2 };
}

// Ошибка: Object literal may only specify known properties,
// and 'colour' does not exist in type 'SquareConfig'
createSquare({ colour: "red", width: 100 });
```

Здесь `colour` — опечатка. TypeScript ловит её, потому что применяет *проверку лишних свойств* к объектным литералам. Эта проверка срабатывает **только** для литералов — если передать объект через переменную, проверки не будет:

```ts
const config = { colour: "red", width: 100 };
createSquare(config); // OK — лишнее свойство не проверяется
```

Если нужно разрешить дополнительные свойства, используй индексную сигнатуру:

```ts
interface SquareConfig {
  color?: string;
  width?: number;
  [key: string]: unknown; // Разрешаем любые дополнительные свойства
}
```

## Индексные сигнатуры (Index Signatures)

Иногда ты не знаешь все имена свойств заранее, но знаешь их тип. Индексная сигнатура описывает тип ключей и тип значений:

```ts
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ["Привет", "Мир"];
const item = myArray[0]; // string
```

Индексная сигнатура говорит: «когда `StringArray` индексируется числом, возвращается `string`».

### Строковые индексы

```ts
interface NumberDictionary {
  [key: string]: number;
  length: number; // OK — number совместим с сигнатурой
  // name: string; // Ошибка: 'string' is not assignable to 'number'
}
```

Если у типа есть строковая индексная сигнатура, все явно объявленные свойства должны возвращать тип, совместимый с типом индексной сигнатуры.

### Объединения в индексных сигнатурах

Тип значения индексной сигнатуры может быть объединением:

```ts
interface NumberOrStringDictionary {
  [key: string]: number | string;
  length: number;   // OK
  name: string;     // OK — string совместим с number | string
}
```

### readonly для индексных сигнатур

Можно запретить запись по индексу:

```ts
interface ReadonlyStringArray {
  readonly [index: number]: string;
}

const arr: ReadonlyStringArray = ["Alice", "Bob"];
// arr[0] = "Mallory"; // Ошибка: readonly
```

## Итоги

| Модификатор | Синтаксис | Назначение |
|-------------|-----------|------------|
| Optional | `prop?: type` | Свойство может отсутствовать |
| Readonly | `readonly prop: type` | Нельзя перезаписать свойство |
| Index signature | `[key: string]: type` | Произвольные ключи |
| Readonly index | `readonly [key: string]: type` | Произвольные ключи без записи |
