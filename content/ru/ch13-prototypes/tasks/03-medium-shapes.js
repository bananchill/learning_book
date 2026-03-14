// Задача: реализовать иерархию фигур через классы
//
// Shape — базовый класс
//   constructor(color = 'black')
//   describe() → "Фигура: {color}"
//
// Rectangle extends Shape
//   constructor(width, height, color)
//   area() → ширина * высота
//   describe() → "Прямоугольник: {color}, площадь {area}"
//
// Square extends Rectangle
//   constructor(side, color) — передаёт side как ширину И высоту в Rectangle

export class Shape {
  // твой код здесь
}

export class Rectangle extends Shape {
  // твой код здесь
}

export class Square extends Rectangle {
  // твой код здесь
}
