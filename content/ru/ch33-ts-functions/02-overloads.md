---
title: "Перегрузки функций"
parent: "ch33-ts-functions"
order: 2
---

## Что такое перегрузки

В TypeScript перегрузки (function overloads) позволяют описать функцию, которая может вызываться с разными наборами аргументов. Ты пишешь несколько **сигнатур перегрузки** (overload signatures) и одну **сигнатуру реализации** (implementation signature):

```ts
// Сигнатуры перегрузки
function makeDate(timestamp: number): Date;
function makeDate(m: number, d: number, y: number): Date;

// Сигнатура реализации
function makeDate(mOrTimestamp: number, d?: number, y?: number): Date {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrTimestamp, d);
  } else {
    return new Date(mOrTimestamp);
  }
}

const d1 = makeDate(12345678);     // OK
const d2 = makeDate(5, 5, 2023);   // OK
// const d3 = makeDate(1, 3);      // Ошибка! Нет перегрузки с 2 параметрами
```

Сигнатура реализации **не видна снаружи**. При вызове TypeScript выбирает одну из перегрузок. Нельзя вызвать функцию с параметрами, которые подходят только под реализацию, но не под ни одну перегрузку.

## Совместимость сигнатуры реализации

Сигнатура реализации должна быть **совместима** со всеми перегрузками. Распространённые ошибки:

```ts
function fn(x: string): void;
function fn() {
  // ❌ Ошибка: реализация не совместима с перегрузкой
  // Перегрузка требует параметр x: string, а реализация его не принимает
}
```

```ts
function fn(x: boolean): void;
function fn(x: string): void;
function fn(x: boolean | string) {
  // ✅ Правильно: реализация принимает объединение типов
}
```

Возвращаемый тип реализации тоже должен быть совместим:

```ts
function fn(x: string): string;
function fn(x: number): boolean;
function fn(x: string | number): string | boolean {
  // ✅ Правильно
  return typeof x === "string" ? x : x > 0;
}
```

## Правила хороших перегрузок

### Предпочитай union-типы перегрузкам

Если перегрузки отличаются только типом одного параметра, лучше использовать union:

```ts
// ❌ Плохо: две перегрузки для разных типов одного параметра
function len(s: string): number;
function len(arr: any[]): number;
function len(x: any) {
  return x.length;
}

len("hello");    // OK
len([1, 2, 3]);  // OK
len(Math.random() > 0.5 ? "hello" : [1, 2, 3]); // ❌ Ошибка!
```

Проблема: TypeScript может выбрать перегрузку только по конкретному типу, а `string | number[]` не подходит ни под одну. С union-типом всё работает:

```ts
// ✅ Хорошо: union-тип вместо перегрузок
function len(x: string | any[]): number {
  return x.length;
}

len("hello");    // OK
len([1, 2, 3]);  // OK
len(Math.random() > 0.5 ? "hello" : [1, 2, 3]); // ✅ OK!
```

### Перегрузки нужны, когда типы связаны

Перегрузки полезны, когда **тип возвращаемого значения зависит от типа параметра**:

```ts
function createElement(tag: "a"): HTMLAnchorElement;
function createElement(tag: "canvas"): HTMLCanvasElement;
function createElement(tag: "table"): HTMLTableElement;
function createElement(tag: string): HTMLElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// TypeScript знает точный тип возврата
const a = createElement("a");       // HTMLAnchorElement
const c = createElement("canvas");  // HTMLCanvasElement
const div = createElement("div");   // HTMLElement
```

### Минимум два параметра в сигнатуре

Каждая сигнатура перегрузки должна иметь как минимум 2 параметра (или отличаться от другой). TypeScript требует не менее двух сигнатур перегрузки (без учёта реализации):

```ts
// ❌ Ошибка: одна сигнатура перегрузки
function fn(x: string): void;
function fn(x: string) {}

// ✅ Правильно: минимум две перегрузки
function fn(x: string): void;
function fn(x: number): void;
function fn(x: string | number) {}
```

## this в перегрузках

Перегрузки и `this`-параметр (о нём в следующем разделе) можно комбинировать:

```ts
function getDB(): void;
function getDB(connectionString: string): void;
function getDB(connectionString?: string) {
  // реализация
}
```

## Итого

| Правило | Объяснение |
|---------|-----------|
| Минимум 2 перегрузки | TypeScript требует не менее двух сигнатур перегрузки |
| Реализация не видна снаружи | Вызвать можно только по сигнатурам перегрузок |
| Совместимость реализации | Реализация должна принимать все варианты параметров |
| Union вместо перегрузок | Если отличается только тип одного параметра -- используй union |
| Перегрузки для связанных типов | Когда тип возврата зависит от типа параметра |
