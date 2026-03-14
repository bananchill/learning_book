import { Callout } from '@book/ui'

# Шпаргалка: Среда разработки

## VS Code — горячие клавиши

| Действие | Windows/Linux | macOS |
|---|---|---|
| Командная палитра | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Поиск файла | `Ctrl+P` | `Cmd+P` |
| Переход к определению | `F12` | `F12` |
| Форматирование | `Shift+Alt+F` | `Shift+Option+F` |
| Переименование | `F2` | `F2` |

## Консольные методы

```javascript
console.log(value)        // Вывод значения
console.table(array)      // Таблица для массивов
console.group('title')    // Начало группы
console.time('label')     // Начало таймера
console.timeEnd('label')  // Конец таймера
```

## npm / pnpm команды

```bash
npm init -y              # Создать package.json
npm install pkg          # Установить зависимость
npm install -D pkg       # Установить dev-зависимость
npm run script           # Запустить скрипт
npm list                 # Список пакетов
```

## ESLint

```bash
npx eslint src/          # Проверить
npx eslint src/ --fix    # Исправить
```

## Prettier

```bash
npx prettier --write .   # Форматировать
npx prettier --check .   # Проверить в CI
```

## .prettierrc минимальный конфиг

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 80
}
```

<Callout type="tip">
Добавьте все конфиги в репозиторий — это гарантирует одинаковое окружение для всей команды.
</Callout>
