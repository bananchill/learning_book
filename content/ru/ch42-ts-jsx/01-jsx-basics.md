import { Callout, DeepDive } from '@book/ui'

# Основы JSX в TypeScript

<Callout type="info">
Примеры в этой главе используют React — самую популярную JSX-библиотеку. JSX также поддерживается в Vue, Solid, Preact и других фреймворках. Знание React не требуется для понимания типизации JSX.
</Callout>

## Что такое JSX

JSX (JavaScript XML) -- синтаксическое расширение, позволяющее описывать структуру UI прямо в коде:

```tsx
// JSX-выражение — это не строка и не HTML
const element = <h1>Привет, мир!</h1>
```

TypeScript понимает JSX и добавляет к нему статическую проверку типов: какие атрибуты допустимы, какие children принимает элемент, что возвращает компонент.

## Файлы .tsx

Чтобы использовать JSX в TypeScript, файл должен иметь расширение `.tsx`:

```
src/
  utils.ts       // обычный TypeScript — JSX недоступен
  App.tsx         // TypeScript + JSX
  Button.tsx      // TypeScript + JSX
```

<Callout type="warning">
В файлах `.ts` синтаксис JSX вызовет ошибку компиляции. JSX разрешён только в `.tsx`.
</Callout>

## Опция компилятора jsx

В `tsconfig.json` параметр `jsx` определяет, как TypeScript обрабатывает JSX-выражения. Есть пять режимов:

| Режим | Выход | Расширение | Описание |
|-------|-------|------------|----------|
| `preserve` | JSX сохраняется | `.jsx` | Для дальнейшей обработки Babel/SWC |
| `react` | `React.createElement(...)` | `.js` | Классический React до v17 |
| `react-jsx` | `_jsx(...)` | `.js` | Новый JSX-трансформ React 17+ |
| `react-jsxdev` | `_jsxDEV(...)` | `.js` | То же + отладочная информация |
| `react-native` | JSX сохраняется | `.js` | Для React Native бандлера |

```json
// tsconfig.json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

### preserve

TypeScript оставляет JSX как есть. Другой инструмент (Babel, esbuild, SWC) выполнит трансформацию:

```tsx
// Вход (preserve)
const el = <div className="box">Текст</div>

// Выход — JSX сохранён
const el = <div className="box">Текст</div>
```

### react

Классический режим — JSX превращается в вызовы `React.createElement`:

```tsx
// Вход (react)
const el = <div className="box">Текст</div>

// Выход
const el = React.createElement("div", { className: "box" }, "Текст")
```

<Callout type="info">
В режиме `react` необходим `import React from 'react'` в каждом файле с JSX, иначе `React` будет не определён в рантайме.
</Callout>

### react-jsx

Новый JSX-трансформ (React 17+). Не требует импорта React:

```tsx
// Вход (react-jsx)
const el = <div className="box">Текст</div>

// Выход — автоматический импорт
import { jsx as _jsx } from "react/jsx-runtime"
const el = _jsx("div", { className: "box", children: "Текст" })
```

## Оператор as вместо angle-bracket

В обычных `.ts` файлах приведение типов можно записать двумя способами:

```typescript
// Angle-bracket синтаксис (только в .ts)
const input = <HTMLInputElement>document.getElementById('name')

// as-синтаксис (работает и в .ts, и в .tsx)
const input = document.getElementById('name') as HTMLInputElement
```

В `.tsx` файлах angle-bracket синтаксис `<Type>value` **запрещён**, потому что он конфликтует с JSX-тегами:

```tsx
// Ошибка! TypeScript думает, что <string> — это JSX-элемент
const name = <string>someValue  // ❌

// Правильно — используйте as
const name = someValue as string  // ✅
```

<Callout type="tip">
Рекомендация: используйте `as` везде, даже в `.ts` файлах. Так код будет единообразным и легко переносимым в `.tsx`.
</Callout>

## Пример полного tsconfig.json для JSX

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "jsxImportSource": "react",
    "strict": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```

<DeepDive title="Как TypeScript парсит JSX">

Когда TypeScript встречает `<` в `.tsx` файле, он должен понять: это начало JSX-выражения или оператор «меньше»? Решение принимается по контексту:

```tsx
// JSX — после = или return ожидается выражение
const el = <div />

// Сравнение — после переменной ожидается оператор
const isSmaller = a < b

// Дженерик в стрелочной функции — конфликт!
// const identity = <T>(x: T): T => x  // ❌ Ошибка

// Решение: добавить extends или запятую
const identity = <T,>(x: T): T => x        // ✅ trailing comma
const identity = <T extends unknown>(x: T): T => x  // ✅ extends
```

Это ограничение касается только стрелочных функций с одним параметром типа. Обычные `function`-объявления с дженериками работают без проблем в `.tsx`.

</DeepDive>

## Итоги

- JSX в TypeScript работает через файлы `.tsx` и опцию `jsx` в `tsconfig.json`.
- Режим `react-jsx` (React 17+) — рекомендуемый: не требует ручного импорта React.
- В `.tsx` файлах вместо `<Type>value` используйте `value as Type`.
- Стрелочные дженерик-функции в `.tsx` требуют trailing comma или `extends`.
