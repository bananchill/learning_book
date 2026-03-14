import { Callout, DeepDive } from '@book/ui'

# Браузерный DevTools

Браузерные инструменты разработчика — ваш главный инструмент отладки JavaScript в браузере. Откройте их через `F12` или `Ctrl+Shift+I` в Chrome/Firefox.

## Вкладка Console

Console — самая используемая вкладка. Здесь вы видите ошибки, предупреждения и результаты `console.log`.

### Методы console

```javascript
// Основные методы вывода
console.log('Обычное сообщение');
console.warn('Предупреждение');
console.error('Ошибка');
console.info('Информация');

// Группировка сообщений
console.group('Данные пользователя');
console.log('Имя: Иван');
console.log('Возраст: 25');
console.groupEnd();

// Таблица для массивов и объектов
const users = [
  { name: 'Иван', age: 25 },
  { name: 'Мария', age: 30 }
];
console.table(users);

// Замер времени
console.time('операция');
// ... ваш код ...
console.timeEnd('операция'); // операция: 1.234ms
```

<Callout type="tip">
Используйте `console.table()` для вывода массивов объектов — это намного нагляднее, чем `console.log()`.
</Callout>

## Вкладка Sources

Sources позволяет устанавливать точки останова (breakpoints) и пошагово исполнять код.

### Точки останова

1. Откройте нужный файл в Sources
2. Кликните на номер строки — появится синяя метка
3. Перезагрузите страницу или воспроизведите действие
4. Выполнение остановится на этой строке

### Управление отладкой

| Кнопка | Действие |
|---|---|
| ▶ Resume | Продолжить выполнение до следующего breakpoint |
| Step over (F10) | Выполнить текущую строку целиком |
| Step into (F11) | Зайти внутрь вызываемой функции |
| Step out (Shift+F11) | Выйти из текущей функции |

### debugger в коде

```javascript
function calculateTotal(items) {
  debugger; // Выполнение остановится здесь, если DevTools открыт
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

## Вкладка Network

Network показывает все HTTP-запросы, которые делает страница.

- **XHR/Fetch** — фильтр для AJAX-запросов
- **Status** — код ответа (200 OK, 404 Not Found, 500 Server Error)
- **Time** — время выполнения запроса
- **Preview/Response** — тело ответа

<Callout type="tip">
Включите галочку "Preserve log" чтобы логи не очищались при переходе на другую страницу.
</Callout>

## Вкладка Performance

Performance профилирует производительность страницы: где CPU тратит время, когда рендерится DOM.

1. Нажмите "Record"
2. Выполните действие на странице
3. Нажмите "Stop"
4. Изучите флейм-граф вызовов функций

<DeepDive title="Memory вкладка и утечки памяти">

Вкладка Memory помогает находить утечки памяти. Снимок кучи (Heap Snapshot) показывает все объекты в памяти браузера.

Типичная утечка памяти в JavaScript — подписка на события без отписки:

```javascript
// Утечка: обработчик добавляется, но никогда не удаляется
function setupHandler() {
  document.addEventListener('click', () => {
    console.log('клик');
  });
}

// Исправление: сохранить ссылку и удалить при необходимости
const handler = () => console.log('клик');
document.addEventListener('click', handler);
// Позже:
document.removeEventListener('click', handler);
```

</DeepDive>
