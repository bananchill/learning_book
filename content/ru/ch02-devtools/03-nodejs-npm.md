import { Callout, DeepDive } from '@book/ui'

# Node.js и npm/pnpm

Node.js — среда выполнения JavaScript на сервере (и в командной строке). Без него невозможна современная JavaScript-разработка: он нужен для запуска инструментов сборки, линтеров, тестов и серверного кода.

## Установка Node.js

Рекомендуемый способ — через **nvm** (Node Version Manager), который позволяет переключаться между версиями.

### macOS / Linux

```bash
# Установка nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Установка последней LTS версии Node.js
nvm install --lts
nvm use --lts
```

### Windows

Используйте **nvm-windows** или скачайте установщик с [nodejs.org](https://nodejs.org) (версия LTS).

### Проверка установки

```bash
node --version   # v20.x.x
npm --version    # 10.x.x
```

## REPL — интерактивная консоль

Node.js REPL (Read-Eval-Print Loop) — интерактивная консоль для быстрого тестирования кода:

```bash
node  # Запустить REPL
```

```javascript
> 2 + 2
4
> const arr = [1, 2, 3]
undefined
> arr.map(x => x * 2)
[ 2, 4, 6 ]
> .exit  // Выход из REPL
```

<Callout type="tip">
Нажмите Tab для автодополнения, стрелку вверх для истории команд.
</Callout>

## Запуск JavaScript файлов

```bash
# Создайте файл hello.js
# console.log('Привет, Node.js!');

node hello.js  # Привет, Node.js!
```

### Аргументы командной строки

```javascript
// args.js
// process.argv[0] — путь к node
// process.argv[1] — путь к файлу
// process.argv[2+] — ваши аргументы
const args = process.argv.slice(2);
console.log('Аргументы:', args);
```

```bash
node args.js hello world
# Аргументы: [ 'hello', 'world' ]
```

## npm — управление пакетами

npm (Node Package Manager) — стандартный менеджер пакетов Node.js.

### package.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "vitest"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "vitest": "^1.0.0"
  }
}
```

### Основные команды npm

```bash
npm init -y              # Создать package.json
npm install express      # Установить пакет
npm install -D vitest    # Установить dev-зависимость
npm uninstall express    # Удалить пакет
npm run start            # Запустить скрипт
npm list                 # Список установленных пакетов
```

## pnpm — быстрая альтернатива npm

pnpm экономит место на диске, используя жёсткие ссылки вместо копирования пакетов. В монорепозиториях это критически важно.

```bash
# Установка pnpm
npm install -g pnpm

# Команды аналогичны npm
pnpm install
pnpm add express
pnpm add -D vitest
pnpm run dev
```

<DeepDive title="Разница между dependencies и devDependencies">

- **dependencies** — пакеты, нужные в продакшне (например, `express`, `react`)
- **devDependencies** — пакеты только для разработки (тесты, линтеры, сборщики)

При `npm install --production` devDependencies не устанавливаются. Это важно для размера образов Docker и скорости деплоя.

Версионирование (`^1.2.3`):
- `^` — обновляет минорные и патч-версии (`1.x.x`)
- `~` — обновляет только патч-версии (`1.2.x`)
- без префикса — точная версия

</DeepDive>
