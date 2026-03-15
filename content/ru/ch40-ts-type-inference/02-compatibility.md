# Совместимость типов

Система типов TypeScript основана на **структурной типизации** (structural typing). Это значит, что совместимость двух типов определяется не по имени, а по *структуре* -- набору свойств и их типов.

## Структурное подтипирование

В номинальной системе типов (Java, C#) два типа совместимы, только если они явно связаны через `extends` или `implements`. В TypeScript всё иначе:

```typescript
interface Point {
  x: number;
  y: number;
}

interface Coordinate {
  x: number;
  y: number;
}

let point: Point = { x: 10, y: 20 };
let coord: Coordinate = point; // OK -- структуры совпадают
```

Типы `Point` и `Coordinate` полностью взаимозаменяемы, хотя между ними нет явной связи. TypeScript сравнивает их *структуры*.

### Правило совместимости

Тип `S` совместим с типом `T`, если `S` содержит *как минимум* все свойства `T`:

```typescript
interface Named {
  name: string;
}

interface Person {
  name: string;
  age: number;
}

let named: Named;
let person: Person = { name: "Алиса", age: 30 };

named = person; // OK -- Person имеет name: string

// Обратное присваивание -- ошибка
// person = named; // Ошибка: свойство age отсутствует в Named
```

> **Запомните:** «больше свойств = более специфичный тип». Специфичный тип можно присвоить менее специфичному, но не наоборот.

### Excess Property Checks (Проверка избыточных свойств)

Есть важное исключение из структурной совместимости -- **объектные литералы** проходят дополнительную проверку:

```typescript
interface Config {
  host: string;
  port: number;
}

// Ошибка: 'protocl' does not exist in type 'Config'
// (вероятно, опечатка в "protocol")
const config: Config = {
  host: "localhost",
  port: 3000,
  protocl: "https", // Ошибка!
};

// Через промежуточную переменную -- ошибки нет
const data = {
  host: "localhost",
  port: 3000,
  protocl: "https",
};
const config2: Config = data; // OK -- структурная совместимость
```

Эта проверка предотвращает опечатки и случайную передачу лишних свойств напрямую в объектных литералах.

## Сравнение функций

Совместимость функций -- одна из самых неинтуитивных тем в TypeScript. Правила отличаются для параметров и возвращаемых типов.

### Параметры функций

Функция с *меньшим* числом параметров совместима с функцией с *большим* числом:

```typescript
let oneParam = (a: number) => 0;
let twoParams = (a: number, b: number) => 0;

twoParams = oneParam; // OK
// oneParam = twoParams; // Ошибка

// Это работает, потому что JavaScript позволяет
// игнорировать лишние аргументы
[1, 2, 3].forEach((item) => console.log(item));
// forEach передаёт (item, index, array), но мы используем только item
```

### Типы параметров

При сравнении типов параметров TypeScript по умолчанию допускает **бивариантность** (подробнее -- в следующей подглаве):

```typescript
interface Animal {
  name: string;
}

interface Cat extends Animal {
  purr(): void;
}

// Без strictFunctionTypes: оба направления допустимы
let animalHandler = (animal: Animal) => {
  console.log(animal.name);
};

let catHandler = (cat: Cat) => {
  cat.purr();
};

// animalHandler = catHandler -- небезопасно!
// catHandler будет вызван с Animal, у которого нет purr()
```

### Возвращаемый тип

Возвращаемый тип сравнивается *ковариантно* -- функция с более специфичным возвращаемым типом совместима с функцией с более общим:

```typescript
let getAnimal = (): Animal => ({ name: "Мурка" });
let getCat = (): Cat => ({ name: "Мурка", purr() {} });

getAnimal = getCat; // OK -- Cat extends Animal
// getCat = getAnimal; // Ошибка -- Animal не гарантирует purr()
```

## Опциональные и rest-параметры

### Опциональные параметры

При совместимости функций опциональные параметры source-типа допускаются в позиции обязательного параметра target-типа:

```typescript
type Required = (x: number, y: number) => void;
type WithOptional = (x: number, y?: number) => void;

let required: Required = (x, y) => console.log(x, y);
let optional: WithOptional = (x, y?) => console.log(x, y);

// Обе направления -- OK для опциональных параметров
required = optional; // OK
optional = required; // OK (при strictFunctionTypes: тоже OK)
```

### Rest-параметры

Rest-параметры трактуются как бесконечное количество опциональных параметров:

```typescript
type Variadic = (...args: number[]) => void;
type Fixed = (a: number, b: number) => void;

let variadic: Variadic = (...args) => console.log(args);
let fixed: Fixed = (a, b) => console.log(a, b);

variadic = fixed; // OK
fixed = variadic; // OK
```

## Совместимость перечислений (Enums)

Enum-значения совместимы с `number`, но enum-значения *разных* enum-типов несовместимы друг с другом:

```typescript
enum Status {
  Ready,
  Waiting,
}

enum Color {
  Red,
  Green,
}

let status: Status = Status.Ready;
// status = Color.Red; // Ошибка: Color не совместим с Status

// Но числовые enum совместимы с number
let num: number = Status.Ready; // OK
status = 0; // OK (числовой enum допускает числа)
```

Строковые enum строже -- они не совместимы даже с `string`:

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
}

