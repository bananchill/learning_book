/**
 * Задача 5: Конечный автомат заказа (hard)
 *
 * Реализуйте типобезопасный конечный автомат для управления статусами заказа.
 *
 * Статусы заказа (enum OrderStatus):
 *   Created = "created"
 *   Confirmed = "confirmed"
 *   Processing = "processing"
 *   Shipped = "shipped"
 *   Delivered = "delivered"
 *   Cancelled = "cancelled"
 *
 * Допустимые переходы:
 *   Created -> Confirmed, Cancelled
 *   Confirmed -> Processing, Cancelled
 *   Processing -> Shipped, Cancelled
 *   Shipped -> Delivered
 *   Delivered -> (конечное состояние, нет переходов)
 *   Cancelled -> (конечное состояние, нет переходов)
 *
 * Требования:
 *
 * 1. Создайте enum OrderStatus
 *
 * 2. Определите TRANSITIONS -- объект, описывающий допустимые переходы.
 *    Ключ -- текущий статус, значение -- массив допустимых следующих статусов.
 *
 * 3. Создайте интерфейс Order:
 *    - id: string
 *    - status: OrderStatus
 *    - history: Array<{ from: OrderStatus; to: OrderStatus; timestamp: number }>
 *
 * 4. Реализуйте функцию createOrder(id: string): Order
 *    -- создаёт заказ со статусом Created и пустой историей
 *
 * 5. Реализуйте функцию canTransition(order: Order, to: OrderStatus): boolean
 *    -- проверяет, допустим ли переход
 *
 * 6. Реализуйте функцию transition(order: Order, to: OrderStatus): Order
 *    -- выполняет переход (возвращает новый объект Order)
 *    -- если переход недопустим, бросает Error с сообщением
 *       "Недопустимый переход: <from> -> <to>"
 *
 * 7. Реализуйте функцию getAvailableTransitions(order: Order): OrderStatus[]
 *    -- возвращает массив статусов, в которые можно перейти
 */

// Ваш код здесь:

export enum OrderStatus {
  // Задайте члены enum
}

export const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  // Задайте допустимые переходы
} as Record<OrderStatus, OrderStatus[]>;

export interface Order {
  // Определите интерфейс
  id: string;
  status: OrderStatus;
  history: Array<{ from: OrderStatus; to: OrderStatus; timestamp: number }>;
}

export function createOrder(id: string): Order {
  throw new Error("Не реализовано");
}

export function canTransition(order: Order, to: OrderStatus): boolean {
  throw new Error("Не реализовано");
}

export function transition(order: Order, to: OrderStatus): Order {
  throw new Error("Не реализовано");
}

export function getAvailableTransitions(order: Order): OrderStatus[] {
  throw new Error("Не реализовано");
}
