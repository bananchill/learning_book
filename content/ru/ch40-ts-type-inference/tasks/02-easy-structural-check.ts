// Задача: Проверка структурной совместимости
//
// Определите, какие объекты совместимы с какими интерфейсами.
// Реализуйте функции, возвращающие true/false.

export interface HasName {
  name: string
}

export interface HasAge {
  age: number
}

export interface Person {
  name: string
  age: number
  email: string
}

// Вопрос 1: Можно ли присвоить объект типа Person переменной типа HasName?
export function isPersonCompatibleWithHasName(): boolean {
  // TODO: верните true или false
  return false
}

// Вопрос 2: Можно ли присвоить объект типа HasName переменной типа Person?
export function isHasNameCompatibleWithPerson(): boolean {
  // TODO: верните true или false
  return false
}

// Вопрос 3: Можно ли присвоить объект типа Person переменной типа HasAge?
export function isPersonCompatibleWithHasAge(): boolean {
  // TODO: верните true или false
  return false
}

// Вопрос 4: Совместимы ли HasName и HasAge друг с другом?
export function areHasNameAndHasAgeCompatible(): boolean {
  // TODO: верните true или false
  return false
}

// Вопрос 5: Функция принимает HasName. Можно ли передать
// объектный литерал { name: "Алиса", age: 30 } напрямую?
export function canPassLiteralWithExtraProps(): boolean {
  // TODO: верните true или false (учитывайте excess property check)
  return false
}
