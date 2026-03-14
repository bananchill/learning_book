/**
 * Задача: EventEmitter — аналог Node.js EventEmitter
 *
 * Реализуйте класс EventEmitter:
 * - on(event, handler) — подписывается на событие
 * - off(event, handler) — отписывается от события
 * - once(event, handler) — подписывается один раз
 * - emit(event, ...args) — вызывает все обработчики события
 * - removeAllListeners(event?) — удаляет все обработчики (или для конкретного события)
 */
export class EventEmitter {
  constructor() {
    // TODO: инициализируйте хранилище обработчиков
  }

  /**
   * Подписаться на событие
   */
  on(event, handler) {
    // TODO
    return this // для chain
  }

  /**
   * Отписаться от события
   */
  off(event, handler) {
    // TODO
    return this
  }

  /**
   * Подписаться один раз
   */
  once(event, handler) {
    // TODO: создайте wrapper, который вызовет off после первого срабатывания
    return this
  }

  /**
   * Вызвать все обработчики события
   * @returns {boolean} true если были обработчики
   */
  emit(event, ...args) {
    // TODO
    return false
  }

  /**
   * Удалить все обработчики
   * @param {string} [event] — если не передан, удалить все
   */
  removeAllListeners(event) {
    // TODO
    return this
  }
}
