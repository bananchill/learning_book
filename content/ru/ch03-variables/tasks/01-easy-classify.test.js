import { describe, it, expect } from 'vitest';
import { classifyValue } from './01-easy-classify.js';

describe('classifyValue', () => {
  it('классифицирует числа', () => {
    expect(classifyValue(42)).toBe('number');
    expect(classifyValue(3.14)).toBe('number');
    expect(classifyValue(-7)).toBe('number');
    expect(classifyValue(0)).toBe('number');
  });

  it('классифицирует NaN как number', () => {
    expect(classifyValue(NaN)).toBe('number');
  });

  it('классифицирует Infinity как number', () => {
    expect(classifyValue(Infinity)).toBe('number');
  });

  it('классифицирует строки', () => {
    expect(classifyValue('hello')).toBe('string');
    expect(classifyValue('')).toBe('string');
    expect(classifyValue('42')).toBe('string');
  });

  it('классифицирует булевы значения', () => {
    expect(classifyValue(true)).toBe('boolean');
    expect(classifyValue(false)).toBe('boolean');
  });

  it('классифицирует null как "null", не как "object"', () => {
    expect(classifyValue(null)).toBe('null');
  });

  it('классифицирует undefined', () => {
    expect(classifyValue(undefined)).toBe('undefined');
    expect(classifyValue()).toBe('undefined');
  });

  it('классифицирует объекты как "other"', () => {
    expect(classifyValue({})).toBe('other');
    expect(classifyValue({ a: 1 })).toBe('other');
  });

  it('классифицирует массивы как "other"', () => {
    expect(classifyValue([])).toBe('other');
    expect(classifyValue([1, 2, 3])).toBe('other');
  });

  it('классифицирует функции как "other"', () => {
    expect(classifyValue(() => {})).toBe('other');
    expect(classifyValue(function() {})).toBe('other');
  });
});
