import { describe, it, expect } from "vitest";

// Импортируйте реализацию после её создания:
// import { orderStateMachine, type OrderState } from "./04-generator-state-machine";

describe("orderStateMachine — конечный автомат заказа", () => {
  it("должен начинать с состояния created", () => {
    // const machine = orderStateMachine();
    // const initial = machine.next();
    // expect(initial.value.status).toBe("created");
    // expect(initial.done).toBe(false);
  });

  it("должен переходить created → paid → shipped → delivered", () => {
    // const machine = orderStateMachine();
    // machine.next(); // Запуск — "created"
    //
    // const paid = machine.next("pay");
    // expect(paid.value.status).toBe("paid");
    // expect(paid.done).toBe(false);
    //
    // const shipped = machine.next("ship");
    // expect(shipped.value.status).toBe("shipped");
    // expect(shipped.done).toBe(false);
    //
    // const delivered = machine.next("deliver");
    // expect(delivered.value.status).toBe("delivered");
    // // "delivered" — конечное состояние, генератор завершается
    // expect(delivered.done).toBe(true);
  });

  it("должен поддерживать отмену из состояния created", () => {
    // const machine = orderStateMachine();
    // machine.next(); // "created"
    //
    // const cancelled = machine.next("cancel");
    // expect(cancelled.value.status).toBe("cancelled");
    // expect(cancelled.done).toBe(true);
  });

  it("должен поддерживать отмену из состояния paid", () => {
    // const machine = orderStateMachine();
    // machine.next();
    // machine.next("pay"); // "paid"
    //
    // const cancelled = machine.next("cancel");
    // expect(cancelled.value.status).toBe("cancelled");
    // expect(cancelled.done).toBe(true);
  });

  it("должен возвращать ошибку при недопустимом действии", () => {
    // const machine = orderStateMachine();
    // machine.next(); // "created"
    //
    // // Нельзя ship из created
    // const invalid = machine.next("ship");
    // expect(invalid.value.status).toBe("created"); // Состояние не изменилось
    // expect(invalid.value.error).toBeDefined();
    // expect(invalid.done).toBe(false);
  });

  it("должен продолжать работу после недопустимого действия", () => {
    // const machine = orderStateMachine();
    // machine.next(); // "created"
    //
    // machine.next("deliver"); // Недопустимо — ошибка
    // const paid = machine.next("pay"); // Допустимо
    // expect(paid.value.status).toBe("paid");
    // expect(paid.value.error).toBeUndefined();
  });

  it("не должен позволять отмену доставленного заказа", () => {
    // const machine = orderStateMachine();
    // machine.next();
    // machine.next("pay");
    // machine.next("ship");
    // const delivered = machine.next("deliver");
    // expect(delivered.value.status).toBe("delivered");
    // expect(delivered.done).toBe(true);
    //
    // // Генератор завершён, дальнейшие next() не имеют эффекта
    // const after = machine.next("cancel");
    // expect(after.done).toBe(true);
  });
});
