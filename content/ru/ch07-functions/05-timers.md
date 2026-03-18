import { Callout, DeepDive } from '@book/ui'

# Таймеры и планирование

JavaScript предоставляет встроенные функции для отложенного и периодического выполнения кода. Они незаменимы для анимаций, опроса сервера и оптимизации пользовательского ввода.

## setTimeout — отложенный вызов

Функция `setTimeout` выполняет callback один раз через указанное количество миллисекунд. Третий и последующие аргументы передаются в callback как параметры.

```javascript
// Синтаксис: setTimeout(callback, задержка, ...аргументы)
const timerId = setTimeout((name) => {
  console.log(`Привет, ${name}!`);
}, 2000, 'Мир');

// Отмена до срабатывания
clearTimeout(timerId);
```

Функция возвращает числовой идентификатор таймера. Передайте его в `clearTimeout`, чтобы отменить запланированный вызов до того, как он сработает.

```javascript
// Практический пример — показать подсказку с задержкой
function showTooltip(element, text) {
  const timerId = setTimeout(() => {
    element.textContent = text;
    element.hidden = false;
  }, 500);

  // Возвращаем функцию отмены
  return () => clearTimeout(timerId);
}
```

## setInterval — периодический вызов

Функция `setInterval` вызывает callback многократно с фиксированным интервалом. Для остановки используется `clearInterval`.

```javascript
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`Тик: ${count}`);

  if (count >= 5) {
    clearInterval(intervalId); // Остановка после 5 тиков
  }
}, 1000);
```

Проблема `setInterval` в том, что интервал отсчитывается от начала предыдущего вызова, а не от его завершения. Если callback выполняется дольше интервала, вызовы начнут накладываться друг на друга.

```javascript
// Рекурсивный setTimeout — гарантирует паузу МЕЖДУ вызовами
function reliableTick(count = 0) {
  console.log(`Тик: ${count}`);

  if (count < 5) {
    setTimeout(() => reliableTick(count + 1), 1000);
  }
}

reliableTick();
```

## Нулевая задержка и Event Loop

Вызов `setTimeout(fn, 0)` не означает мгновенное выполнение. Callback попадает в очередь макрозадач и выполнится только после завершения текущего синхронного кода.

```javascript
console.log('Начало');

setTimeout(() => {
  console.log('Таймер'); // Выполнится последним
}, 0);

console.log('Конец');

// Начало
// Конец
// Таймер
```

<Callout type="info">
Подробнее о цикле событий, микрозадачах и макрозадачах — в главе [Асинхронность](/ch02-async). Здесь достаточно запомнить: `setTimeout(fn, 0)` — это «выполни после текущего кода», а не «выполни мгновенно».
</Callout>

## Debounce и throttle

**Debounce** откладывает вызов функции до тех пор, пока пользователь не прекратит действие. Например, поиск начинается только после того, как пользователь перестал печатать.

```javascript
function debounce(fn, delay) {
  let timerId;

  return function (...args) {
    clearTimeout(timerId); // Сбрасываем предыдущий таймер
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Поиск сработает через 300мс после последнего нажатия клавиши
const searchInput = document.querySelector('#search');
searchInput.addEventListener('input', debounce((event) => {
  console.log('Ищем:', event.target.value);
}, 300));
```

**Throttle** гарантирует, что функция вызывается не чаще одного раза за указанный интервал. Полезно для событий `scroll` и `resize`, которые срабатывают десятки раз в секунду.

```javascript
function throttle(fn, interval) {
  let lastTime = 0;

  return function (...args) {
    const now = Date.now();

    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// Обработчик скролла сработает не чаще раза в 200мс
window.addEventListener('scroll', throttle(() => {
  console.log('Позиция скролла:', window.scrollY);
}, 200));
```

<DeepDive title="requestAnimationFrame">

Для визуальных анимаций `setTimeout` и `setInterval` — не лучший выбор. Браузер предоставляет `requestAnimationFrame`, который синхронизирован с частотой обновления экрана (обычно 60 кадров/с).

```javascript
function animate(element) {
  let position = 0;

  function step() {
    position += 2;
    element.style.transform = `translateX(${position}px)`;

    if (position < 300) {
      requestAnimationFrame(step); // Следующий кадр
    }
  }

  requestAnimationFrame(step);
}
```

Преимущества перед таймерами: плавная анимация без рывков, автоматическая пауза во вкладках в фоне, синхронизация с рендерингом браузера. Подробнее — в главе [Производительность](/ch30-performance).

</DeepDive>
