import { describe, it, expect } from 'vitest';
import { safeAdd } from './02-easy-safe-add.js';

describe('safeAdd', () => {
  it('складывает два целых числа', () => {
    expect(safeAdd(2, 3)).toBe(5);
    expect(safeAdd(10, -3)).toBe(7);
    expect(safeAdd(0, 0)).toBe(0);
  });

  it('складывает дробные числа', () => {
    expect(safeAdd(1.5, 2.5)).toBe(4);
    expect(safeAdd(0.1, 0.2)).toBeCloseTo(0.3);
  });

  it('возвращает NaN если первый аргумент — строка', () => {
    expect(safeAdd('5', 3)).toBeNaN();
    expect(safeAdd('hello', 1)).toBeNaN();
  });

  it('возвращает NaN если второй аргумент — строка', () => {
    expect(safeAdd(3, '5')).toBeNaN();
  });

  it('возвращает NaN если оба аргумента — строки', () => {
    expect(safeAdd('2', '3')).toBeNaN();
  });

  it('возвращает NaN если аргумент NaN', () => {
    expect(safeAdd(NaN, 1)).toBeNaN();
    expect(safeAdd(1, NaN)).toBeNaN();
  });

  it('возвращает NaN для null', () => {
    expect(safeAdd(null, 1)).toBeNaN();
    expect(safeAdd(1, null)).toBeNaN();
  });

  it('возвращает NaN для undefined', () => {
    expect(safeAdd(undefined, 1)).toBeNaN();
  });

  it('возвращает NaN для boolean', () => {
    expect(safeAdd(true, 1)).toBeNaN();
    expect(safeAdd(1, false)).toBeNaN();
  });
});
