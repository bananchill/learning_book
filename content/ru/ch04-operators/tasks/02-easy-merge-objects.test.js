import { describe, it, expect } from 'vitest';
import { mergeObjects } from './02-easy-merge-objects.js';

describe('mergeObjects', () => {
  it('сливает два объекта', () => {
    expect(mergeObjects({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('последний объект побеждает при конфликте', () => {
    expect(mergeObjects({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
    expect(mergeObjects({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 });
  });

  it('сливает три и более объектов', () => {
    expect(mergeObjects({ a: 1 }, { b: 2 }, { c: 3 })).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('возвращает пустой объект без аргументов', () => {
    expect(mergeObjects()).toEqual({});
  });

  it('возвращает копию при одном аргументе', () => {
    const obj = { a: 1 };
    const result = mergeObjects(obj);
    expect(result).toEqual({ a: 1 });
  });

  it('не мутирует исходные объекты', () => {
    const obj1 = { a: 1 };
    const obj2 = { b: 2 };
    mergeObjects(obj1, obj2);
    expect(obj1).toEqual({ a: 1 });
    expect(obj2).toEqual({ b: 2 });
  });
});
