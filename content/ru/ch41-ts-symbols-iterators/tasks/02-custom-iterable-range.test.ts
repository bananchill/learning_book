import { describe, it, expect } from "vitest";

// Импортируйте реализацию после её создания:
// import { StepRange } from "./02-custom-iterable-range";

describe("StepRange — итерируемый диапазон с шагом", () => {
  it("должен итерировать от 1 до 5 с шагом 1 (по умолчанию)", () => {
    // const range = new StepRange(1, 5);
    // expect([...range]).toEqual([1, 2, 3, 4, 5]);
  });

  it("должен итерировать от 0 до 10 с шагом 2", () => {
    // const range = new StepRange(0, 10, 2);
    // expect([...range]).toEqual([0, 2, 4, 6, 8, 10]);
  });

  it("должен итерировать от 10 до 0 с шагом -3", () => {
    // const range = new StepRange(10, 0, -3);
    // expect([...range]).toEqual([10, 7, 4, 1]);
  });

  it("должен возвращать один элемент, если start === end", () => {
    // const range = new StepRange(5, 5);
    // expect([...range]).toEqual([5]);
  });

  it("должен возвращать пустую последовательность, если направление шага не совпадает", () => {
    // const range = new StepRange(1, 5, -1);
    // expect([...range]).toEqual([]);
  });

  it("должен выбрасывать ошибку при step === 0", () => {
    // expect(() => new StepRange(1, 5, 0)).toThrow();
  });

  it("должен работать с for...of", () => {
    // const range = new StepRange(1, 3);
    // const result: number[] = [];
    // for (const n of range) {
    //   result.push(n);
    // }
    // expect(result).toEqual([1, 2, 3]);
  });

  it("должен поддерживать деструктуризацию", () => {
    // const range = new StepRange(10, 50, 10);
    // const [first, second, ...rest] = range;
    // expect(first).toBe(10);
    // expect(second).toBe(20);
    // expect(rest).toEqual([30, 40, 50]);
  });

  it("должен поддерживать повторную итерацию", () => {
    // const range = new StepRange(1, 3);
    // expect([...range]).toEqual([1, 2, 3]);
    // expect([...range]).toEqual([1, 2, 3]); // Повторный вызов
  });
});
