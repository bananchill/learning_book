// Задание: фильтрация событий с Exclude и Extract
//
// Дан union-тип событий AppEvent. Нужно:
// 1. Создать тип MouseEvent — только события с полями x и y (используй Extract)
// 2. Создать тип KeyboardEvent — только событие keydown (используй Extract)
// 3. Создать тип NonMouseEvent — все события, кроме click и mousemove (используй Exclude)
// 4. Написать функцию getEventDescription, которая возвращает описание для каждого типа события

export type AppEvent =
  | { type: 'click'; x: number; y: number }
  | { type: 'mousemove'; x: number; y: number }
  | { type: 'keydown'; key: string; code: string }
  | { type: 'scroll'; offset: number }
  | { type: 'resize'; width: number; height: number }

// Создай тип: только события с координатами x, y
export type MouseAppEvent = Extract<AppEvent, { x: number; y: number }>

// Создай тип: только событие keydown
export type KeyboardAppEvent = Extract<AppEvent, { type: 'keydown' }>

// Создай тип: все события кроме click и mousemove
export type NonMouseAppEvent = Exclude<AppEvent, { x: number; y: number }>

// Напиши функцию, которая возвращает описание события
// click → "Клик в (x, y)"
// mousemove → "Движение мыши: (x, y)"
// keydown → "Нажата клавиша: key"
// scroll → "Прокрутка: offset px"
// resize → "Размер окна: width x height"
export function getEventDescription(event: AppEvent): string {
  // твой код здесь
  return ''
}
