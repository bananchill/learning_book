import { describe, it, expect } from "vitest";
import {
  OrderStatus,
  TRANSITIONS,
  createOrder,
  canTransition,
  transition,
  getAvailableTransitions,
} from "./05-state-machine";

describe("OrderStatus enum", () => {
  it("должен содержать все статусы", () => {
    expect(OrderStatus.Created).toBe("created");
    expect(OrderStatus.Confirmed).toBe("confirmed");
    expect(OrderStatus.Processing).toBe("processing");
    expect(OrderStatus.Shipped).toBe("shipped");
    expect(OrderStatus.Delivered).toBe("delivered");
    expect(OrderStatus.Cancelled).toBe("cancelled");
  });
});

describe("TRANSITIONS", () => {
  it("должен описывать допустимые переходы для каждого статуса", () => {
    expect(TRANSITIONS[OrderStatus.Created]).toContain(OrderStatus.Confirmed);
    expect(TRANSITIONS[OrderStatus.Created]).toContain(OrderStatus.Cancelled);
    expect(TRANSITIONS[OrderStatus.Confirmed]).toContain(OrderStatus.Processing);
    expect(TRANSITIONS[OrderStatus.Confirmed]).toContain(OrderStatus.Cancelled);
    expect(TRANSITIONS[OrderStatus.Processing]).toContain(OrderStatus.Shipped);
    expect(TRANSITIONS[OrderStatus.Processing]).toContain(OrderStatus.Cancelled);
    expect(TRANSITIONS[OrderStatus.Shipped]).toContain(OrderStatus.Delivered);
  });

  it("конечные состояния не должны иметь переходов", () => {
    expect(TRANSITIONS[OrderStatus.Delivered]).toEqual([]);
    expect(TRANSITIONS[OrderStatus.Cancelled]).toEqual([]);
  });
});

describe("createOrder", () => {
  it("должен создать заказ со статусом Created", () => {
    const order = createOrder("order-1");
    expect(order.id).toBe("order-1");
    expect(order.status).toBe(OrderStatus.Created);
    expect(order.history).toEqual([]);
  });
});

describe("canTransition", () => {
  it("должен вернуть true для допустимых переходов", () => {
    const order = createOrder("order-1");
    expect(canTransition(order, OrderStatus.Confirmed)).toBe(true);
    expect(canTransition(order, OrderStatus.Cancelled)).toBe(true);
  });

  it("должен вернуть false для недопустимых переходов", () => {
    const order = createOrder("order-1");
    expect(canTransition(order, OrderStatus.Shipped)).toBe(false);
    expect(canTransition(order, OrderStatus.Delivered)).toBe(false);
  });

  it("должен вернуть false для конечных состояний", () => {
    const delivered = {
      id: "order-1",
      status: OrderStatus.Delivered,
      history: [],
    };
    expect(canTransition(delivered, OrderStatus.Created)).toBe(false);
    expect(canTransition(delivered, OrderStatus.Cancelled)).toBe(false);
  });
});

describe("transition", () => {
  it("должен выполнить допустимый переход", () => {
    const order = createOrder("order-1");
    const confirmed = transition(order, OrderStatus.Confirmed);

    expect(confirmed.status).toBe(OrderStatus.Confirmed);
    expect(confirmed.history).toHaveLength(1);
    expect(confirmed.history[0].from).toBe(OrderStatus.Created);
    expect(confirmed.history[0].to).toBe(OrderStatus.Confirmed);
    expect(typeof confirmed.history[0].timestamp).toBe("number");
  });

  it("должен сохранять историю переходов", () => {
    let order = createOrder("order-1");
    order = transition(order, OrderStatus.Confirmed);
    order = transition(order, OrderStatus.Processing);
    order = transition(order, OrderStatus.Shipped);

    expect(order.history).toHaveLength(3);
    expect(order.history[0].from).toBe(OrderStatus.Created);
    expect(order.history[0].to).toBe(OrderStatus.Confirmed);
    expect(order.history[1].from).toBe(OrderStatus.Confirmed);
    expect(order.history[1].to).toBe(OrderStatus.Processing);
    expect(order.history[2].from).toBe(OrderStatus.Processing);
    expect(order.history[2].to).toBe(OrderStatus.Shipped);
  });

  it("должен бросить ошибку для недопустимого перехода", () => {
    const order = createOrder("order-1");
    expect(() => transition(order, OrderStatus.Shipped)).toThrow(
      "Недопустимый переход: created -> shipped"
    );
  });

  it("не должен мутировать исходный объект", () => {
    const order = createOrder("order-1");
    const confirmed = transition(order, OrderStatus.Confirmed);

    expect(order.status).toBe(OrderStatus.Created);
    expect(order.history).toHaveLength(0);
    expect(confirmed.status).toBe(OrderStatus.Confirmed);
  });
});

describe("getAvailableTransitions", () => {
  it("должен вернуть допустимые переходы из Created", () => {
    const order = createOrder("order-1");
    const available = getAvailableTransitions(order);
    expect(available).toContain(OrderStatus.Confirmed);
    expect(available).toContain(OrderStatus.Cancelled);
    expect(available).toHaveLength(2);
  });

  it("должен вернуть пустой массив для конечного состояния", () => {
    const delivered = {
      id: "order-1",
      status: OrderStatus.Delivered,
      history: [],
    };
    expect(getAvailableTransitions(delivered)).toEqual([]);
  });
});
