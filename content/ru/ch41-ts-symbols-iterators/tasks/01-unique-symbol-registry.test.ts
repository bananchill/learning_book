import { describe, it, expect } from "vitest";

// Импортируйте реализацию после её создания:
// import {
//   DATABASE, LOGGER, CACHE,
//   ServiceRegistry,
//   type DatabaseService, type LoggerService, type CacheService,
// } from "./01-unique-symbol-registry";

describe("ServiceRegistry с unique symbol", () => {
  it("должен регистрировать и разрешать DatabaseService", () => {
    // const registry = new ServiceRegistry();
    // const db: DatabaseService = {
    //   query: (sql: string) => [`результат: ${sql}`],
    // };
    // registry.register(DATABASE, db);
    // const resolved = registry.resolve(DATABASE);
    // expect(resolved.query("SELECT 1")).toEqual(["результат: SELECT 1"]);
  });

  it("должен регистрировать и разрешать LoggerService", () => {
    // const registry = new ServiceRegistry();
    // const logger: LoggerService = {
    //   logs: [],
    //   log(message: string) { this.logs.push(message); },
    // };
    // registry.register(LOGGER, logger);
    // const resolved = registry.resolve(LOGGER);
    // resolved.log("тест");
    // expect(resolved.logs).toEqual(["тест"]);
  });

  it("должен регистрировать и разрешать CacheService", () => {
    // const registry = new ServiceRegistry();
    // const store = new Map<string, string>();
    // const cache: CacheService = {
    //   get: (key) => store.get(key),
    //   set: (key, value) => { store.set(key, value); },
    // };
    // registry.register(CACHE, cache);
    // const resolved = registry.resolve(CACHE);
    // resolved.set("foo", "bar");
    // expect(resolved.get("foo")).toBe("bar");
    // expect(resolved.get("baz")).toBeUndefined();
  });

  it("должен выбрасывать ошибку для незарегистрированного сервиса", () => {
    // const registry = new ServiceRegistry();
    // expect(() => registry.resolve(DATABASE)).toThrow();
  });

  it("должен хранить разные сервисы независимо", () => {
    // const registry = new ServiceRegistry();
    // const db: DatabaseService = { query: () => [] };
    // const logger: LoggerService = { logs: [], log() {} };
    // registry.register(DATABASE, db);
    // registry.register(LOGGER, logger);
    // expect(registry.resolve(DATABASE)).toBe(db);
    // expect(registry.resolve(LOGGER)).toBe(logger);
  });
});
