/**
 * Задача: Неизменяемая конфигурация
 *
 * Создайте класс AppConfig с readonly-полями.
 * Класс должен:
 * 1. Принимать в конструкторе apiUrl (string), timeout (number), debug (boolean)
 * 2. Все поля должны быть readonly
 * 3. Метод clone(overrides) создаёт новый AppConfig, заменяя указанные поля
 * 4. Метод toString() возвращает строковое представление конфигурации
 */

// Тип для частичного переопределения конфигурации
export type ConfigOverrides = Partial<{
  apiUrl: string;
  timeout: number;
  debug: boolean;
}>;

export class AppConfig {
  // Реализуйте класс
  readonly apiUrl: string;
  readonly timeout: number;
  readonly debug: boolean;

  constructor(apiUrl: string, timeout: number, debug: boolean) {
    this.apiUrl = apiUrl;
    this.timeout = timeout;
    this.debug = debug;
  }

  /**
   * Создаёт новый экземпляр конфигурации с переопределёнными полями.
   * Исходный объект не изменяется.
   */
  clone(overrides: ConfigOverrides = {}): AppConfig {
    return new AppConfig(
      overrides.apiUrl ?? this.apiUrl,
      overrides.timeout ?? this.timeout,
      overrides.debug ?? this.debug
    );
  }

  /**
   * Возвращает строковое представление конфигурации.
   * Формат: "AppConfig { apiUrl: ..., timeout: ..., debug: ... }"
   */
  toString(): string {
    return `AppConfig { apiUrl: ${this.apiUrl}, timeout: ${this.timeout}, debug: ${this.debug} }`;
  }
}
