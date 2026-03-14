import { describe, it, expect } from 'vitest';
import { groupBy } from './02-easy-group-by.js';

describe('groupBy', () => {
  it('группирует по строковому полю', () => {
    const users = [
      { role: 'admin', name: 'Иван' },
      { role: 'user', name: 'Мария' },
      { role: 'admin', name: 'Пётр' },
    ];
    const result = groupBy(users, 'role');
    expect(result.admin).toHaveLength(2);
    expect(result.user).toHaveLength(1);
    expect(result.admin[0].name).toBe('Иван');
  });

  it('группирует по функции-геттеру', () => {
    const nums = [1, 2, 3, 4, 5, 6];
    const result = groupBy(nums, n => n % 2 === 0 ? 'even' : 'odd');
    expect(result.even).toEqual([2, 4, 6]);
    expect(result.odd).toEqual([1, 3, 5]);
  });

  it('возвращает пустой объект для пустого массива', () => {
    expect(groupBy([], 'type')).toEqual({});
  });

  it('все элементы в одну группу', () => {
    const items = [{ type: 'a' }, { type: 'a' }];
    const result = groupBy(items, 'type');
    expect(result.a).toHaveLength(2);
  });

  it('каждый элемент в свою группу', () => {
    const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = groupBy(items, 'id');
    expect(Object.keys(result)).toHaveLength(3);
  });
});
