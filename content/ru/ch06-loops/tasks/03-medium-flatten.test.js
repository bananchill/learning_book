import { describe, it, expect } from 'vitest';
import { flatten } from './03-medium-flatten.js';

describe('flatten', () => {
  it('возвращает плоский массив без изменений', () => {
    expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('разворачивает один уровень вложенности', () => {
    expect(flatten([1, [2, 3], 4])).toEqual([1, 2, 3, 4]);
  });

  it('разворачивает несколько вложенных массивов', () => {
    expect(flatten([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
  });

  it('разворачивает только один уровень (не глубже)', () => {
    expect(flatten([1, [2, [3, 4]], 5])).toEqual([1, 2, [3, 4], 5]);
  });

  it('работает с пустым массивом', () => {
    expect(flatten([])).toEqual([]);
  });

  it('обрабатывает вложенные пустые массивы', () => {
    expect(flatten([1, [], 2, [], 3])).toEqual([1, 2, 3]);
  });

  it('не мутирует исходный массив', () => {
    const original = [[1, 2], [3, 4]];
    flatten(original);
    expect(original).toEqual([[1, 2], [3, 4]]);
  });
});
