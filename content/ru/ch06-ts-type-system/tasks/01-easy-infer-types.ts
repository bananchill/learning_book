// Определи, какой тип выведет TypeScript для каждого объявления.
// Верни строку с названием типа.
// Примеры типов: "string", "number", "\"hello\"", "42", "string[]", "readonly [1, 2, 3]"

export function inferConstString(): string {
  // Какой тип у: const x = 'hello'
  // Верни строку с названием типа
  return '' // твой ответ
}

export function inferLetString(): string {
  // Какой тип у: let x = 'hello'
  return '' // твой ответ
}

export function inferConstNumber(): string {
  // Какой тип у: const x = 42
  return '' // твой ответ
}

export function inferLetNumber(): string {
  // Какой тип у: let x = 42
  return '' // твой ответ
}

export function inferConstArray(): string {
  // Какой тип у: const x = [1, 2, 3]
  return '' // твой ответ
}

export function inferAsConstArray(): string {
  // Какой тип у: const x = [1, 2, 3] as const
  return '' // твой ответ
}
