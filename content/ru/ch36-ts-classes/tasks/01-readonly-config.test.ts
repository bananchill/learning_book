import { describe, it, expect } from "vitest";
import { AppConfig } from "./01-readonly-config";

describe("AppConfig", () => {
  it("должен создавать конфигурацию с переданными значениями", () => {
    const config = new AppConfig("https://api.example.com", 5000, false);

    expect(config.apiUrl).toBe("https://api.example.com");
    expect(config.timeout).toBe(5000);
    expect(config.debug).toBe(false);
  });

  it("должен создавать клон с переопределёнными полями", () => {
    const original = new AppConfig("https://api.example.com", 5000, false);
    const modified = original.clone({ timeout: 10000, debug: true });

    // Оригинал не изменился
    expect(original.timeout).toBe(5000);
    expect(original.debug).toBe(false);

    // Клон содержит новые значения
    expect(modified.apiUrl).toBe("https://api.example.com"); // не переопределено
    expect(modified.timeout).toBe(10000);
    expect(modified.debug).toBe(true);
  });

  it("должен создавать точную копию при clone() без аргументов", () => {
    const original = new AppConfig("https://api.example.com", 3000, true);
    const copy = original.clone();

    expect(copy.apiUrl).toBe(original.apiUrl);
    expect(copy.timeout).toBe(original.timeout);
    expect(copy.debug).toBe(original.debug);
    expect(copy).not.toBe(original); // разные объекты
  });

  it("должен возвращать строковое представление через toString()", () => {
    const config = new AppConfig("https://api.test.com", 1000, true);
    const str = config.toString();

    expect(str).toContain("AppConfig");
    expect(str).toContain("https://api.test.com");
    expect(str).toContain("1000");
    expect(str).toContain("true");
  });

  it("clone() должен возвращать экземпляр AppConfig", () => {
    const config = new AppConfig("https://api.example.com", 5000, false);
    const cloned = config.clone({ debug: true });

    expect(cloned).toBeInstanceOf(AppConfig);
  });
});
