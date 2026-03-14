import { describe, it, expect } from 'vitest';
import { parseArgs } from './02-easy-argv.js';

describe('parseArgs', () => {
  it('парсит аргумент вида --key=value', () => {
    const result = parseArgs(['--host=localhost']);
    expect(result.host).toBe('localhost');
  });

  it('парсит флаг вида --flag как true', () => {
    const result = parseArgs(['--verbose']);
    expect(result.verbose).toBe(true);
  });

  it('парсит несколько аргументов', () => {
    const result = parseArgs(['--host=localhost', '--port=3000', '--verbose']);
    expect(result.host).toBe('localhost');
    expect(result.port).toBe('3000');
    expect(result.verbose).toBe(true);
  });

  it('позиционные аргументы попадают в массив _', () => {
    const result = parseArgs(['file.js', 'output.js']);
    expect(result._).toEqual(['file.js', 'output.js']);
  });

  it('смешивает флаги и позиционные аргументы', () => {
    const result = parseArgs(['--host=localhost', 'file.js', '--verbose']);
    expect(result.host).toBe('localhost');
    expect(result.verbose).toBe(true);
    expect(result._).toContain('file.js');
  });

  it('возвращает пустой _ при отсутствии позиционных аргументов', () => {
    const result = parseArgs(['--flag']);
    expect(result._).toEqual([]);
  });

  it('возвращает объект с _ при пустом массиве', () => {
    const result = parseArgs([]);
    expect(result._).toEqual([]);
  });
});
