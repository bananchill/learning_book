import { Callout, DeepDive } from '@book/ui'

# Строки и Unicode

## Создание строк

```javascript
// Три способа — функционально одинаковы для простых случаев
const single = 'одинарные кавычки';
const double = "двойные кавычки";
const template = `шаблонный литерал`;

// Типичное соглашение: одинарные для обычных строк,
// шаблонные — когда нужна интерполяция или многострочность
```

## Неизменяемость

```javascript
const name = 'JavaScript';

// Нельзя изменить символ по индексу
name[0] = 'j'; // игнорируется (TypeError в strict mode)
console.log(name); // 'JavaScript'

// Все методы возвращают новую строку
const lower = name.toLowerCase(); // 'javascript'
console.log(name); // 'JavaScript' — исходная не изменилась
```

## Длина и доступ к символам

```javascript
const str = 'Привет';

str.length;   // 6 — количество символов

// Доступ по индексу (только чтение)
str[0];       // 'П'
str.at(0);    // 'П' — метод at()
str.at(-1);   // 'т' — отрицательные индексы (новый синтаксис)
str.charAt(2); // 'и' — устаревший способ

// Итерация
for (const char of str) {
  console.log(char); // П, р, и, в, е, т
}
```

## Экранирование

```javascript
const str1 = 'It\'s a test';   // экранирование одинарной кавычки
const str2 = "Say \"hello\"";  // экранирование двойной кавычки
const str3 = 'line1\nline2';   // перенос строки
const str4 = 'tab\there';      // табуляция
const str5 = 'back\\slash';    // обратный слеш
const unicode = '\u0041';      // 'A' — Unicode escape
```

## Конкатенация

```javascript
const first = 'Иван';
const last = 'Петров';

// Оператор + (классический)
const full1 = first + ' ' + last; // 'Иван Петров'

// Шаблонный литерал (предпочтительно)
const full2 = `${first} ${last}`; // 'Иван Петров'

// Метод concat (устарел, не рекомендуется)
const full3 = first.concat(' ', last);
```

<Callout type="warning">
Не используйте `+` для конкатенации в циклах — создаёт много временных строк. Для накопления используйте массив и `join('')`.
</Callout>

<DeepDive title="Строки и Unicode: суррогатные пары">

JavaScript хранит строки в UTF-16. Большинство символов занимают одну «кодовую единицу» (2 байта). Но символы вне BMP (Basic Multilingual Plane) — некоторые эмодзи, редкие иероглифы — занимают две: это суррогатные пары.

```javascript
const emoji = '😀';
emoji.length;    // 2 — не 1! Два суррогата
emoji[0];        // '?' — половина суррогатной пары, не символ
[...emoji];      // ['😀'] — spread корректно обрабатывает суррогаты
[...emoji].length; // 1 — правильный подсчёт
```

Методы `for...of` и spread используют Unicode code points и корректно работают с суррогатными парами.

</DeepDive>
