import { describe, it, expect } from "vitest";
import { Circle, Rectangle, Triangle, totalArea } from "./04-abstract-shapes";

describe("Circle", () => {
  it("должен вычислять площадь круга", () => {
    const circle = new Circle(5);
    expect(circle.area()).toBeCloseTo(Math.PI * 25);
  });

  it("должен вычислять периметр круга", () => {
    const circle = new Circle(5);
    expect(circle.perimeter()).toBeCloseTo(2 * Math.PI * 5);
  });

  it("должен выбрасывать ошибку при отрицательном радиусе", () => {
    expect(() => new Circle(-1)).toThrow("положительным");
  });

  it("должен возвращать описание", () => {
    const circle = new Circle(1);
    expect(circle.describe()).toContain("Круг");
  });
});

describe("Rectangle", () => {
  it("должен вычислять площадь прямоугольника", () => {
    const rect = new Rectangle(4, 5);
    expect(rect.area()).toBe(20);
  });

  it("должен вычислять периметр прямоугольника", () => {
    const rect = new Rectangle(4, 5);
    expect(rect.perimeter()).toBe(18);
  });

  it("должен выбрасывать ошибку при нулевой стороне", () => {
    expect(() => new Rectangle(0, 5)).toThrow("положительными");
  });
});

describe("Triangle", () => {
  it("должен вычислять площадь треугольника по формуле Герона", () => {
    // Прямоугольный треугольник 3-4-5, площадь = 6
    const triangle = new Triangle(3, 4, 5);
    expect(triangle.area()).toBeCloseTo(6);
  });

  it("должен вычислять периметр треугольника", () => {
    const triangle = new Triangle(3, 4, 5);
    expect(triangle.perimeter()).toBe(12);
  });

  it("должен выбрасывать ошибку при невозможном треугольнике", () => {
    expect(() => new Triangle(1, 2, 10)).toThrow("не образуют треугольник");
  });

  it("должен выбрасывать ошибку при отрицательной стороне", () => {
    expect(() => new Triangle(-1, 2, 3)).toThrow("положительными");
  });
});

describe("totalArea", () => {
  it("должен вычислять суммарную площадь фигур", () => {
    const shapes = [
      new Rectangle(2, 3),  // площадь: 6
      new Rectangle(4, 5),  // площадь: 20
    ];
    expect(totalArea(shapes)).toBe(26);
  });

  it("должен возвращать 0 для пустого массива", () => {
    expect(totalArea([])).toBe(0);
  });

  it("должен работать со смешанными фигурами", () => {
    const shapes = [
      new Circle(1),         // площадь: PI
      new Rectangle(1, 1),   // площадь: 1
    ];
    expect(totalArea(shapes)).toBeCloseTo(Math.PI + 1);
  });
});
