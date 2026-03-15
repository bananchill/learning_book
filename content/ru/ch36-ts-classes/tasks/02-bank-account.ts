/**
 * Задача: Банковский счёт
 *
 * Реализуйте класс BankAccount с правильными модификаторами доступа:
 * 1. Приватное поле balance (начальный баланс передаётся в конструктор)
 * 2. Readonly поле accountId (генерируется в конструкторе)
 * 3. Публичное поле ownerName
 * 4. Метод deposit(amount) — пополнение (amount > 0)
 * 5. Метод withdraw(amount) — снятие (amount > 0, не больше баланса)
 * 6. Метод getBalance() — возвращает текущий баланс
 * 7. Метод transfer(to, amount) — перевод на другой счёт
 *
 * Все невалидные операции должны выбрасывать Error.
 */

export class BankAccount {
  private balance: number;
  readonly accountId: string;
  public ownerName: string;

  constructor(ownerName: string, initialBalance: number, accountId: string) {
    if (initialBalance < 0) {
      throw new Error("Начальный баланс не может быть отрицательным");
    }
    this.ownerName = ownerName;
    this.balance = initialBalance;
    this.accountId = accountId;
  }

  /**
   * Пополнение счёта. Сумма должна быть положительной.
   */
  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error("Сумма пополнения должна быть положительной");
    }
    this.balance += amount;
  }

  /**
   * Снятие со счёта. Сумма должна быть положительной и не превышать баланс.
   */
  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error("Сумма снятия должна быть положительной");
    }
    if (amount > this.balance) {
      throw new Error("Недостаточно средств");
    }
    this.balance -= amount;
  }

  /**
   * Возвращает текущий баланс.
   */
  getBalance(): number {
    return this.balance;
  }

  /**
   * Перевод средств на другой счёт.
   */
  transfer(to: BankAccount, amount: number): void {
    this.withdraw(amount);
    to.deposit(amount);
  }
}
