import { describe, it, expect } from "vitest";
import { QueryBuilder, PaginatedQueryBuilder } from "./05-fluent-builder";

describe("QueryBuilder", () => {
  it("должен строить простой SELECT запрос", () => {
    const query = new QueryBuilder()
      .from("users")
      .build();

    expect(query).toBe("SELECT * FROM users");
  });

  it("должен строить запрос с указанными полями", () => {
    const query = new QueryBuilder()
      .select("id", "name", "email")
      .from("users")
      .build();

    expect(query).toBe("SELECT id, name, email FROM users");
  });

  it("должен строить запрос с WHERE", () => {
    const query = new QueryBuilder()
      .from("users")
      .where("active = true")
      .build();

    expect(query).toBe("SELECT * FROM users WHERE active = true");
  });

  it("должен объединять несколько WHERE через AND", () => {
    const query = new QueryBuilder()
      .from("users")
      .where("active = true")
      .where("age > 18")
      .build();

    expect(query).toBe("SELECT * FROM users WHERE active = true AND age > 18");
  });

  it("должен строить запрос с ORDER BY", () => {
    const query = new QueryBuilder()
      .from("users")
      .orderBy("created_at", "DESC")
      .build();

    expect(query).toBe("SELECT * FROM users ORDER BY created_at DESC");
  });

  it("должен выбрасывать ошибку без указания таблицы", () => {
    expect(() => new QueryBuilder().build()).toThrow("Таблица не указана");
  });
});

describe("PaginatedQueryBuilder", () => {
  it("должен добавлять LIMIT", () => {
    const query = new PaginatedQueryBuilder()
      .from("products")
      .limit(10)
      .build();

    expect(query).toBe("SELECT * FROM products LIMIT 10");
  });

  it("должен добавлять LIMIT и OFFSET", () => {
    const query = new PaginatedQueryBuilder()
      .from("products")
      .limit(10)
      .offset(20)
      .build();

    expect(query).toBe("SELECT * FROM products LIMIT 10 OFFSET 20");
  });

  it("должен поддерживать цепочку вызовов с родительскими методами", () => {
    const query = new PaginatedQueryBuilder()
      .select("id", "title")
      .from("products")
      .where("price > 100")
      .orderBy("price", "ASC")
      .limit(5)
      .offset(10)
      .build();

    expect(query).toBe(
      "SELECT id, title FROM products WHERE price > 100 ORDER BY price ASC LIMIT 5 OFFSET 10"
    );
  });

  it("цепочка .where().limit() должна возвращать PaginatedQueryBuilder", () => {
    // Этот тест проверяет, что this-тип работает корректно
    const builder = new PaginatedQueryBuilder()
      .from("users")
      .where("active = true") // возвращает PaginatedQueryBuilder, не QueryBuilder
      .limit(10);             // поэтому .limit() доступен

    expect(builder).toBeInstanceOf(PaginatedQueryBuilder);
    expect(builder.build()).toContain("LIMIT 10");
  });

  it("должен выбрасывать ошибку при отрицательном LIMIT", () => {
    expect(() =>
      new PaginatedQueryBuilder().from("users").limit(-1)
    ).toThrow("LIMIT не может быть отрицательным");
  });
});
