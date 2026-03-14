// Задача: реализовать повтор async-функции при ошибке
// withRetry(fn, maxAttempts = 3, delayMs = 1000)
//   — вызывает fn()
//   — при ошибке ждёт delayMs мс и пробует снова
//   — после maxAttempts неудачных попыток бросает последнюю ошибку
//   — при успехе возвращает результат fn()

export async function withRetry(fn, maxAttempts = 3, delayMs = 1000) {
  // твой код здесь
}
