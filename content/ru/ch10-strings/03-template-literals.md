import { Callout, DeepDive } from '@book/ui'

# Шаблонные литералы

Шаблонные литералы (template literals) — обратные кавычки \` \`. Они поддерживают интерполяцию и многострочность.

## Интерполяция

```javascript
const name = 'Иван';
const age = 25;

// Классическая конкатенация
const old = 'Привет, ' + name + '! Тебе ' + age + ' лет.';

// Шаблонный литерал
const modern = `Привет, ${name}! Тебе ${age} лет.`;

// Внутри ${} — любое JS-выражение
const price = 1990;
console.log(`Цена: ${price} ₽ (${(price * 1.2).toFixed(2)} с НДС)`);

// Условие внутри
const role = 'admin';
console.log(`Доступ: ${role === 'admin' ? 'полный' : 'ограниченный'}`);
```

## Многострочность

```javascript
// Классические строки требуют \n
const old = 'Строка 1\nСтрока 2\nСтрока 3';

// Шаблонный литерал — реальные переносы
const html = `
  <div class="card">
    <h2>${title}</h2>
    <p>${description}</p>
  </div>
`;
// Внимание: первая строка будет содержать перенос после `
```

<Callout type="info">
Чтобы избежать лишнего пробела в начале, можно начинать контент сразу после обратной кавычки или использовать `.trim()`.
</Callout>

## Вложенные шаблоны

```javascript
const items = ['Яблоко', 'Банан', 'Вишня'];

// Вложенный шаблон внутри ${...}
const list = `Список:
${items.map((item, i) => `  ${i + 1}. ${item}`).join('\n')}`;

// Условный вывод блока
const isAdmin = true;
const menu = `
  <nav>
    <a href="/">Главная</a>
    ${isAdmin ? '<a href="/admin">Админка</a>' : ''}
  </nav>
`;
```

## Теговые шаблоны (Tagged templates)

Позволяют обрабатывать шаблонный литерал функцией:

```javascript
// Тег — это функция
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined
      ? `<mark>${values[i]}</mark>`
      : '';
    return result + str + value;
  }, '');
}

const name = 'JavaScript';
const year = 1995;
const html = highlight`Язык ${name} появился в ${year} году.`;
// 'Язык <mark>JavaScript</mark> появился в <mark>1995</mark> году.'
```

### Практический пример: безопасный SQL

```javascript
// Защита от SQL-инъекций
function sql(strings, ...values) {
  const escaped = values.map(v =>
    typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
  );
  return strings.reduce((q, str, i) =>
    q + str + (escaped[i] ?? ''), ''
  );
}

const userId = "1; DROP TABLE users;--"; // попытка SQL-инъекции
const query = sql`SELECT * FROM users WHERE id = ${userId}`;
// "SELECT * FROM users WHERE id = '1; DROP TABLE users;--'"
// Значение экранировано, инъекция невозможна
```

<DeepDive title="String.raw — сырые строки">

Встроенный тег `String.raw` возвращает строку без обработки escape-последовательностей:

```javascript
String.raw`Путь: C:\Users\name\n`
// 'Путь: C:\\Users\\name\\n' — \n не превратится в перенос строки

// Полезно для регулярных выражений и путей Windows
const pattern = String.raw`\d+\.\d+`; // вместо '\\d+\\.\\d+'
```

</DeepDive>
