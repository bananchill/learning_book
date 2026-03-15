// Задача: Совместимость функций
//
// Реализуйте систему обработчиков событий с корректной типизацией.
// Все типы событий наследуют BaseEvent.

export interface BaseEvent {
  type: string
  timestamp: number
}

export interface ClickEvent extends BaseEvent {
  type: "click"
  clientX: number
  clientY: number
}

export interface KeyPressEvent extends BaseEvent {
  type: "keypress"
  key: string
  code: string
}

export type AppEvent = ClickEvent | KeyPressEvent

// 1. Реализуйте тип обработчика, принимающего событие
export type EventHandler<T extends BaseEvent> = (event: T) => void

// 2. Реализуйте функцию, которая создаёт обработчик для BaseEvent
//    и может использоваться для любого подтипа (контравариантность)
export function createBaseHandler(): EventHandler<BaseEvent> {
  // TODO: верните обработчик, который логирует event.type и timestamp
  return () => {}
}

// 3. Реализуйте функцию, которая создаёт обработчик для ClickEvent
export function createClickHandler(): EventHandler<ClickEvent> {
  // TODO: верните обработчик, который использует clientX и clientY
  return () => {}
}

// 4. Реализуйте функцию dispatch, которая принимает событие и массив
//    обработчиков BaseEvent и вызывает каждый обработчик
export function dispatch(
  event: AppEvent,
  handlers: EventHandler<BaseEvent>[],
): void {
  // TODO: вызовите каждый обработчик с событием
}

// 5. Реализуйте функцию, демонстрирующую, что обработчик с меньшим
//    числом параметров совместим: (event) => void вместо (event, index) => void
export function processEvents(
  events: AppEvent[],
  handler: (event: AppEvent) => void,
): void {
  // TODO: вызовите handler для каждого события
}
