/**
 * Задача: Реализация собственного JSX-пространства имён
 *
 * Реализуйте упрощённую модель JSX: функцию createElement,
 * которая создаёт объекты-элементы для intrinsic-тегов
 * и вызывает функциональные компоненты.
 */

/**
 * Представление JSX-элемента.
 */
export interface VNode {
  type: string | Function
  props: Record<string, unknown>
  children: Array<VNode | string | number | null>
}

/**
 * Тип функционального компонента.
 */
export type FunctionComponent<P extends Record<string, unknown> = Record<string, unknown>> = (
  props: P & { children?: Array<VNode | string | number | null> }
) => VNode

/**
 * Словарь допустимых intrinsic-элементов и их атрибутов.
 */
export interface IntrinsicElementMap {
  div: { className?: string; id?: string }
  span: { className?: string; id?: string }
  p: { className?: string; id?: string }
  button: { className?: string; id?: string; disabled?: boolean; onClick?: () => void }
  input: { className?: string; id?: string; type?: string; value?: string; placeholder?: string }
  a: { className?: string; id?: string; href: string; target?: string }
}

/**
 * Создаёт VNode для intrinsic-элемента (строковый тег).
 *
 * @param tag - имя HTML-тега (ключ из IntrinsicElementMap)
 * @param props - атрибуты элемента (или null)
 * @param children - дочерние элементы
 * @returns VNode с type = tag
 */
export function createElement(
  tag: string,
  props: Record<string, unknown> | null,
  ...children: Array<VNode | string | number | null>
): VNode

/**
 * Создаёт VNode через вызов функционального компонента.
 *
 * @param tag - функциональный компонент
 * @param props - пропсы компонента (или null)
 * @param children - дочерние элементы
 * @returns результат вызова компонента
 */
export function createElement(
  tag: Function,
  props: Record<string, unknown> | null,
  ...children: Array<VNode | string | number | null>
): VNode

/**
 * Реализация createElement.
 */
export function createElement(
  tag: string | Function,
  props: Record<string, unknown> | null,
  ...children: Array<VNode | string | number | null>
): VNode {
  // TODO: реализуйте функцию
  // Если tag — строка: верните VNode { type: tag, props: { ...(props || {}) }, children }
  // Если tag — функция: вызовите tag({ ...(props || {}), children }) и верните результат
}

/**
 * Проверяет, является ли значение VNode.
 *
 * @param value - значение для проверки
 * @returns true если value является VNode
 */
export function isVNode(value: unknown): value is VNode {
  // TODO: реализуйте функцию
}

/**
 * Рекурсивно подсчитывает общее количество VNode в дереве
 * (включая корневой узел).
 *
 * @param node - корневой VNode
 * @returns количество VNode в дереве
 */
export function countNodes(node: VNode): number {
  // TODO: реализуйте функцию
}
