import { Callout, DeepDive } from '@book/ui'

# typeof и приведение типов

Динамическая типизация JavaScript означает, что одна и та же переменная может быть числом сейчас и строкой завтра. `typeof` позволяет узнать тип значения, а приведение типов — явно или неявно преобразовать значение.

## typeof

```javascript
typeof 42          // 'number'
typeof 'hello'     // 'string'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof null        // 'object'  ← исторический баг!
typeof {}          // 'object'
typeof []          // 'object'  ← массив — тоже объект
typeof function(){} // 'function'
typeof Symbol()    // 'symbol'
typeof 42n         // 'bigint'
```

## Truthy и Falsy

В JavaScript любое значение может использоваться в булевом контексте (в `if`, `while` и т.д.). Всего 6 falsy-значений:

| Значение | Тип |
|---|---|
| `false` | boolean |
| `0`, `-0`, `0n` | number / bigint |
| `''`, `""`, ` `` ` | string |
| `null` | null |
| `undefined` | undefined |
| `NaN` | number |

**Всё остальное — truthy**, включая `[]`, `{}`, `'false'`, `'0'`.

```javascript
if ([]) console.log('пустой массив truthy!');    // выводится
if ({}) console.log('пустой объект truthy!');    // выводится
if ('false') console.log('строка truthy!');      // выводится
```

## == vs ===

`===` (строгое равенство) — сравнивает и значение, и тип:

```javascript
5 === '5'    // false — разные типы
5 === 5      // true
null === undefined  // false
```

`==` (нестрогое равенство) — приводит типы перед сравнением:

```javascript
5 == '5'     // true — строка преобразуется в число
0 == false   // true — false преобразуется в 0
0 == ''      // true — '' преобразуется в 0
null == undefined // true — специальное правило
null == 0    // false — null только == undefined/null
```

<Callout type="warning">
Используйте `===` по умолчанию. Единственное исключение: проверка `value == null` одновременно проверяет на `null` и `undefined`.
</Callout>

## Явное приведение типов

```javascript
// К числу
Number('42')      // 42
Number('3.14')    // 3.14
Number('')        // 0
Number('abc')     // NaN
Number(true)      // 1
Number(false)     // 0
Number(null)      // 0
Number(undefined) // NaN

parseInt('42px', 10)   // 42 — парсит до нечислового символа
parseFloat('3.14abc')  // 3.14

// К строке
String(42)        // '42'
String(true)      // 'true'
String(null)      // 'null'
(42).toString()   // '42'

// К булеву
Boolean(0)        // false
Boolean('')       // false
Boolean('hello')  // true
Boolean([])       // true
```

## Неявное приведение

```javascript
// + с строкой = конкатенация
'5' + 3    // '53' — число приводится к строке
3 + '5'    // '35'

// Арифметические операторы кроме + = приводят к числу
'5' - 3    // 2
'5' * '2'  // 10
'5' / 2    // 2.5

// Унарный + приводит к числу
+'42'      // 42
+true      // 1
+''        // 0
```

<DeepDive title="Таблица приведения для ==">

Правила `==` из спецификации ECMAScript:
1. Если типы одинаковы — используется `===`
2. `null == undefined` → `true`
3. Если один — number, другой — string: string приводится к number
4. Если один — boolean: boolean приводится к number (true→1, false→0)
5. Если один — object: вызывается `.valueOf()` или `.toString()`

Именно поэтому `[] == false`: `[]` → `''` → `0`, `false` → `0`, и `0 == 0`.

</DeepDive>
