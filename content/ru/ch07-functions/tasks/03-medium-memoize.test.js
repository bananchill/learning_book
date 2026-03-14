import { describe, it, expect, vi } from 'vitest';
import { memoize } from './03-medium-memoize.js';

describe('memoize', () => {
  it('возвращает правильный результат при первом вызове', () => {
    const double = memoize(x => x * 2);
    expect(double(5)).toBe(10);
  });

  it('возвращает кэшированный результат при повторном вызове', () => {
    const spy = vi.fn(x => x * 2);
    const memoized = memoize(spy);

    memoized(5);
    memoized(5);
    memoized(5);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('вызывает оригинальную функцию для разных аргументов', () => {
    const spy = vi.fn(x => x * 2);
    const memoized = memoize(spy);

    memoized(3);
    memoized(5);
    memoized(7);

    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('кэширует отдельно для каждого набора аргументов', () => {
    const spy = vi.fn((a, b) => a + b);
    const memoized = memoize(spy);

    memoized(1, 2); // кэш: '1,2' → 3
    memoized(1, 2); // кэш
    memoized(2, 1); // кэш: '2,1' → 3 (другой ключ!)

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('работает с функцией без аргументов', () => {
    let count = 0;
    const memoized = memoize(() => ++count);

    expect(memoized()).toBe(1);
    expect(memoized()).toBe(1); // кэш
    expect(count).toBe(1);
  });

  it('кэширует значение 0 и false корректно', () => {
    const spy = vi.fn(() => 0);
    const memoized = memoize(spy);

    expect(memoized('key')).toBe(0);
    expect(memoized('key')).toBe(0); // должен вернуть 0, не вычислять снова
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
