// Напиши async-функцию retry(fn, maxAttempts, delayMs)
// Вызывает fn(). При ошибке — повторяет с exponential backoff:
// delayMs, delayMs*2, delayMs*4, ...
// После maxAttempts неудач — выбрасывает последнюю ошибку

export async function retry(fn, maxAttempts, delayMs) {
  // твой код здесь
}
