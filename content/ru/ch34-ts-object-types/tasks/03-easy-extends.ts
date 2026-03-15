// Задание: создай иерархию интерфейсов для геометрических фигур

// 1. Создай интерфейс Shape с полями:
//    - kind: string (тип фигуры)
//    - color: string (цвет)

// export interface Shape { ... }

// 2. Создай интерфейс Circle, который расширяет Shape:
//    - kind: "circle" (литеральный тип)
//    - radius: number

// export interface Circle extends Shape { ... }

// 3. Создай интерфейс Rectangle, который расширяет Shape:
//    - kind: "rectangle" (литеральный тип)
//    - width: number
//    - height: number

// export interface Rectangle extends Shape { ... }

// 4. Напиши функцию getArea, которая принимает Circle | Rectangle
//    и возвращает площадь фигуры.
//    Для круга: Math.PI * radius^2
//    Для прямоугольника: width * height

// export function getArea(shape: Circle | Rectangle): number { ... }

// 5. Напиши функцию describe, которая принимает Circle | Rectangle
//    и возвращает строку описания:
//    Для круга: "<color> круг с радиусом <radius>"
//    Для прямоугольника: "<color> прямоугольник <width>x<height>"

// export function describe(shape: Circle | Rectangle): string { ... }
