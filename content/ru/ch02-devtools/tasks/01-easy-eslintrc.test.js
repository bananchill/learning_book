import { describe, it, expect } from 'vitest';
import { createEslintConfig } from './01-easy-eslintrc.js';

describe('createEslintConfig', () => {
  it('возвращает объект с полями env и rules', () => {
    const config = createEslintConfig({});
    expect(config).toHaveProperty('env');
    expect(config).toHaveProperty('rules');
  });

  it('при strict: true использует "error" для правил', () => {
    const config = createEslintConfig({ strict: true });
    expect(config.rules['no-unused-vars']).toBe('error');
  });

  it('при strict: false использует "warn" для правил', () => {
    const config = createEslintConfig({ strict: false });
    expect(config.rules['no-unused-vars']).toBe('warn');
  });

  it('при allowConsole: true правило no-console "off"', () => {
    const config = createEslintConfig({ allowConsole: true });
    expect(config.rules['no-console']).toBe('off');
  });

  it('при allowConsole: false правило no-console включено', () => {
    const config = createEslintConfig({ allowConsole: false });
    expect(['warn', 'error']).toContain(config.rules['no-console']);
  });

  it('при es6: true env содержит es6: true', () => {
    const config = createEslintConfig({ es6: true });
    expect(config.env.es6).toBe(true);
  });

  it('включает правила no-var и prefer-const', () => {
    const config = createEslintConfig({});
    expect(config.rules).toHaveProperty('no-var');
    expect(config.rules).toHaveProperty('prefer-const');
  });
});
