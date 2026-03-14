import { describe, it, expect } from 'vitest';
import { sumTo } from './01-easy-sum-to.js';

describe('sumTo', () => {
  it('sumTo(1) = 1', () => {
    expect(sumTo(1)).toBe(1);
  });

  it('sumTo(5) = 15', () => {
    expect(sumTo(5)).toBe(15);
  });

  it('sumTo(10) = 55', () => {
    expect(sumTo(10)).toBe(55);
  });

  it('sumTo(100) = 5050', () => {
    expect(sumTo(100)).toBe(5050);
  });

  it('sumTo(0) = 0', () => {
    expect(sumTo(0)).toBe(0);
  });

  it('sumTo(-1) = 0', () => {
    expect(sumTo(-1)).toBe(0);
  });
});
