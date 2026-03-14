import { describe, it, expect } from 'vitest';
import { deepEqual } from './03-medium-deep-equal.js';

describe('deepEqual', () => {
  it('одинаковые числа равны', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual(3.14, 3.14)).toBe(true);
    expect(deepEqual(0, 0)).toBe(true);
  });

  it('разные числа не равны', () => {
    expect(deepEqual(1, 2)).toBe(false);
    expect(deepEqual(1, -1)).toBe(false);
  });

  it('NaN равен NaN', () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
  });

  it('+0 и -0 не равны', () => {
    expect(deepEqual(+0, -0)).toBe(false);
    expect(deepEqual(-0, +0)).toBe(false);
  });

  it('+0 равен +0', () => {
    expect(deepEqual(+0, +0)).toBe(true);
  });

  it('строки сравниваются строго', () => {
    expect(deepEqual('hello', 'hello')).toBe(true);
    expect(deepEqual('', '')).toBe(true);
    expect(deepEqual('a', 'b')).toBe(false);
  });

  it('null равен только null', () => {
    expect(deepEqual(null, null)).toBe(true);
    expect(deepEqual(null, undefined)).toBe(false);
    expect(deepEqual(null, 0)).toBe(false);
  });

  it('undefined равен только undefined', () => {
    expect(deepEqual(undefined, undefined)).toBe(true);
    expect(deepEqual(undefined, null)).toBe(false);
  });

  it('разные типы не равны', () => {
    expect(deepEqual(1, '1')).toBe(false);
    expect(deepEqual(0, false)).toBe(false);
    expect(deepEqual('', false)).toBe(false);
  });

  it('булевы значения', () => {
    expect(deepEqual(true, true)).toBe(true);
    expect(deepEqual(false, false)).toBe(true);
    expect(deepEqual(true, false)).toBe(false);
  });
});
