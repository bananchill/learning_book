# Ковариантность и контравариантность

Вариантность описывает, как соотношение типов `A` и `B` влияет на соотношение составных типов, содержащих `A` и `B`. Это фундаментальная концепция в теории типов, и понимание её поможет вам писать корректные типы для функций высшего порядка, обобщённых контейнеров и event-систем.

## Основные понятия

Допустим, `Cat` является подтипом `Animal` (Cat extends Animal). Вопрос: как соотносятся типы `Container<Cat>` и `Container<Animal>`?

| Вариантность | Правило | Пример |
|-------------|---------|--------|
| **Ковариантность** | Если Cat <: Animal, то Container\<Cat\> <: Container\<Animal\> | Массивы, Promise, возвращаемые типы |
| **Контравариантность** | Если Cat <: Animal, то Container\<Animal\> <: Container\<Cat\> | Параметры функций (при strictFunctionTypes) |
| **Инвариантность** | Нет связи | Изменяемые контейнеры (по-хорошему) |
| **Бивариантность** | Оба направления | Параметры функций (без strictFunctionTypes) |

## Ковариантность возвращаемых типов

Возвращаемый тип функции ковариантен -- подтип в возвращаемом значении сохраняет совместимость:

```typescript
interface Animal {
  name: string;
}

interface Cat extends Animal {
  purr(): void;
}

type GetAnimal = () => Animal;
type GetCat = () => Cat;

// Cat <: Animal, значит (() => Cat) <: (() => Animal)
let getAnimal: GetAnimal;
let getCat: GetCat = () => ({ name: "Мурка", purr() {} });

getAnimal = getCat; // OK -- ковариантность
// getCat = getAnimal; // Ошибка -- Animal не гарантирует purr()
```

Это безопасно: если кто-то ожидает `Animal`, а получает `Cat` -- это нормально, потому что `Cat` имеет все свойства `Animal`.

## Контравариантность параметров функций

Параметры функций *контравариантны* -- направление совместимости инвертируется:

```typescript
type HandleAnimal = (animal: Animal) => void;
type HandleCat = (cat: Cat) => void;

let handleAnimal: HandleAnimal = (animal) => {
  console.log(animal.name);
};

let handleCat: HandleCat = (cat) => {
  cat.purr(); // Использует специфичный метод Cat
};

// HandleAnimal совместим с HandleCat -- контравариантность
handleCat = handleAnimal; // OK
// handleAnimal = handleCat; // Ошибка при strictFunctionTypes
```

### Почему контравариантность безопасна

Рассмотрим на примере:

```typescript
function processAnimals(animals: Cat[], handler: HandleCat): void {
  for (const animal of animals) {
    handler(animal);
  }
}

const cats: Cat[] = [
  { name: "Мурка", purr() {} },
  { name: "Барсик", purr() {} },
];

// handleAnimal принимает Animal, а Cat -- это Animal
// Безопасно: handleAnimal использует только name, который есть у Cat
processAnimals(cats, handleAnimal); // OK

// handleCat ожидает Cat с purr()
// Опасно: если бы мы могли подставить handleCat
// куда ожидается HandleAnimal, обработчик мог бы получить Dog
// у которого нет purr()
```

## Бивариантность параметров (Function Parameter Bivariance)

По умолчанию (без `strictFunctionTypes`) TypeScript допускает **бивариантность** параметров функций -- оба направления присваивания разрешены:

```typescript
// tsconfig.json: "strictFunctionTypes": false (или "strict": false)

type Handler = (event: Event) => void;
type MouseHandler = (event: MouseEvent) => void;

let handler: Handler;
let mouseHandler: MouseHandler = (e) => {
  console.log(e.clientX); // Специфичное свойство MouseEvent
};

// Без strictFunctionTypes -- оба направления OK
handler = mouseHandler; // OK (ковариантное -- безопасно)
mouseHandler = handler; // OK (контравариантное -- тоже разрешено)
```

### Почему бивариантность существует

Бивариантность была введена для совместимости с распространёнными паттернами JavaScript, в частности с event-обработчиками DOM:

```typescript
// Частый паттерн в DOM API
interface Element {
  addEventListener(
    type: string,
    listener: (event: Event) => void,
  ): void;
}

// Без бивариантности этот код не компилировался бы
element.addEventListener("click", (e: MouseEvent) => {
  console.log(e.clientX);
});
// MouseEvent -> Event -- ковариантная подстановка параметра,
// что при strictFunctionTypes запрещено для обычных функций,
// но DOM-типы используют method syntax для обхода этого
```

## strictFunctionTypes

Флаг `strictFunctionTypes` (часть `strict`) включает *контравариантную* проверку параметров функциональных типов, объявленных с помощью синтаксиса функций:

