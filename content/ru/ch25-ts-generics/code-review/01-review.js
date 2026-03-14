// Найдите проблемы в этом коде
// Задача: создать generic утилиты для работы с массивами

// Проблема 1: потеря типовой информации
function getFirst(arr) {
  return arr[0]
}

// Проблема 2: дублирование вместо дженерика
function wrapNumber(value) {
  return { value: value, type: 'number' }
}

function wrapString(value) {
  return { value: value, type: 'string' }
}

// Проблема 3: небезопасное использование any
function merge(a, b) {
  return Object.assign({}, a, b)
}

// Проблема 4: потеря связи между input и output
function transform(items, fn) {
  return items.map(fn)
}

// Проблема 5: нет защиты от пустого массива
function last(arr) {
  return arr[arr.length - 1]
}

export { getFirst, wrapNumber, wrapString, merge, transform, last }
