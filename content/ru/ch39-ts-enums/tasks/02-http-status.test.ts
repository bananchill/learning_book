import { describe, it, expect } from "vitest";
import { HttpStatus, classifyStatus, getStatusName } from "./02-http-status";

describe("HttpStatus enum", () => {
  it("должен содержать правильные числовые значения", () => {
    expect(HttpStatus.Ok).toBe(200);
    expect(HttpStatus.Created).toBe(201);
    expect(HttpStatus.MovedPermanently).toBe(301);
    expect(HttpStatus.BadRequest).toBe(400);
    expect(HttpStatus.NotFound).toBe(404);
    expect(HttpStatus.InternalServerError).toBe(500);
  });
});

describe("classifyStatus", () => {
  it('должен вернуть "success" для 2xx', () => {
    expect(classifyStatus(HttpStatus.Ok)).toBe("success");
    expect(classifyStatus(HttpStatus.Created)).toBe("success");
  });

  it('должен вернуть "redirect" для 3xx', () => {
    expect(classifyStatus(HttpStatus.MovedPermanently)).toBe("redirect");
  });

  it('должен вернуть "client_error" для 4xx', () => {
    expect(classifyStatus(HttpStatus.BadRequest)).toBe("client_error");
    expect(classifyStatus(HttpStatus.NotFound)).toBe("client_error");
  });

  it('должен вернуть "server_error" для 5xx', () => {
    expect(classifyStatus(HttpStatus.InternalServerError)).toBe("server_error");
  });
});

describe("getStatusName", () => {
  it("должен вернуть имя статуса по коду (reverse mapping)", () => {
    expect(getStatusName(200)).toBe("Ok");
    expect(getStatusName(404)).toBe("NotFound");
    expect(getStatusName(500)).toBe("InternalServerError");
  });

  it("должен вернуть undefined для неизвестного кода", () => {
    expect(getStatusName(999)).toBeUndefined();
  });
});
