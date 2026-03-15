/**
 * Задача: Объявление IntrinsicElements для кастомных тегов
 *
 * Расширьте JSX.IntrinsicElements, добавив кастомный тег <alert-box>.
 * Реализуйте функцию createAlertBox, которая возвращает объект
 * с переданными пропсами.
 */

// Тип severity для alert-box
export type AlertSeverity = 'info' | 'warning' | 'error'

// Интерфейс пропсов для alert-box
export interface AlertBoxProps {
  message: string
  severity?: AlertSeverity
}

/**
 * Создаёт объект, представляющий кастомный элемент alert-box.
 *
 * @param message - текст сообщения (обязательный)
 * @param severity - уровень важности: 'info' | 'warning' | 'error' (опциональный, по умолчанию 'info')
 * @returns объект { tag: 'alert-box', message, severity }
 */
export function createAlertBox(
  message: string,
  severity?: AlertSeverity
): { tag: string; message: string; severity: AlertSeverity } {
  // TODO: реализуйте функцию
}
