import { describe, it, expect } from 'vitest';
import { generatePackageScripts } from './03-medium-package-scripts.js';

describe('generatePackageScripts', () => {
  const baseConfig = {
    linter: 'eslint',
    formatter: 'prettier',
    testRunner: 'vitest',
    srcDir: 'src',
    typescript: false,
  };

  it('генерирует команду lint для eslint', () => {
    const scripts = generatePackageScripts(baseConfig);
    expect(scripts.lint).toContain('eslint');
    expect(scripts.lint).toContain('src');
  });

  it('генерирует команду lint:fix с флагом --fix', () => {
    const scripts = generatePackageScripts(baseConfig);
    expect(scripts['lint:fix']).toContain('--fix');
  });

  it('генерирует команду format для prettier', () => {
    const scripts = generatePackageScripts({ ...baseConfig, formatter: 'prettier' });
    expect(scripts.format).toContain('prettier');
    expect(scripts.format).toContain('src');
  });

  it('генерирует команды test и test:watch для vitest', () => {
    const scripts = generatePackageScripts({ ...baseConfig, testRunner: 'vitest' });
    expect(scripts.test).toContain('vitest');
    expect(scripts['test:watch']).toContain('vitest');
  });

  it('генерирует команды test и test:watch для jest', () => {
    const scripts = generatePackageScripts({ ...baseConfig, testRunner: 'jest' });
    expect(scripts.test).toContain('jest');
  });

  it('при typescript: true добавляет скрипт typecheck', () => {
    const scripts = generatePackageScripts({ ...baseConfig, typescript: true });
    expect(scripts.typecheck).toBeDefined();
    expect(scripts.typecheck).toContain('tsc');
  });

  it('при typescript: false не добавляет скрипт typecheck', () => {
    const scripts = generatePackageScripts({ ...baseConfig, typescript: false });
    expect(scripts.typecheck).toBeUndefined();
  });

  it('использует кастомный srcDir', () => {
    const scripts = generatePackageScripts({ ...baseConfig, srcDir: 'lib' });
    expect(scripts.lint).toContain('lib');
  });
});
