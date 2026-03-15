/**
 * Задача: Типобезопасный EventEmitter
 *
 * Реализуйте класс TypedEmitter<Events>, где Events — объект вида:
 *   { click: (x: number, y: number) => void; resize: (w: number, h: number) => void }
 *
 * Методы:
 * - on(event, handler) — подписка на событие
 * - off(event, handler) — отписка от события
 * - emit(event, ...args) — вызов всех обработчиков с аргументами
 * - listenerCount(event) — количество подписчиков на событие
 *
 * Требования:
 * - Имена событий ограничены ключами Events
 * - handler должен соответствовать сигнатуре из Events
 * - emit принимает аргументы, соответствующие параметрам обработчика
 */

// TODO: реализуйте класс с параметром типа
export class TypedEmitter {
  // TODO: хранилище обработчиков

  on(event: any, handler: any): void {
    // TODO: подписка
  }

  off(event: any, handler: any): void {
    // TODO: отписка
  }

  emit(event: any, ...args: any[]): void {
    // TODO: вызов обработчиков
  }

  listenerCount(event: any): number {
    // TODO: количество подписчиков
    return 0
  }
}
