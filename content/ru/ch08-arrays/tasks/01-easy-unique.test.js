import { describe, it, expect } from 'vitest';
import { unique } from './01-easy-unique.js';

describe('unique', () => {
  it('убирает дубликаты чисел', () => {
    expect(unique([1, 2, 3, 2, 1])).toEqual([1, 2, 3]);
  });

  it('убирает дубликаты строк', () => {
    expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
  });

  it('не считает 1 и "1" одинаковыми (строгое сравнение)', () => {
    expect(unique([1, '1', 1])).toEqual([1, '1']);
  });

  it('возвращает пустой массив для пустого', () => {
    expect(unique([])).toEqual([]);
  });

  it('возвращает тот же массив если нет дубликатов', () => {
    expect(unique([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('сохраняет первое вхождение', () => {
    const result = unique([2, 1, 2, 3, 1]);
    expect(result).toEqual([2, 1, 3]);
  });

  it('не мутирует исходный массив', () => {
    const original = [1, 2, 2, 3];
    unique(original);
    expect(original).toEqual([1, 2, 2, 3]);
  });
});
