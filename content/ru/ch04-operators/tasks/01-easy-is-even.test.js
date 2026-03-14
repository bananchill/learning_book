import { describe, it, expect } from 'vitest';
import { isEven } from './01-easy-is-even.js';

describe('isEven', () => {
  it('возвращает true для чётных чисел', () => {
    expect(isEven(2)).toBe(true);
    expect(isEven(4)).toBe(true);
    expect(isEven(100)).toBe(true);
  });

  it('возвращает false для нечётных чисел', () => {
    expect(isEven(1)).toBe(false);
    expect(isEven(7)).toBe(false);
    expect(isEven(99)).toBe(false);
  });

  it('0 считается чётным', () => {
    expect(isEven(0)).toBe(true);
  });

  it('работает с отрицательными числами', () => {
    expect(isEven(-2)).toBe(true);
    expect(isEven(-3)).toBe(false);
    expect(isEven(-4)).toBe(true);
  });
});
