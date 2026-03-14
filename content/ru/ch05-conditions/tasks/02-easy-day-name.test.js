import { describe, it, expect } from 'vitest';
import { getDayName } from './02-easy-day-name.js';

describe('getDayName', () => {
  it('возвращает правильные названия дней', () => {
    expect(getDayName(1)).toBe('Понедельник');
    expect(getDayName(2)).toBe('Вторник');
    expect(getDayName(3)).toBe('Среда');
    expect(getDayName(4)).toBe('Четверг');
    expect(getDayName(5)).toBe('Пятница');
    expect(getDayName(6)).toBe('Суббота');
    expect(getDayName(7)).toBe('Воскресенье');
  });

  it('возвращает null для значений вне диапазона', () => {
    expect(getDayName(0)).toBeNull();
    expect(getDayName(8)).toBeNull();
    expect(getDayName(-1)).toBeNull();
    expect(getDayName(100)).toBeNull();
  });
});
