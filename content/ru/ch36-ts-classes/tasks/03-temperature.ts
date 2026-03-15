/**
 * Задача: Температурный конвертер
 *
 * Создайте класс Temperature с геттерами и сеттерами:
 * 1. Внутреннее хранение в Цельсиях (private _celsius)
 * 2. Геттер/сеттер celsius — прямой доступ
 * 3. Геттер/сеттер fahrenheit — конвертация F = C * 9/5 + 32
 * 4. Геттер/сеттер kelvin — конвертация K = C + 273.15
 * 5. Все сеттеры валидируют: температура не может быть ниже абсолютного нуля (-273.15°C)
 * 6. Статический метод fromFahrenheit(f) — создаёт Temperature из Фаренгейта
 * 7. Статический метод fromKelvin(k) — создаёт Temperature из Кельвина
 */

export class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    if (celsius < -273.15) {
      throw new Error("Температура ниже абсолютного нуля");
    }
    this._celsius = celsius;
  }

  // Геттер и сеттер для Цельсия
  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Температура ниже абсолютного нуля");
    }
    this._celsius = value;
  }

  // Геттер и сеттер для Фаренгейта
  get fahrenheit(): number {
    return this._celsius * 9 / 5 + 32;
  }

  set fahrenheit(value: number) {
    const celsius = (value - 32) * 5 / 9;
    if (celsius < -273.15) {
      throw new Error("Температура ниже абсолютного нуля");
    }
    this._celsius = celsius;
  }

  // Геттер и сеттер для Кельвина
  get kelvin(): number {
    return this._celsius + 273.15;
  }

  set kelvin(value: number) {
    if (value < 0) {
      throw new Error("Температура ниже абсолютного нуля");
    }
    this._celsius = value - 273.15;
  }

  // Статические фабричные методы
  static fromFahrenheit(fahrenheit: number): Temperature {
    const celsius = (fahrenheit - 32) * 5 / 9;
    return new Temperature(celsius);
  }

  static fromKelvin(kelvin: number): Temperature {
    return new Temperature(kelvin - 273.15);
  }
}
