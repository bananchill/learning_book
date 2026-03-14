/**
 * Задача: fetchWithTimeout — fetch с таймаутом
 *
 * Реализуйте функцию fetchWithTimeout(url, timeout = 5000):
 * - Выполняет fetch запрос к url
 * - Если запрос занимает больше timeout мс — отменяет его
 * - При отмене бросает ошибку с message 'Timeout'
 * - При HTTP ошибке (не ok) бросает ошибку с HTTP статусом
 *
 * @param {string} url
 * @param {number} [timeout=5000]
 * @returns {Promise<Response>}
 */
export async function fetchWithTimeout(url, timeout = 5000) {
  // TODO: реализуйте fetch с таймаутом через AbortController
}
