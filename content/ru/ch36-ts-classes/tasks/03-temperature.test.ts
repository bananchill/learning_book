import { describe, it, expect } from "vitest";
import { Temperature } from "./03-temperature";

describe("Temperature", () => {
  it("должен создавать температуру в Цельсиях", () => {
    const temp = new Temperature(100);
    expect(temp.celsius).toBe(100);
  });

  it("должен конвертировать в Фаренгейт", () => {
    const temp = new Temperature(0);
    expect(temp.fahrenheit).toBe(32);

    const boiling = new Temperature(100);
    expect(boiling.fahrenheit).toBe(212);
  });

  it("должен конвертировать в Кельвин", () => {
    const temp = new Temperature(0);
    expect(temp.kelvin).toBeCloseTo(273.15);

    const absolute = new Temperature(-273.15);
    expect(absolute.kelvin).toBeCloseTo(0);
  });

  it("должен устанавливать температуру через сеттер fahrenheit", () => {
    const temp = new Temperature(0);
    temp.fahrenheit = 212;
    expect(temp.celsius).toBeCloseTo(100);
  });

  it("должен устанавливать температуру через сеттер kelvin", () => {
    const temp = new Temperature(0);
    temp.kelvin = 0;
    expect(temp.celsius).toBeCloseTo(-273.15);
  });

  it("должен выбрасывать ошибку при температуре ниже абсолютного нуля", () => {
    expect(() => new Temperature(-300)).toThrow("абсолютного нуля");
  });

  it("должен выбрасывать ошибку при установке celsius ниже абсолютного нуля", () => {
    const temp = new Temperature(0);
    expect(() => { temp.celsius = -300; }).toThrow("абсолютного нуля");
  });

  it("должен выбрасывать ошибку при установке kelvin ниже 0", () => {
    const temp = new Temperature(0);
    expect(() => { temp.kelvin = -1; }).toThrow("абсолютного нуля");
  });

  it("должен создавать экземпляр из Фаренгейта через статический метод", () => {
    const temp = Temperature.fromFahrenheit(32);
    expect(temp.celsius).toBeCloseTo(0);
  });

  it("должен создавать экземпляр из Кельвина через статический метод", () => {
    const temp = Temperature.fromKelvin(273.15);
    expect(temp.celsius).toBeCloseTo(0);
  });
});
