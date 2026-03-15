/**
 * Задача: Типизация children для различных компонентов
 *
 * Создайте типы и функции-валидаторы для компонентов
 * с разными ограничениями children.
 */

/**
 * Тип: компонент, принимающий только строковый children.
 */
export interface TextOnlyProps {
  children: string
  className?: string
}

/**
 * Тип: простое представление JSX-элемента (без React).
 */
export interface SimpleElement {
  type: string
  props: Record<string, unknown>
}

/**
 * Тип: компонент, принимающий ровно один дочерний элемент.
 */
export interface SingleChildProps {
  children: SimpleElement
}

/**
 * Тип: компонент со списком и render-prop для элементов.
 */
export interface ListOfProps<T> {
  items: T[]
  children: (item: T) => SimpleElement
}

/**
 * Проверяет, что children является строкой.
 *
 * @param children - значение для проверки
 * @returns true если children — строка
 */
export function isTextChildren(children: unknown): children is string {
  // TODO: реализуйте функцию
}

/**
 * Проверяет, что children является SimpleElement
 * (объект с полями type: string и props: object).
 *
 * @param children - значение для проверки
 * @returns true если children — SimpleElement
 */
export function isSingleElement(children: unknown): children is SimpleElement {
  // TODO: реализуйте функцию
}

/**
 * Рендерит список элементов через render-prop.
 * Вызывает children(item) для каждого элемента items.
 *
 * @param props - объект с items и children (render-функция)
 * @returns массив SimpleElement
 */
export function renderList<T>(props: ListOfProps<T>): SimpleElement[] {
  // TODO: реализуйте функцию
}
