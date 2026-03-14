/**
 * Задача: createWebSocket — WebSocket с авто-переподключением
 *
 * Реализуйте функцию createWebSocket(url, onMessage):
 * - Создаёт WebSocket соединение
 * - onMessage вызывается при каждом сообщении (с JSON.parse данных)
 * - При неожиданном закрытии (wasClean = false) — переподключается через 1 сек
 * - Возвращает объект { send(data), close() }
 * - close() — намеренное закрытие без переподключения
 *
 * @param {string} url
 * @param {(data: any) => void} onMessage
 * @returns {{ send: (data: any) => void, close: () => void }}
 */
export function createWebSocket(url, onMessage) {
  // TODO: реализуйте WebSocket с авто-переподключением
}
