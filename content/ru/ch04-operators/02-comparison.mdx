import { Callout, DeepDive } from '@book/ui'

# Операторы сравнения

## Строгое сравнение ===

`===` сравнивает тип И значение — ничего не приводит:

```javascript
1 === 1       // true
1 === '1'     // false — разные типы
null === null // true
NaN === NaN   // false — NaN не равен ничему, включая себя!
```

## Нестрогое сравнение ==

`==` приводит типы перед сравнением. Результат часто неожиданный:

```javascript
1 == '1'      // true
0 == false    // true
0 == ''       // true
null == undefined // true — единственная пара
[] == false   // true ([] → '' → 0, false → 0)
'' == false   // true
```

<Callout type="warning">
Используйте `===` и `!==` по умолчанию. Исключение: `value == null` — удобная проверка на null ИЛИ undefined.
</Callout>

## Операторы отношения

```javascript
5 > 3    // true
5 < 3    // false
5 >= 5   // true
5 <= 4   // false

// Строки сравниваются лексикографически (по Unicode)
'abc' < 'abd'  // true — 'c' < 'd'
'B' < 'a'      // true — 'B' (66) < 'a' (97)
'10' < '9'     // true — строковое сравнение! '1' < '9'

// Смешанные типы — строка приводится к числу
'10' < 9      // false — 10 > 9
```

## Сравнение с null и undefined

```javascript
null > 0   // false
null == 0  // false
null >= 0  // true  ← неожиданно!

// Причина: >= приводит null к 0, но == использует особое правило
// null == только null или undefined

undefined > 0   // false
undefined < 0   // false
undefined == 0  // false — undefined только == null
```

<Callout type="info">
Избегайте сравнений `>`, `<`, `>=`, `<=` с `null` и `undefined`. Поведение нелогично и часто приводит к багам.
</Callout>

<DeepDive title="Как работает == под капотом">

Алгоритм Abstract Equality Comparison из ECMAScript:
1. Если типы одинаковые — используется ===
2. `null == undefined` → true
3. `undefined == null` → true
4. Если один number, другой string → string приводится к number
5. Если один boolean → boolean приводится к number
6. Если один object, другой primitive → вызывается ToPrimitive(object)

Именно поэтому `[] == false`:
- `[]` → `''` (ToPrimitive)
- `false` → `0`
- `''` → `0`
- `0 === 0` → true

</DeepDive>
