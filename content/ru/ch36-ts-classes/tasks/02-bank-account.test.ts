import { describe, it, expect } from "vitest";
import { BankAccount } from "./02-bank-account";

describe("BankAccount", () => {
  it("должен создавать счёт с начальным балансом", () => {
    const account = new BankAccount("Иван", 1000, "ACC-001");

    expect(account.ownerName).toBe("Иван");
    expect(account.accountId).toBe("ACC-001");
    expect(account.getBalance()).toBe(1000);
  });

  it("должен выбрасывать ошибку при отрицательном начальном балансе", () => {
    expect(() => new BankAccount("Иван", -100, "ACC-001")).toThrow();
  });

  it("должен пополнять счёт", () => {
    const account = new BankAccount("Иван", 500, "ACC-001");
    account.deposit(300);

    expect(account.getBalance()).toBe(800);
  });

  it("должен выбрасывать ошибку при пополнении неположительной суммой", () => {
    const account = new BankAccount("Иван", 500, "ACC-001");

    expect(() => account.deposit(0)).toThrow();
    expect(() => account.deposit(-100)).toThrow();
  });

  it("должен снимать средства со счёта", () => {
    const account = new BankAccount("Иван", 1000, "ACC-001");
    account.withdraw(400);

    expect(account.getBalance()).toBe(600);
  });

  it("должен выбрасывать ошибку при снятии суммы больше баланса", () => {
    const account = new BankAccount("Иван", 100, "ACC-001");

    expect(() => account.withdraw(200)).toThrow("Недостаточно средств");
  });

  it("должен выбрасывать ошибку при снятии неположительной суммы", () => {
    const account = new BankAccount("Иван", 1000, "ACC-001");

    expect(() => account.withdraw(0)).toThrow();
    expect(() => account.withdraw(-50)).toThrow();
  });

  it("должен переводить средства между счетами", () => {
    const from = new BankAccount("Иван", 1000, "ACC-001");
    const to = new BankAccount("Мария", 500, "ACC-002");

    from.transfer(to, 300);

    expect(from.getBalance()).toBe(700);
    expect(to.getBalance()).toBe(800);
  });

  it("должен выбрасывать ошибку при переводе суммы больше баланса", () => {
    const from = new BankAccount("Иван", 100, "ACC-001");
    const to = new BankAccount("Мария", 500, "ACC-002");

    expect(() => from.transfer(to, 200)).toThrow("Недостаточно средств");
    // Баланс получателя не должен измениться
    expect(to.getBalance()).toBe(500);
  });
});
