import { describe, it, expect } from "vitest";
import {
  API_ENDPOINT,
  isValidEndpoint,
  getEndpointKey,
} from "./04-as-const-refactor";

describe("API_ENDPOINT объект", () => {
  it("должен содержать правильные значения", () => {
    expect(API_ENDPOINT.Users).toBe("/api/users");
    expect(API_ENDPOINT.Posts).toBe("/api/posts");
    expect(API_ENDPOINT.Comments).toBe("/api/comments");
    expect(API_ENDPOINT.Auth).toBe("/api/auth");
  });

  it("должен быть readonly (as const)", () => {
    // Проверяем, что объект не содержит лишних ключей
    const keys = Object.keys(API_ENDPOINT);
    expect(keys).toHaveLength(4);
    expect(keys).toEqual(["Users", "Posts", "Comments", "Auth"]);
  });
});

describe("isValidEndpoint", () => {
  it("должен вернуть true для валидных эндпоинтов", () => {
    expect(isValidEndpoint("/api/users")).toBe(true);
    expect(isValidEndpoint("/api/posts")).toBe(true);
    expect(isValidEndpoint("/api/comments")).toBe(true);
    expect(isValidEndpoint("/api/auth")).toBe(true);
  });

  it("должен вернуть false для невалидных строк", () => {
    expect(isValidEndpoint("/api/unknown")).toBe(false);
    expect(isValidEndpoint("")).toBe(false);
    expect(isValidEndpoint("/users")).toBe(false);
  });
});

describe("getEndpointKey", () => {
  it("должен вернуть ключ по значению (reverse mapping)", () => {
    expect(getEndpointKey("/api/users")).toBe("Users");
    expect(getEndpointKey("/api/posts")).toBe("Posts");
    expect(getEndpointKey("/api/comments")).toBe("Comments");
    expect(getEndpointKey("/api/auth")).toBe("Auth");
  });
});