// let dir: Direction = "UP"; // Ошибка
let dir: Direction = Direction.Up; // OK
```

## Совместимость классов

При сравнении классов сравниваются только *instance*-члены. Статические свойства и конструктор **не участвуют** в проверке совместимости:

```typescript
class Animal {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Person {
  name: string;
  constructor(name: string, age: number) {
    this.name = name;
  }
}

let animal: Animal = new Person("Алиса", 30); // OK
let person: Person = new Animal("Мурка");     // OK
// Конструкторы разные, но instance-структура совпадает
```

### Private и protected

Приватные и защищённые поля *нарушают* структурную совместимость -- они должны происходить из одного и того же объявления:

```typescript
class Base {
  private id: number = 0;
}

class Derived extends Base {
  // Имеет тот же private id -- из Base
}

class Other {
  private id: number = 0; // Свой private id
}

let base: Base = new Derived(); // OK -- наследование
// let base2: Base = new Other(); // Ошибка: разные private id
```

## Совместимость дженериков

Для generic-типов совместимость зависит от того, как используется параметр типа:

```typescript
interface Empty<T> {}

let x: Empty<number> = {};
let y: Empty<string> = {};

x = y; // OK -- T не используется, структуры идентичны

interface NonEmpty<T> {
  data: T;
}

let a: NonEmpty<number> = { data: 1 };
let b: NonEmpty<string> = { data: "hello" };

// a = b; // Ошибка: string не совместим с number
```

## Итоги

| Правило | Описание |
|---------|----------|
| Структурная совместимость | Совместимость по структуре, а не по имени |
| Excess property check | Объектные литералы проходят дополнительную проверку |
| Параметры функций | Меньше параметров -> совместимо с большим числом |
| Возвращаемые типы | Ковариантность: более специфичный совместим с общим |
| Enum | Разные enum несовместимы друг с другом |
| Классы | Сравниваются только instance-члены; private/protected нарушают совместимость |

<DeepDive>

### Почему TypeScript использует структурную типизацию

JavaScript изначально построен на «утиной типизации» -- если объект имеет нужные свойства, он подходит. TypeScript отражает это через структурную типизацию.

Номинальная типизация (как в Java) требовала бы явного `implements` для каждого интерфейса, что плохо сочетается с динамичной природой JavaScript. Рассмотрим типичный паттерн:

```typescript
// В JavaScript это обычная практика -- объект подходит по "форме"
function printName(obj: { name: string }) {
  console.log(obj.name);
}

// Любой объект с name: string подходит
printName({ name: "Алиса", age: 30 }); // OK через переменную
printName(new User("Борис"));           // OK если User имеет name
printName({ name: "Вера" });            // OK
```

При номинальной типизации каждый из этих вызовов потребовал бы явного объявления интерфейса. Структурная типизация делает TypeScript совместимым с существующими JavaScript-паттернами.

Обратная сторона -- случайная совместимость типов, которые семантически различны (например, `UserId` и `OrderId`, если оба -- `string`). Для решения этой проблемы используются branded types (см. [ch06-ts-type-system](../ch06-ts-type-system/index.md)).

</DeepDive>
