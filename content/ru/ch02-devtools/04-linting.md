import { Callout, DeepDive } from '@book/ui'

# Линтинг и форматирование

Линтер находит потенциальные ошибки и нарушения стиля кода. Форматтер автоматически приводит код к единому стилю. Вместе они обеспечивают консистентность кода в команде без ручных ревью стиля.

## ESLint — линтер JavaScript

### Установка

```bash
npm install -D eslint @eslint/js
npx eslint --init  # Интерактивная настройка
```

(`npx` — утилита из npm, запускающая пакет без глобальной установки)

### Конфигурация (eslint.config.js)

Современный формат конфигурации (Flat Config, ESLint 9+):

```javascript
// eslint.config.js
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      // Запрет console.log в продакшн-коде
      'no-console': 'warn',
      // Требовать строгое равенство ===
      'eqeqeq': 'error',
      // Запрет объявленных, но неиспользуемых переменных
      'no-unused-vars': 'error',
      // Запрет var, только let/const
      'no-var': 'error',
      // Предпочитать const где возможно
      'prefer-const': 'warn'
    }
  }
];
```

### Запуск ESLint

```bash
npx eslint src/          # Проверить папку
npx eslint src/ --fix    # Автоматически исправить что можно
```

<Callout type="tip">
Используйте `--fix` только для механических правок (пробелы, точки с запятой). Логические ошибки ESLint не исправляет.
</Callout>

## Prettier — форматтер кода

Prettier форматирует код по единому стилю, убирая все споры о пробелах и переносах строк.

### Установка

```bash
npm install -D prettier
```

### Конфигурация (.prettierrc)

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### Запуск Prettier

```bash
npx prettier --write src/    # Форматировать все файлы
npx prettier --check src/    # Только проверить (в CI)
```

## .editorconfig

`.editorconfig` настраивает базовые параметры редактора независимо от IDE:

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

<Callout type="info">
VS Code поддерживает `.editorconfig` через расширение `EditorConfig.EditorConfig`. Добавьте его в рекомендуемые для команды (`.vscode/extensions.json`).
</Callout>

## Husky — Git хуки

Husky позволяет запускать линтер и тесты автоматически перед каждым коммитом.

```bash
npm install -D husky lint-staged
npx husky init
```

### pre-commit хук

```bash
# .husky/pre-commit
npx lint-staged
```

### lint-staged конфигурация

```json
// package.json
{
  "lint-staged": {
    "*.{js,ts,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

Теперь при каждом `git commit` автоматически запускается форматирование и линтинг только изменённых файлов.

<DeepDive title="ESLint + Prettier — конфликты настроек">

ESLint и Prettier иногда конфликтуют: оба хотят управлять форматированием. Решение — пакет `eslint-config-prettier`, который отключает ESLint-правила, конфликтующие с Prettier:

```bash
npm install -D eslint-config-prettier
```

```javascript
// eslint.config.js
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  prettier,  // Должен быть последним — отключает конфликтующие правила
  {
    rules: {
      'no-unused-vars': 'error',
      // Форматирование здесь НЕ настраиваем — это работа Prettier
    }
  }
];
```

</DeepDive>
