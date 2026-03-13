// Создай систему UI-событий с discriminated union
//
// 1. Определи типы для четырёх событий:
//    - ClickEvent: type 'click', x: number, y: number, button: 'left' | 'right'
//    - HoverEvent: type 'hover', x: number, y: number
//    - KeyPressEvent: type 'keypress', key: string, ctrlKey: boolean
//    - ScrollEvent: type 'scroll', deltaY: number, direction: 'up' | 'down'
//
// 2. Создай union тип UIEvent
//
// 3. Напиши функцию handleEvent, которая возвращает строковое описание события
//    и содержит exhaustive check с never

export type ClickEvent = {
  // твой код
}

export type HoverEvent = {
  // твой код
}

export type KeyPressEvent = {
  // твой код
}

export type ScrollEvent = {
  // твой код
}

export type UIEvent = unknown // замени на union

export function handleEvent(event: UIEvent): string {
  // Используй switch по event.type
  // Верни описание: "click at (10, 20) left", "hover at (5, 5)", "keypress: Enter", "scroll down 100"
  // Не забудь exhaustive check с never
  return ''
}
