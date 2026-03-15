import { describe, it, expect, vi } from "vitest";

// Импортируйте реализацию после её создания:
// import { paginate, AsyncPaginator, type Page, type FetchPage } from "./05-async-paginator";

// Вспомогательная функция: создаёт мок fetchPage
function createMockFetchPage<T>(pages: T[][]): (cursor: string | null) => Promise<{ items: T[]; nextCursor: string | null }> {
  let callIndex = 0;
  return async (cursor: string | null) => {
    const items = pages[callIndex] ?? [];
    callIndex++;
    const nextCursor = callIndex < pages.length ? String(callIndex) : null;
    return { items, nextCursor };
  };
}

describe("paginate — асинхронный генератор-пагинатор", () => {
  it("должен отдавать элементы из одной страницы", async () => {
    // const fetchPage = createMockFetchPage([[1, 2, 3]]);
    // const result: number[] = [];
    // for await (const item of paginate(fetchPage)) {
    //   result.push(item);
    // }
    // expect(result).toEqual([1, 2, 3]);
  });

  it("должен отдавать элементы из нескольких страниц", async () => {
    // const fetchPage = createMockFetchPage([
    //   ["a", "b"],
    //   ["c", "d"],
    //   ["e"],
    // ]);
    // const result: string[] = [];
    // for await (const item of paginate(fetchPage)) {
    //   result.push(item);
    // }
    // expect(result).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("должен корректно обрабатывать пустую первую страницу", async () => {
    // const fetchPage = createMockFetchPage<number>([[]]);
    // const result: number[] = [];
    // for await (const item of paginate(fetchPage)) {
    //   result.push(item);
    // }
    // expect(result).toEqual([]);
  });

  it("должен прекращать загрузку при break", async () => {
    // const fetchFn = vi.fn(createMockFetchPage([[1, 2], [3, 4], [5, 6]]));
    // const result: number[] = [];
    // for await (const item of paginate(fetchFn)) {
    //   result.push(item);
    //   if (result.length >= 3) break;
    // }
    // expect(result).toEqual([1, 2, 3]);
    // // Должен был загрузить только 2 страницы, а не 3
    // expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});

describe("AsyncPaginator — класс-обёртка", () => {
  it("должен поддерживать for await...of", async () => {
    // const fetchPage = createMockFetchPage([[10, 20], [30]]);
    // const paginator = new AsyncPaginator(fetchPage);
    // const result: number[] = [];
    // for await (const item of paginator) {
    //   result.push(item);
    // }
    // expect(result).toEqual([10, 20, 30]);
  });

  it("toArray() должен собирать все элементы", async () => {
    // const fetchPage = createMockFetchPage([["x", "y"], ["z"]]);
    // const paginator = new AsyncPaginator(fetchPage);
    // const result = await paginator.toArray();
    // expect(result).toEqual(["x", "y", "z"]);
  });

  it("take(n) должен собирать первые n элементов", async () => {
    // const fetchPage = createMockFetchPage([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
    // const paginator = new AsyncPaginator(fetchPage);
    // const result = await paginator.take(5);
    // expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  it("take(n) должен вернуть меньше n элементов, если данных недостаточно", async () => {
    // const fetchPage = createMockFetchPage([[1, 2]]);
    // const paginator = new AsyncPaginator(fetchPage);
    // const result = await paginator.take(10);
    // expect(result).toEqual([1, 2]);
  });
});
