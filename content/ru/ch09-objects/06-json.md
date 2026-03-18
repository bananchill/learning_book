import { Callout, DeepDive } from '@book/ui'

# JSON (JavaScript Object Notation)

JSON — текстовый формат обмена данными, основанный на синтаксисе JS-объектов. Используется повсюду: REST API, конфигурации, localStorage.

## Что такое JSON

JSON выглядит как JavaScript-объект, но с жёсткими правилами. Ключи — только в двойных кавычках, нет завершающих запятых, комментариев и функций.

```json
{
  "name": "Иван",
  "age": 25,
  "isStudent": true,
  "courses": ["JS", "React"],
  "address": { "city": "Москва" },
  "pet": null
}
```

Допустимые типы значений: строка, число, `true`, `false`, `null`, объект и массив.

## JSON.stringify

`JSON.stringify` превращает JavaScript-значение в JSON-строку. Свойства `undefined`, функции и `Symbol` молча отбрасываются.

```javascript
const user = {
  name: 'Иван',
  age: 25,
  greet() {},        // будет пропущено
  id: Symbol('id'),  // будет пропущено
  temp: undefined    // будет пропущено
};
JSON.stringify(user); // '{"name":"Иван","age":25}'
```

Второй аргумент `replacer` фильтрует свойства, третий `space` добавляет отступы для читаемости.

```javascript
const data = { name: 'Иван', age: 25, password: 'secret' };

// replacer-массив — выбираем нужные ключи
JSON.stringify(data, ['name', 'age']); // '{"name":"Иван","age":25}'

// replacer-функция — исключаем поле
JSON.stringify(data, (key, value) => {
  return key === 'password' ? undefined : value;
});

// space — форматированный вывод с отступами
JSON.stringify(data, null, 2);
```

## JSON.parse

`JSON.parse` разбирает JSON-строку и возвращает JavaScript-значение. При невалидном JSON выбрасывается `SyntaxError`.

```javascript
const user = JSON.parse('{"name":"Иван","age":25}');
console.log(user.name); // 'Иван'

// Невалидный JSON — SyntaxError
JSON.parse("{'name': 'Иван'}"); // одинарные кавычки
JSON.parse("{name: 'Иван'}");   // ключ без кавычек
```

Второй аргумент `reviver` трансформирует значения при разборе — например, восстанавливает `Date` из строк.

```javascript
const user = JSON.parse(
  '{"name":"Иван","createdAt":"2024-01-15T10:30:00.000Z"}',
  (key, value) => {
    // Восстанавливаем Date из ISO-строки
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
      return new Date(value);
    }
    return value;
  }
);
console.log(user.createdAt instanceof Date); // true
```

## Ограничения и подводные камни

JSON не может представить все JavaScript-типы. Вот ключевые случаи:

```javascript
// Циклические ссылки — TypeError
const obj = {};
obj.self = obj;
JSON.stringify(obj); // TypeError: Converting circular structure

// Date превращается в строку, а не остаётся объектом
JSON.stringify({ d: new Date() }); // '{"d":"2024-01-15T10:30:00.000Z"}'

// BigInt — TypeError
JSON.stringify({ n: 42n }); // TypeError

// NaN и Infinity становятся null
JSON.stringify({ a: NaN, b: Infinity }); // '{"a":null,"b":null}'
```

<Callout type="warning">
Паттерн `JSON.parse(JSON.stringify(obj))` для глубокого копирования ненадёжен: теряет `Date`, `undefined`, функции и падает на циклических ссылках. Используйте `structuredClone(obj)` — он поддерживает `Date`, `Map`, `Set` и циклические ссылки.
</Callout>

<DeepDive title="Метод toJSON — пользовательская сериализация">

Если объект имеет метод `toJSON`, `JSON.stringify` вызовет его вместо стандартной сериализации.

```javascript
const meeting = {
  title: 'Планёрка',
  date: new Date('2024-06-01'),
  participants: ['Иван', 'Мария'],
  toJSON() {
    return { title: this.title, date: this.date.toLocaleDateString('ru-RU') };
  }
};

JSON.stringify(meeting); // '{"title":"Планёрка","date":"01.06.2024"}'
```

Встроенный `Date` уже имеет `toJSON` — поэтому даты сериализуются в ISO-строку, а не в `{}`.

</DeepDive>
