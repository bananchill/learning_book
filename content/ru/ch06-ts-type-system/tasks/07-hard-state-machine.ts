// Типизированная state machine для заказа
//
// Состояния: Draft → Confirmed → Shipped → Delivered
// Допустимые переходы:
//   draft     → confirmed
//   confirmed → shipped
//   shipped   → delivered
//
// Невалидный переход (draft → shipped) должен быть невозможен на уровне типов.
//
// 1. Определи типы для каждого состояния (discriminated union по полю status)
// 2. Определи маппинг допустимых переходов
// 3. Реализуй функцию transition

export type DraftOrder = {
  status: 'draft'
  items: string[]
}

export type ConfirmedOrder = {
  status: 'confirmed'
  items: string[]
  confirmedAt: Date
}

export type ShippedOrder = {
  status: 'shipped'
  items: string[]
  confirmedAt: Date
  trackingNumber: string
}

export type DeliveredOrder = {
  status: 'delivered'
  items: string[]
  confirmedAt: Date
  trackingNumber: string
  deliveredAt: Date
}

export type Order = DraftOrder | ConfirmedOrder | ShippedOrder | DeliveredOrder

// Маппинг допустимых переходов: текущий статус → следующий статус
export type TransitionMap = {
  draft: 'confirmed'
  confirmed: 'shipped'
  shipped: 'delivered'
}

// Реализуй функции перехода между состояниями

export function confirmOrder(order: DraftOrder): ConfirmedOrder {
  // Создай ConfirmedOrder из DraftOrder
  // Добавь confirmedAt: new Date()
  return {} as ConfirmedOrder // твой код
}

export function shipOrder(order: ConfirmedOrder, trackingNumber: string): ShippedOrder {
  // Создай ShippedOrder из ConfirmedOrder
  // Добавь trackingNumber
  return {} as ShippedOrder // твой код
}

export function deliverOrder(order: ShippedOrder): DeliveredOrder {
  // Создай DeliveredOrder из ShippedOrder
  // Добавь deliveredAt: new Date()
  return {} as DeliveredOrder // твой код
}

// Функция для получения описания статуса
export function getStatusDescription(order: Order): string {
  // Используй switch с exhaustive check
  return ''
}
