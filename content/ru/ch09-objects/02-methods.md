import { Callout, DeepDive } from '@book/ui'

# Методы Object

JavaScript предоставляет богатый набор статических методов для работы с объектами.

## Object.keys / values / entries

Три метода позволяют извлечь из объекта его содержимое в виде массива: `Object.keys` возвращает массив ключей, `Object.values` — массив значений, а `Object.entries` — массив пар `[ключ, значение]`. Все три метода работают только с собственными перечисляемыми свойствами, игнорируя унаследованные. Метод `entries` особенно удобен в связке с `for...of` и деструктуризацией для итерации по объекту.

```javascript
const user = { name: 'Иван', age: 25, role: 'admin' };

Object.keys(user)    // ['name', 'age', 'role']
Object.values(user)  // ['Иван', 25, 'admin']
Object.entries(user) // [['name', 'Иван'], ['age', 25], ['role', 'admin']]
```

Применение:

```javascript
// Итерация по объекту
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

// Трансформация значений
const doubled = Object.fromEntries(
  Object.entries({ a: 1, b: 2, c: 3 }).map(([k, v]) => [k, v * 2])
); // { a: 2, b: 4, c: 6 }
```

## Object.assign — копирование свойств

```javascript
const defaults = { theme: 'light', lang: 'en' };
const userPrefs = { lang: 'ru' };

// Объединить объекты (мутирует первый аргумент!)
const merged = Object.assign({}, defaults, userPrefs);
// { theme: 'light', lang: 'ru' }

// Современная альтернатива — spread (не мутирует)
const merged2 = { ...defaults, ...userPrefs };
```

<Callout type="warning">
`Object.assign` мутирует первый аргумент. Всегда передавайте `{}` как первый аргумент если хотите новый объект.
</Callout>

## Object.fromEntries — из массива пар

```javascript
// Из Map
const map = new Map([['a', 1], ['b', 2]]);
Object.fromEntries(map); // { a: 1, b: 2 }

// Трансформация объекта
const prices = { apple: 50, banana: 30, cherry: 100 };
const discounted = Object.fromEntries(
  Object.entries(prices).map(([key, val]) => [key, val * 0.9])
); // { apple: 45, banana: 27, cherry: 90 }
```

## Object.freeze / Object.seal

```javascript
// freeze — полностью замораживает объект
const config = Object.freeze({ host: 'localhost', port: 3000 });
config.port = 8080;     // Не выбросит ошибку, но и не изменится (в strict — TypeError)
config.newProp = 'x';   // Игнорируется
console.log(config.port); // 3000

// seal — запрещает добавление/удаление свойств, но позволяет менять существующие
const obj = Object.seal({ a: 1, b: 2 });
obj.a = 99;    // OK
obj.c = 3;     // Игнорируется
delete obj.a;  // Игнорируется
```

## Object.keys только для собственных свойств

```javascript
const parent = { inherited: 'yes' };
const child = Object.create(parent);
child.own = 'yes';

Object.keys(child)        // ['own'] — только собственные
for (const key in child)  // 'own', 'inherited' — включая унаследованные
```

<DeepDive title="Порядок ключей в объекте">

ECMAScript гарантирует порядок ключей в Object.keys/values/entries:
1. Сначала целочисленные ключи (как индексы массива) в числовом порядке
2. Затем строковые ключи в порядке добавления
3. Затем Symbol-ключи в порядке добавления

Но не полагайтесь на порядок ключей для логики — используйте массивы если порядок важен.

</DeepDive>
