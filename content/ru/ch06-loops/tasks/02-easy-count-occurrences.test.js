import { describe, it, expect } from 'vitest';
import { countOccurrences } from './02-easy-count-occurrences.js';

describe('countOccurrences', () => {
  it('считает вхождения числа', () => {
    expect(countOccurrences([1, 2, 3, 2, 1], 2)).toBe(2);
    expect(countOccurrences([1, 2, 3, 2, 1], 1)).toBe(2);
  });

  it('возвращает 0 если значение не найдено', () => {
    expect(countOccurrences([1, 2, 3], 5)).toBe(0);
  });

  it('возвращает 0 для пустого массива', () => {
    expect(countOccurrences([], 1)).toBe(0);
  });

  it('считает вхождения строки', () => {
    expect(countOccurrences(['a', 'b', 'a', 'c', 'a'], 'a')).toBe(3);
  });

  it('использует строгое сравнение', () => {
    expect(countOccurrences([1, '1', 1, true], 1)).toBe(2);
    expect(countOccurrences([1, '1', 1, true], '1')).toBe(1);
    expect(countOccurrences([1, '1', 1, true], true)).toBe(1);
  });

  it('считает все элементы если массив однородный', () => {
    expect(countOccurrences([5, 5, 5, 5], 5)).toBe(4);
  });
});
