// Создай функцию parallelMap(items, workerCode, poolSize)
// items — массив данных для обработки
// workerCode — строка с JS-кодом воркера (inline worker)
//   Воркер получает элемент через postMessage,
//   обрабатывает и отправляет результат через postMessage
// poolSize — количество воркеров в пуле
//
// Возвращает промис с массивом результатов в исходном порядке
// Воркеры должны работать параллельно

export function parallelMap(items, workerCode, poolSize) {
  // твой код здесь
}
