// Задача: Конечный автомат заказа на генераторе
// Сложность: medium
//
// Реализуйте конечный автомат (state machine) для заказа, используя генератор
// с типизированным TNext. Генератор отдаёт текущее состояние заказа через yield
// и принимает действия (actions) через next().
//
// Состояния заказа:
//   "created" → "paid" → "shipped" → "delivered"
//
// Допустимые переходы:
//   "created"   + "pay"     → "paid"
//   "paid"      + "ship"    → "shipped"
//   "shipped"   + "deliver" → "delivered"
//   Любое состояние + "cancel" → "cancelled" (кроме "delivered")
//   Недопустимое действие → состояние не меняется, генератор отдаёт ошибку
//
// Требования:
// 1. Определите типы OrderStatus и OrderAction
// 2. Определите тип OrderState с полями: status, message, error?
// 3. Реализуйте функцию-генератор orderStateMachine()
//    Тип: Generator<OrderState, OrderState, OrderAction>
// 4. Генератор должен начинать с состояния "created"
// 5. При недопустимом действии — отдавать текущее состояние с полем error

// TODO: Определите типы
// export type OrderStatus = ...
// export type OrderAction = ...
// export interface OrderState { ... }

// TODO: Реализуйте генератор
// export function* orderStateMachine(): Generator<OrderState, OrderState, OrderAction> {
//   ...
// }

export {};
