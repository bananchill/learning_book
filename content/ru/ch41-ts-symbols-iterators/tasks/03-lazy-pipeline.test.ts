import { describe, it, expect, vi } from "vitest";

// Импортируйте реализацию после её создания:
// import { Lazy } from "./03-lazy-pipeline";

describe("Lazy<T> — ленивый конвейер на генераторах", () => {
  it("должен создаваться из массива и итерироваться", () => {
    // const lazy = Lazy.from([1, 2, 3]);
    // expect([...lazy]).toEqual([1, 2, 3]);
  });

  it("должен лениво применять map", () => {
    // const lazy = Lazy.from([1, 2, 3]).map((x) => x * 2);
    // expect(lazy.toArray()).toEqual([2, 4, 6]);
  });

  it("должен лениво применять filter", () => {
    // const lazy = Lazy.from([1, 2, 3, 4, 5]).filter((x) => x % 2 !== 0);
    // expect(lazy.toArray()).toEqual([1, 3, 5]);
  });

  it("должен лениво ограничивать через take", () => {
    // const lazy = Lazy.from([1, 2, 3, 4, 5]).take(3);
    // expect(lazy.toArray()).toEqual([1, 2, 3]);
  });

  it("должен чейниться: map + filter + take", () => {
    // const result = Lazy.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    //   .map((x) => x * x)        // 1, 4, 9, 16, 25, 36, 49, 64, 81, 100
    //   .filter((x) => x % 2 === 0) // 4, 16, 36, 64, 100
    //   .take(3)                     // 4, 16, 36
    //   .toArray();
    // expect(result).toEqual([4, 16, 36]);
  });

  it("не должен вычислять лишние элементы (ленивость)", () => {
    // const mapFn = vi.fn((x: number) => x * 2);
    // const result = Lazy.from([1, 2, 3, 4, 5])
    //   .map(mapFn)
    //   .take(2)
    //   .toArray();
    // expect(result).toEqual([2, 4]);
    // // map вызван только для первых 2 элементов, не для всех 5
    // expect(mapFn).toHaveBeenCalledTimes(2);
  });

  it("должен работать с бесконечным iterable", () => {
    // function* naturals(): Generator<number> {
    //   let n = 1;
    //   while (true) yield n++;
    // }
    // const result = Lazy.from(naturals())
    //   .filter((n) => n % 3 === 0)  // 3, 6, 9, 12, ...
    //   .map((n) => n * 10)           // 30, 60, 90, 120, ...
    //   .take(4)
    //   .toArray();
    // expect(result).toEqual([30, 60, 90, 120]);
  });

  it("должен поддерживать повторную итерацию (если источник позволяет)", () => {
    // const lazy = Lazy.from([1, 2, 3]).map((x) => x + 1);
    // expect(lazy.toArray()).toEqual([2, 3, 4]);
    // expect(lazy.toArray()).toEqual([2, 3, 4]);
  });

  it("должен корректно работать с пустым источником", () => {
    // const lazy = Lazy.from([]).map((x) => x).filter(() => true).take(10);
    // expect(lazy.toArray()).toEqual([]);
  });
});
