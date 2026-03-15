// Задание: расставь правильные типы возврата — void, unknown или never

// 1. Функция логирует сообщение и ничего не возвращает
// Замени any на правильный тип
export function logMessage(message: string): any {
  console.log(`[LOG] ${message}`);
}

// 2. Функция парсит JSON — результат неизвестен заранее
// Замени any на правильный тип
export function parseJSON(input: string): any {
  return JSON.parse(input);
}

// 3. Функция всегда бросает ошибку — никогда не возвращает значение
// Замени any на правильный тип
export function throwError(message: string): any {
  throw new Error(message);
}

// 4. Функция обрабатывает неизвестное значение безопасно
// Параметр value должен быть типа unknown (замени any)
// Функция возвращает string
export function describeValue(value: any): string {
  if (typeof value === 'string') {
    return `строка: "${value}"`;
  }
  if (typeof value === 'number') {
    return `число: ${value}`;
  }
  if (typeof value === 'boolean') {
    return `логическое: ${value}`;
  }
  return 'неизвестный тип';
}

// 5. Функция-обработчик нажатия — ничего не возвращает
// Замени any на правильный тип
export function handleClick(element: HTMLElement, handler: (event: Event) => any): any {
  element.addEventListener('click', handler);
}
