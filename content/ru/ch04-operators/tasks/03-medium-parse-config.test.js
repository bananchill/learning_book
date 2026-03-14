import { describe, it, expect } from 'vitest';
import { parseConfig } from './03-medium-parse-config.js';

describe('parseConfig', () => {
  it('возвращает полный конфиг с дефолтами при пустом вводе', () => {
    expect(parseConfig({})).toEqual({
      host: 'localhost',
      port: 3000,
      ssl: false,
      timeout: 5000,
      retries: 3,
    });
  });

  it('использует переданные значения вместо дефолтов', () => {
    const result = parseConfig({ port: 8080, ssl: true });
    expect(result.port).toBe(8080);
    expect(result.ssl).toBe(true);
    expect(result.host).toBe('localhost'); // дефолт
  });

  it('принимает полный конфиг без изменений', () => {
    const full = { host: 'api.com', port: 443, ssl: true, timeout: 10000, retries: 5 };
    expect(parseConfig(full)).toEqual(full);
  });

  it('работает без аргументов', () => {
    const result = parseConfig();
    expect(result.host).toBe('localhost');
    expect(result.port).toBe(3000);
  });

  it('не мутирует входной объект', () => {
    const input = { port: 8080 };
    parseConfig(input);
    expect(input).toEqual({ port: 8080 }); // без добавленных полей
  });

  it('возвращает все обязательные поля', () => {
    const result = parseConfig({ host: 'example.com' });
    expect(result).toHaveProperty('host', 'example.com');
    expect(result).toHaveProperty('port');
    expect(result).toHaveProperty('ssl');
    expect(result).toHaveProperty('timeout');
    expect(result).toHaveProperty('retries');
  });
});
