import { describe, it, expect } from 'vitest';
import { pipeline } from './03-medium-pipeline.js';

describe('pipeline', () => {
  it('применяет функции слева направо', () => {
    const process = pipeline(
      x => x + 1,
      x => x * 2,
      x => x - 3
    );
    expect(process(5)).toBe(9); // ((5+1)*2)-3 = 9
  });

  it('работает с одной функцией', () => {
    const double = pipeline(x => x * 2);
    expect(double(5)).toBe(10);
  });

  it('без функций возвращает значение как есть', () => {
    expect(pipeline()(5)).toBe(5);
    expect(pipeline()('hello')).toBe('hello');
  });

  it('работает со строковыми операциями', () => {
    const process = pipeline(
      s => s.trim(),
      s => s.toLowerCase(),
      s => s.replace(/\s+/g, '-')
    );
    expect(process('  Hello World  ')).toBe('hello-world');
  });

  it('работает с числовыми операциями', () => {
    const process = pipeline(Math.abs, Math.round, String);
    expect(process(-3.7)).toBe('4');
  });

  it('возвращает функцию', () => {
    expect(typeof pipeline(x => x)).toBe('function');
  });
});
