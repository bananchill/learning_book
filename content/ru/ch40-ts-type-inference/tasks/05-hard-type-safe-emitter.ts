// Задача: Типобезопасный EventEmitter с вариантностью
//
// Реализуйте generic EventEmitter<Events>, где Events -- объект,
// описывающий все возможные события и их типы payload.
//
// Пример использования:
//   interface MyEvents {
//     click: { x: number; y: number }
//     message: string
//     disconnect: void
//   }
//   const emitter = new TypedEmitter<MyEvents>()
//   emitter.on("click", (payload) => { payload.x }) // payload: { x: number; y: number }
//   emitter.emit("click", { x: 10, y: 20 })

export class TypedEmitter<Events extends Record<string, unknown>> {
  // TODO: хранилище обработчиков
  // Подсказка: используйте Map<keyof Events, Set<Function>>

  // on: подписка на событие
  // Тип handler должен быть контравариантным по payload
  on<K extends keyof Events>(
    event: K,
    handler: (payload: Events[K]) => void,
  ): void {
    // TODO: реализуйте
  }

  // off: отписка от события
  off<K extends keyof Events>(
    event: K,
    handler: (payload: Events[K]) => void,
  ): void {
    // TODO: реализуйте
  }

  // emit: генерация события
  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    // TODO: реализуйте
  }

  // once: подписка, которая срабатывает один раз
  once<K extends keyof Events>(
    event: K,
    handler: (payload: Events[K]) => void,
  ): void {
    // TODO: реализуйте через on + off
  }

  // listenerCount: количество обработчиков для события
  listenerCount<K extends keyof Events>(event: K): number {
    // TODO: реализуйте
    return 0
  }

  // removeAllListeners: удалить все обработчики для события
  removeAllListeners<K extends keyof Events>(event: K): void {
    // TODO: реализуйте
  }
}
