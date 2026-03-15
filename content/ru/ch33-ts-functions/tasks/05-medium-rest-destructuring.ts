// Задание: типизируй функции с rest-параметрами и деструктуризацией

// 1. Функция принимает первый элемент и остаток массива строк.
//    Верни строку: "первый: {first}, остальные: {rest через запятую}"
export function describeList(first: any, ...rest: any): string {
  const restStr = rest.length > 0 ? rest.join(', ') : 'нет';
  return `первый: ${first}, остальные: ${restStr}`;
}

// 2. Типизируй деструктуризацию параметра.
//    Функция принимает объект с полями name (string), age (number),
//    и опциональным city (string, по умолчанию "Москва").
export function describeUser({ name, age, city }: any): string {
  return `${name}, ${age} лет, ${city}`;
}

// 3. Функция принимает произвольное количество чисел и возвращает их сумму.
//    Типизируй rest-параметр.
export function sum(...args: any): number {
  return args.reduce((acc: number, n: number) => acc + n, 0);
}

// 4. Исправь вызов: spread массива в функцию с фиксированными параметрами.
//    Используй as const или кортежный тип.
export function createPoint(x: number, y: number): { x: number; y: number } {
  return { x, y };
}

// Эта функция должна создать точку из массива координат.
// Исправь так, чтобы TypeScript не ругался.
export function pointFromArray(coords: number[]): { x: number; y: number } {
  // Подсказка: нужно изменить тип параметра coords
  // чтобы spread работал с createPoint
  return createPoint(coords[0], coords[1]);
}

// 5. Типизируй деструктуризацию кортежа.
//    Функция принимает кортеж [string, number] и возвращает объект.
export function tupleToObject(tuple: any): { name: string; value: number } {
  const [name, value] = tuple;
  return { name, value };
}
