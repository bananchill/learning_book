// Задание: используй declaration merging (namespace + class)
//
// Создай класс Color и расширь его через namespace:
// - Класс Color хранит r, g, b (0-255) и имеет метод toHex(): string
// - Namespace Color добавляет:
//   - Интерфейс RGB с полями r, g, b (number)
//   - Фабричный метод fromHex(hex: string): Color
//   - Предопределённые константы: RED, GREEN, BLUE (экземпляры Color)

// 1. Реализуй класс Color
export class Color {
  // Конструктор принимает r, g, b (числа от 0 до 255)
  constructor(public r: number, public g: number, public b: number) {}

  // Метод toHex() возвращает строку вида "#ff0000"
  toHex(): string {
    // Реализуй здесь
  }

  // Метод toString() возвращает "rgb(r, g, b)"
  toString(): string {
    // Реализуй здесь
  }
}

// 2. Расширь класс через namespace Color:
//    - export interface RGB { r: number; g: number; b: number; }
//    - export function fromHex(hex: string): Color
//      (парсит "#rrggbb" или "rrggbb" и создаёт Color)
//    - export const RED: Color   (255, 0, 0)
//    - export const GREEN: Color (0, 255, 0)
//    - export const BLUE: Color  (0, 0, 255)

// Напиши namespace здесь:
