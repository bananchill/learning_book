/**
 * Задача: TypedEventEmitter
 *
 * Реализуйте класс TypedEventEmitter с методами:
 * - on(event, handler) — подписывается на событие
 * - off(event, handler) — отписывается от события
 * - emit(event, data) — вызывает все обработчики события
 * - once(event, handler) — подписывается один раз (auto-unsubscribe)
 */
export class TypedEventEmitter {
  constructor() {
    // TODO: инициализируйте хранилище обработчиков
  }

  on(event, handler) {
    // TODO: добавьте обработчик
  }

  off(event, handler) {
    // TODO: удалите обработчик
  }

  emit(event, data) {
    // TODO: вызовите все обработчики для данного события
  }

  once(event, handler) {
    // TODO: подпишитесь один раз — после первого вызова отписаться
  }
}
