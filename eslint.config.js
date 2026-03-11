import js from '@eslint/js'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: ts.parser,
        sourceType: 'module',
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      // Разрешаем defineProps/defineEmits без импорта
      'no-undef': 'off',
      // Vue 3 — многословные имена не обязательны
      'vue/multi-word-component-names': 'off',
      // TypeScript строгость
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '**/vite.config.ts',
      '**/vitest.config.ts',
      'eslint.config.js',
    ],
  },
]
