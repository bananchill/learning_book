import { describe, it, expect } from 'vitest';
import { compose } from './01-easy-compose.js';

describe('compose', () => {
  const double = x => x * 2;
  const addOne = x => x + 1;
  const square = x => x ** 2;
  const negate = x => -x;

  it('возвращает функцию', () => {
    expect(typeof compose(double, addOne)).toBe('function');
  });

  it('compose(double, addOne)(5) = double(addOne(5)) = 12', () => {
    expect(compose(double, addOne)(5)).toBe(12);
  });

  it('compose(addOne, double)(5) = addOne(double(5)) = 11', () => {
    expect(compose(addOne, double)(5)).toBe(11);
  });

  it('compose(negate, square)(3) = -9', () => {
    expect(compose(negate, square)(3)).toBe(-9);
  });

  it('работает с одной и той же функцией', () => {
    expect(compose(double, double)(3)).toBe(12); // double(double(3)) = 12
  });

  it('применяет g перед f (не f перед g)', () => {
    // addOne(double(2)) = addOne(4) = 5
    // double(addOne(2)) = double(3) = 6
    expect(compose(addOne, double)(2)).toBe(5); // g=double, f=addOne
    expect(compose(double, addOne)(2)).toBe(6); // g=addOne, f=double
  });
});
