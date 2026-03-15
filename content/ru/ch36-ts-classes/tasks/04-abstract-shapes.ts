/**
 * Задача: Фигуры и площади
 *
 * 1. Создайте абстрактный класс Shape с:
 *    - abstract area(): number
 *    - abstract perimeter(): number
 *    - abstract readonly name: string
 *    - Обычный метод describe(): string, возвращающий
 *      "Фигура: {name}, площадь: {area}, периметр: {perimeter}"
 *
 * 2. Реализуйте классы:
 *    - Circle(radius) — круг
 *    - Rectangle(width, height) — прямоугольник
 *    - Triangle(a, b, c) — треугольник (площадь по формуле Герона)
 *
 * 3. Функция totalArea(shapes) — сумма площадей массива фигур
 */

export abstract class Shape {
  abstract readonly name: string;

  abstract area(): number;
  abstract perimeter(): number;

  describe(): string {
    const a = this.area().toFixed(2);
    const p = this.perimeter().toFixed(2);
    return `Фигура: ${this.name}, площадь: ${a}, периметр: ${p}`;
  }
}

export class Circle extends Shape {
  readonly name = "Круг";

  constructor(public readonly radius: number) {
    super();
    if (radius <= 0) {
      throw new Error("Радиус должен быть положительным");
    }
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

export class Rectangle extends Shape {
  readonly name = "Прямоугольник";

  constructor(
    public readonly width: number,
    public readonly height: number
  ) {
    super();
    if (width <= 0 || height <= 0) {
      throw new Error("Стороны должны быть положительными");
    }
  }

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}

export class Triangle extends Shape {
  readonly name = "Треугольник";

  constructor(
    public readonly a: number,
    public readonly b: number,
    public readonly c: number
  ) {
    super();
    if (a <= 0 || b <= 0 || c <= 0) {
      throw new Error("Стороны должны быть положительными");
    }
    // Проверка неравенства треугольника
    if (a + b <= c || a + c <= b || b + c <= a) {
      throw new Error("Стороны не образуют треугольник");
    }
  }

  area(): number {
    // Формула Герона
    const s = this.perimeter() / 2;
    return Math.sqrt(s * (s - this.a) * (s - this.b) * (s - this.c));
  }

  perimeter(): number {
    return this.a + this.b + this.c;
  }
}

/**
 * Вычисляет суммарную площадь массива фигур.
 */
export function totalArea(shapes: Shape[]): number {
  return shapes.reduce((sum, shape) => sum + shape.area(), 0);
}
