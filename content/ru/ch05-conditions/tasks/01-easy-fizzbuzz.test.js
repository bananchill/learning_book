import { describe, it, expect } from 'vitest';
import { getFizzBuzz } from './01-easy-fizzbuzz.js';

describe('getFizzBuzz', () => {
  it('возвращает FizzBuzz для чисел кратных 15', () => {
    expect(getFizzBuzz(15)).toBe('FizzBuzz');
    expect(getFizzBuzz(30)).toBe('FizzBuzz');
    expect(getFizzBuzz(45)).toBe('FizzBuzz');
  });

  it('возвращает Fizz для чисел кратных 3 (но не 15)', () => {
    expect(getFizzBuzz(3)).toBe('Fizz');
    expect(getFizzBuzz(6)).toBe('Fizz');
    expect(getFizzBuzz(9)).toBe('Fizz');
    expect(getFizzBuzz(12)).toBe('Fizz');
  });

  it('возвращает Buzz для чисел кратных 5 (но не 15)', () => {
    expect(getFizzBuzz(5)).toBe('Buzz');
    expect(getFizzBuzz(10)).toBe('Buzz');
    expect(getFizzBuzz(20)).toBe('Buzz');
    expect(getFizzBuzz(25)).toBe('Buzz');
  });

  it('возвращает строку числа для остальных', () => {
    expect(getFizzBuzz(1)).toBe('1');
    expect(getFizzBuzz(2)).toBe('2');
    expect(getFizzBuzz(7)).toBe('7');
    expect(getFizzBuzz(11)).toBe('11');
  });
});
