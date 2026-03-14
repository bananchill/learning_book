import { describe, it, expect } from 'vitest';
import { repeat } from './02-easy-repeat.js';

describe('repeat', () => {
  it('вызывает функцию n раз и возвращает результаты', () => {
    expect(repeat(() => 'hi', 3)).toEqual(['hi', 'hi', 'hi']);
  });

  it('передаёт индекс итерации как аргумент', () => {
    expect(repeat(i => i * 2, 4)).toEqual([0, 2, 4, 6]);
  });

  it('возвращает квадраты индексов', () => {
    expect(repeat(i => i ** 2, 5)).toEqual([0, 1, 4, 9, 16]);
  });

  it('возвращает пустой массив при n = 0', () => {
    expect(repeat(() => 'test', 0)).toEqual([]);
  });

  it('одна итерация', () => {
    expect(repeat(i => i + 10, 1)).toEqual([10]);
  });

  it('вызывает fn ровно n раз', () => {
    let callCount = 0;
    repeat(() => { callCount++; }, 7);
    expect(callCount).toBe(7);
  });
});
