import { Callout } from '@book/ui'

# Шпаргалка: Объекты

## Создание и доступ

```javascript
// Литерал
const obj = { key: 'value', 'with-dash': 1 };

// Вычисляемые ключи
const key = 'name';
const obj2 = { [key]: 'Иван', [`${key}Upper`]: 'ИВАН' };

// Доступ
obj.key;           // точечная нотация
obj['with-dash'];  // скобочная нотация (обязательна для нестандартных ключей)

// Проверка свойства
Object.hasOwn(obj, 'key'); // true — предпочтительный способ
'key' in obj;              // true — включая прототип
```

## Перечисление свойств

```javascript
Object.keys(obj)    // → ['key', ...]     — только ключи
Object.values(obj)  // → ['value', ...]   — только значения
Object.entries(obj) // → [['key','value']] — пары [ключ, значение]

// Реконструкция из entries
const newObj = Object.fromEntries(entries);
```

## Деструктуризация

```javascript
const { a, b } = obj;                    // базовая
const { a: alias, c = 'default' } = obj; // переименование + дефолт
const { nested: { x } } = obj;           // вложенная
const { a, ...rest } = obj;              // rest

// В параметрах функции
function fn({ name, role = 'user' }) {}
```

## Копирование и слияние

```javascript
const copy  = { ...obj };                    // поверхностная копия
const merged = { ...obj1, ...obj2 };          // слияние (obj2 перезаписывает)
Object.assign(target, src1, src2);            // то же, изменяет target

const deep = structuredClone(obj);            // глубокая копия
```

## Утилиты

```javascript
Object.freeze(obj);   // запрет изменений (поверхностно)
Object.seal(obj);     // запрет добавления/удаления свойств, изменение разрешено
Object.isFrozen(obj); // проверка заморозки
```

## Ссылки

```javascript
const a = { x: 1 };
const b = a;       // b — та же ссылка
a === b;           // true

const c = { x: 1 };
a === c;           // false — разные объекты

// Глубокое сравнение — только вручную или через библиотеку
JSON.stringify(a) === JSON.stringify(c); // true (с ограничениями)
```

## Быстрые паттерны

```javascript
// pick — взять подмножество ключей
const pick = (obj, keys) =>
  Object.fromEntries(keys.map(k => [k, obj[k]]));

// omit — убрать ключи
const omit = (obj, keys) => {
  const set = new Set(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !set.has(k))
  );
};

// Инвертировать объект
const invert = obj =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
```

<Callout type="info">
`structuredClone` — современный стандартный способ глубокого копирования. Поддерживается в Node 17+ и всех современных браузерах.
</Callout>