```typescript
// tsconfig.json: "strictFunctionTypes": true

type Comparer<T> = (a: T, b: T) => number;

let animalComparer: Comparer<Animal> = (a, b) =>
  a.name.localeCompare(b.name);

let catComparer: Comparer<Cat> = (a, b) => {
  // Использует purr, специфичный для Cat
  a.purr();
  return a.name.localeCompare(b.name);
};

// Контравариантность: Animal -> Cat допустимо
catComparer = animalComparer; // OK

// Ковариантная подстановка: Cat -> Animal запрещена
// animalComparer = catComparer; // Ошибка!
// Это правильно: catComparer вызовет purr() на Dog
```

### Method syntax vs Function syntax

Критическая деталь: `strictFunctionTypes` применяется **только к функциональному синтаксису**, но не к методам:

```typescript
interface EventSource {
  // Method syntax -- бивариантный (даже при strict)
  addEventListener(handler: (event: Event) => void): void;
}

interface StrictEventSource {
  // Function property syntax -- контравариантный (при strict)
  addEventListener: (handler: (event: Event) => void) => void;
}
```

Это сделано намеренно -- method syntax оставлен бивариантным для обратной совместимости с DOM API и другими встроенными интерфейсами.

## Практические примеры

### Безопасные callback-типы

```typescript
// Плохо: бивариантный метод
interface EventEmitter {
  on(event: string, handler: (data: unknown) => void): void;
}

// Лучше: контравариантная function property
interface StrictEventEmitter {
  on: (event: string, handler: (data: unknown) => void) => void;
}
```

### Ковариантный readonly-массив

```typescript
// ReadonlyArray ковариантен по T
const cats: readonly Cat[] = [
  { name: "Мурка", purr() {} },
];

// Cat[] <: Animal[] для readonly -- безопасно
const animals: readonly Animal[] = cats; // OK

// Обычный массив должен быть инвариантным,
// но TypeScript делает его ковариантным (unsound)
const mutableAnimals: Animal[] = cats as any as Animal[];
mutableAnimals.push({ name: "Шарик" }); // Ой! Dog в массиве Cat[]
```

### Контравариантность в дженериках

```typescript
// Пример: Comparator контравариантен по T
type Comparator<T> = (a: T, b: T) => number;

function sortAnimals(
  animals: Animal[],
  comparator: Comparator<Animal>,
): Animal[] {
  return [...animals].sort(comparator);
}

// animalComparator работает с Animal -- можно использовать для Cat[]
const animalComparator: Comparator<Animal> = (a, b) =>
  a.name.localeCompare(b.name);

const cats2: Cat[] = [
  { name: "Мурка", purr() {} },
  { name: "Барсик", purr() {} },
];

// OK: Comparator<Animal> совместим с Comparator<Cat>
sortAnimals(cats2, animalComparator);
```

## Вариантность в TypeScript: сводная таблица

| Позиция | Вариантность | Пример |
|---------|-------------|--------|
| Возвращаемый тип функции | Ковариантная | `() => Cat` <: `() => Animal` |
| Параметр функции (strict) | Контравариантная | `(a: Animal) => void` <: `(a: Cat) => void` |
| Параметр функции (не-strict) | Бивариантная | Оба направления |
| Параметр метода (method syntax) | Бивариантная | Всегда, даже при strict |
| ReadonlyArray\<T\> | Ковариантная | `readonly Cat[]` <: `readonly Animal[]` |
| Array\<T\> | Ковариантная (unsound) | `Cat[]` <: `Animal[]` (но небезопасно при мутации) |
| Promise\<T\> | Ковариантная | `Promise<Cat>` <: `Promise<Animal>` |

## Итоги

1. **Ковариантность** (возвращаемые типы): подтип *сохраняет* совместимость
2. **Контравариантность** (параметры при strict): подтип *инвертирует* совместимость
3. **Бивариантность** (параметры без strict, методы): оба направления
4. **Включайте `strictFunctionTypes`** -- это ловит реальные баги с event-обработчиками и callback-функциями
5. **Method syntax** остаётся бивариантным даже при strict -- это осознанный компромисс

<DeepDive>

### Формальное определение вариантности

В теории типов вариантность определяется через понятие подтипирования. Пусть `<:` означает «является подтипом»:

- **Ковариантный** конструктор типов `F`: если `A <: B`, то `F<A> <: F<B>`. Направление сохраняется.
- **Контравариантный** конструктор `F`: если `A <: B`, то `F<B> <: F<A>`. Направление инвертируется.
- **Инвариантный**: нет связи между `F<A>` и `F<B>`, если `A ≠ B`.
- **Бивариантный**: `F<A> <: F<B>` и `F<B> <: F<A>` при `A <: B`.

В TypeScript 4.7+ можно явно аннотировать вариантность параметров типа:

```typescript
// Явная аннотация вариантности (TypeScript 4.7+)
type Producer<out T> = () => T;           // ковариантный
type Consumer<in T> = (value: T) => void; // контравариантный
type Mapper<in T, out U> = (value: T) => U; // контра- по T, ко- по U
type Invariant<in out T> = {              // инвариантный
  get(): T;
  set(value: T): void;
};
```

Аннотации `in` и `out` помогают компилятору проверять, что параметр типа используется только в заявленных позициях, и ускоряют проверку типов для рекурсивных типов.

</DeepDive>
