---
title: "Шпаргалка: Функции в TypeScript"
parent: "ch33-ts-functions"
---

## Выражения типов функций

```ts
// Базовый коллбэк
type Callback = (data: string) => void;

// Функция с возвратом
type Mapper = (item: number, index: number) => string;

// Опциональный параметр
type Logger = (message: string, level?: string) => void;
```

## Сигнатуры вызова и конструктора

```ts
// Функция со свойствами
type SmartFn = {
  (x: number): string;
  displayName: string;
};

// Конструктор
type Ctor = {
  new (name: string): MyClass;
};

// Вызов + конструктор
type Hybrid = {
  (n: number): string;
  new (s: string): Date;
};
```

## Перегрузки

```ts
function parse(input: string): number;
function parse(input: number): string;
function parse(input: string | number): string | number {
  return typeof input === "string" ? parseInt(input) : String(input);
}
```

**Правило:** если перегрузки отличаются только типом одного параметра -- используй union.

## this-параметр

```ts
function handleClick(this: HTMLButtonElement, event: Event) {
  console.log(this.textContent); // this типизирован
}
```

## Специальные типы

```ts
void       // Ничего не возвращает
object     // Любое не-примитивное значение
unknown    // Безопасный any (требует сужения)
never      // Никогда не возвращает (throw / бесконечный цикл)
Function   // Нетипизированная функция (избегай)
```

## Rest-параметры

```ts
function log(prefix: string, ...messages: string[]): void {
  messages.forEach(m => console.log(`[${prefix}] ${m}`));
}
```

## Rest-аргументы с as const

```ts
const point = [1, 2] as const;       // readonly [1, 2]
const point2: [number, number] = [1, 2]; // [number, number]
fn(...point);  // OK
fn(...point2); // OK
```

## Деструктуризация

```ts
// Объект
function draw({ x, y, color = "black" }: { x: number; y: number; color?: string }) {}

// С type alias
type Point = { x: number; y: number };
function move({ x, y }: Point) {}

// Массив-кортеж
function swap([a, b]: [number, number]): [number, number] {
  return [b, a];
}
```

## Чеклист

- [ ] Используешь Function Type Expression для простых коллбэков?
- [ ] Call Signature только когда функция имеет свойства?
- [ ] Union-типы вместо перегрузок, где возможно?
- [ ] `unknown` вместо `any` для неизвестных параметров?
- [ ] `as const` при spread-аргументах?
- [ ] Тип деструктуризации после паттерна, не внутри?
- [ ] `() => void` вместо `Function`?
