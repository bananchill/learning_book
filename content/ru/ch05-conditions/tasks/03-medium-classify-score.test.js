import { describe, it, expect } from 'vitest';
import { classify } from './03-medium-classify-score.js';

describe('classify', () => {
  it('возвращает A для 90-100', () => {
    expect(classify(100)).toBe('A');
    expect(classify(95)).toBe('A');
    expect(classify(90)).toBe('A');
  });

  it('возвращает B для 80-89', () => {
    expect(classify(89)).toBe('B');
    expect(classify(85)).toBe('B');
    expect(classify(80)).toBe('B');
  });

  it('возвращает C для 70-79', () => {
    expect(classify(79)).toBe('C');
    expect(classify(75)).toBe('C');
    expect(classify(70)).toBe('C');
  });

  it('возвращает D для 60-69', () => {
    expect(classify(69)).toBe('D');
    expect(classify(65)).toBe('D');
    expect(classify(60)).toBe('D');
  });

  it('возвращает F для 0-59', () => {
    expect(classify(59)).toBe('F');
    expect(classify(50)).toBe('F');
    expect(classify(0)).toBe('F');
  });

  it('возвращает null для значений вне диапазона', () => {
    expect(classify(-1)).toBeNull();
    expect(classify(101)).toBeNull();
    expect(classify(-100)).toBeNull();
  });
});
