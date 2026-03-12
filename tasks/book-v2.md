# Book Code Review v2 — Типы, компоненты, дупликаты, чистые функции

Дата: 2026-03-11

---

## T1 — Типы: недостающие поля и `any` касты

### T1.1 QuizQuestion — добавить недостающие поля
- **Где:** `packages/shared/src/types/quiz.ts`
- **Проблема:** Тип не содержит полей, которые реально используются в коде и данных
- `code?: string` — используется в `QuestionCard.vue:66` через `(question as any).code`
- `difficulty?: Difficulty` — есть во всех `quiz.json`, но нет в типе
- `options` — сейчас `options?: string[]`, но фактически обязательно для всех типов вопросов
- [x] Добавить `code?: string`
- [x] Добавить `difficulty?: Difficulty`
- [x] Сделать `options: string[]` обязательным (убрать `?`)

### T1.2 WalkthroughStep — добавить output
- **Где:** `packages/shared/src/types/walkthrough.ts`
- **Проблема:** `StateInspector.vue:48,51` использует `(step as any).output` — поле не в типе
- [x] Добавить `output?: string[]` в `WalkthroughStep`

### T1.3 Убрать `as any` касты
- **Где:**
  - `packages/core/src/quiz/ui/QuestionCard.vue:66` — `(question as any).code`
  - `packages/core/src/walkthrough/ui/StateInspector.vue:48,51` — `(step as any).output`
- [x] После T1.1 и T1.2 — заменить `as any` на прямой доступ к типизированным полям

### T1.4 Строже типизировать unknown
- **Где:** `packages/shared/src/types/sandbox.ts`
- `TestResult.expected/received` — сейчас `unknown`, должно быть `string | number | boolean | null | object`
- `ConsoleEntry.args` — сейчас `unknown[]`, аналогично
- [x] Заменить `unknown` на `SerializableValue` (`string | number | boolean | null | object`)

---

## T2 — Типы: централизация в @book/shared

### T2.1 Перенести типы из @book/core в @book/shared
- **QuizAnswer, QuizScore** — сейчас в `packages/core/src/quiz/lib/quizScoring.ts`
- **SelfAssessment** — сейчас в `packages/core/src/interview/model/useInterview.ts`
- **ChapterStatus** — сейчас в `packages/core/src/progress/model/progressCalc.ts`
- [x] Перенести все 4 типа в `packages/shared/src/types/`
- [x] Реэкспортировать из `packages/shared/src/index.ts`
- [x] Обновить импорты в core

### T2.2 Экспортировать опциональные типы из @book/core
- **UseTestRunnerOptions** — `packages/core/src/sandbox/model/useTestRunner.ts` — не экспортирован
- **UseAIChatOptions** — `packages/core/src/chat/model/useAIChat.ts` — не экспортирован
- [x] Добавить `export` и реэкспортировать из `packages/core/src/index.ts`

---

## T3 — Дубликаты кода: утилиты

### T3.1 Дублирование async fetch паттерна
- **Где:** 3 admin-стора используют идентичный try/catch/finally с isLoading/error
  - `apps/admin/src/features/admin-api/model/useBookConfigAdmin.ts`
  - `apps/admin/src/features/admin-api/model/useChaptersStore.ts` (2 раза)
  - `apps/admin/src/features/admin-api/model/useStatsStore.ts`
- [x] Создать `packages/shared/src/lib/useAsyncAction.ts` — generic composable
- [x] Рефакторнуть 3 стора

### T3.2 Дублирование расчёта процентов
- **Где:**
  - `packages/core/src/quiz/lib/quizScoring.ts:18` — `Math.round((correct / total) * 100)`
  - `packages/core/src/progress/model/progressCalc.ts:23,45` — то же самое
- [x] Создать `packages/shared/src/lib/percentage.ts` → `calcPercent(value, total): number`
- [x] Рефакторнуть quizScoring.ts и progressCalc.ts

### T3.3 Дублирование "добавить если нет" в массив
- **Где:** `packages/core/src/progress/model/useProgressStore.ts` — 3 раза (строки 37-40, 45-48, 59-62):
  ```
  if (!array.includes(item)) { array.push(item); ch.lastActivity = now }
  ```
- [x] Извлечь `addIfAbsent(array, item)` → `packages/shared/src/lib/array.ts`

### T3.4 Дублирование нормализации пути контента
- **Где:** 3 файла в `apps/book/src/features/content-loader/model/`:
  - `useChapterData.ts:37`
  - `useChapterContent.ts:40`
  - `useTaskCode.ts:64`
- [x] Извлечь `normalizeContentPath(path)` → `packages/shared/src/lib/contentPath.ts`

---

## T4 — Чистые функции: извлечение логики из компонентов

### T4.1 EventLoopSimulator — извлечь движок
- **Где:** `packages/ui/src/ui/EventLoopSimulator.vue` — 735 строк, из них ~300 строк чистой логики
- **Функции для извлечения:**
  - `tokenize(code): Token[]` (строки 34-111) — парсер JS-кода
  - `simulate(code): SimStep[]` (строки 113-222) — симуляция event loop
- [x] Создать `packages/ui/src/lib/eventLoopEngine.ts`
- [x] Перенести `tokenize()`, `simulate()`, типы `Token`, `SimStep`, `Phase`
- [x] Компонент оставить только UI (~420 строк)

### T4.2 quizScoring — уже чистые, но нет тестов для edge cases
- **Где:** `packages/core/src/quiz/lib/quizScoring.ts`
- `calculateScore(answers)` и `isAnswerCorrect(answer, correct)` — чистые функции
- [x] Добавить тесты на граничные случаи (0%, строковый correctAnswer, пустые массивы, число vs массив)

### T4.3 progressCalc — уже чистые, но можно рефакторнуть
- **Где:** `packages/core/src/progress/model/progressCalc.ts`
- `chapterCompletionPercent()`, `chapterStatus()`, `bookCompletionPercent()` — чистые
- [x] После T3.2 — рефакторнуть на общую `calcPercent()`

### T4.4 codeFormatter — чистая функция в sandbox
- **Где:** `packages/core/src/sandbox/lib/codeFormatter.ts`
- `formatCode(code): string` — чистая функция форматирования
- Статус: уже извлечена корректно ✅

### T4.5 buildSystemPrompt — чистая, но привязана к chat
- **Где:** `packages/core/src/chat/model/useChatContext.ts` (не chatApi.ts, как указано ранее)
- `buildSystemPrompt(context, task, code, testResults): string` — чистая функция
- Статус: корректно расположена и экспортирована из chat module ✅

---

## T5 — Компоненты: качество

### T5.1 Пропущенный i18n (оставшиеся захардкоженные строки)
- `packages/core/src/chat/ui/ChatToggle.vue:19` — `"💬"` / `"✕"` — нужен `aria-label`
- `packages/core/src/chat/ui/AIChatPanel.vue:79` — `"✕"` кнопка закрытия
- ~~`packages/core/src/sandbox/ui/CodeSandbox.vue:79` — `"✕"` кнопка закрытия~~ — не подтвердилось (нет хардкода ✕)
- [x] Добавить `aria-label` через `t('common.close')` — ключ уже есть в ru.json

### T5.2 Accessibility (a11y)
- `packages/core/src/chat/ui/ChatToggle.vue` — кнопка без `aria-label`
- `apps/book/src/widgets/sidebar/SidebarGroup.vue` — SVG без `aria-hidden="true"`
- `packages/core/src/sandbox/ui/CodeSandbox.vue` — SVG-иконки без `aria-hidden`
- ~~`packages/core/src/tasks/ui/TaskView.vue:49-58` — кнопки без aria-label~~ — не подтвердилось (нет кнопок в этих строках)
- [x] Добавить `aria-label` на все интерактивные элементы без текста
- [x] Добавить `aria-hidden="true"` на декоративные SVG (включая SidebarSection, SidebarSubsection)

### T5.3 Wrapper-компоненты без v-bind="$attrs"
- `packages/ui/src/ui/BaseCard.vue`
- `packages/ui/src/ui/BaseButton.vue`
- `packages/core/src/interview/ui/InterviewCard.vue`
- [x] Добавить `v-bind="$attrs"` на корневой элемент

### T5.4 Prop drilling в Sidebar → provide/inject
- **Где:** Цепочка `SidebarSection → SidebarSubsection → SidebarGroup → SidebarChapter`
- Передаются `sectionId`, `subsectionId`, `isActive`, `activeChapterId` через 4 уровня
- [x] Создать `useSidebarContext()` composable с `provide/inject`

### T5.5 Компоненты без обработки ошибок
- ~~`packages/core/src/progress/ui/ProgressTracker.vue` — нет fallback при пустых данных~~ — не подтвердилось (уже есть v-if/v-else)
- `packages/core/src/interview/ui/InterviewPrep.vue` — нет обработки пустого массива вопросов
- `apps/admin/src/pages/dashboard/DashboardPage.vue` — нет отображения ошибок из сторов
- [x] Добавить empty state в InterviewPrep + i18n ключ `interview.no_questions`
- [x] Добавить отображение ошибок в DashboardPage

### T5.6 EventLoopSimulator — inline styles → Tailwind
- **Где:** `packages/ui/src/ui/EventLoopSimulator.vue` — ~50 inline style атрибутов
- **Причина:** Компонент изолирован от `.book-prose` стилей через inline CSS
- [ ] Рассмотреть переход на Tailwind v4 `@layer` для изоляции вместо inline styles
- **Примечание:** Низкий приоритет, т.к. inline styles здесь осознанный выбор для изоляции

### T5.7 CodeBlock — v-html без комментария о безопасности
- **Где:** `packages/ui/src/ui/CodeBlock.vue:43` — `v-html="html"`
- HTML генерируется `useHighlight()` через shiki — безопасно, но нет комментария
- [x] Добавить комментарий `<!-- HTML сгенерирован shiki, XSS-безопасен -->`

---

## T6 — Оставшееся из v1

### T6.1 Визуализации ch03, ch04
- [ ] `content/ru/ch03-parallelism/visualizations/` — создать
- [ ] `content/ru/ch04-v8-engine/visualizations/` — создать

### T6.2 playground.vue для глав
- [ ] Создать `playground.vue` для ch01-ch04

### T6.3 API типы контрактов
- [ ] Добавить типы request/response в `@book/shared`
- [ ] Использовать в `apps/api/` и клиентах

### T6.4 Унификация tsconfig path aliases
- [ ] Стандартизировать `@/*` alias во всех apps/

---

## Сводка по приоритетам

| # | Задача | Приоритет | Сложность | Статус |
|---|--------|-----------|-----------|--------|
| T1.1 | QuizQuestion — code, difficulty, options | Высокий | Низкая | ✅ |
| T1.2 | WalkthroughStep — output | Высокий | Низкая | ✅ |
| T1.3 | Убрать `as any` | Высокий | Низкая | ✅ |
| T1.4 | Строже типизировать unknown | Средний | Низкая | ✅ |
| T2.1 | Централизация типов в shared | Средний | Средняя | ✅ |
| T2.2 | Экспорт опциональных типов из core | Низкий | Низкая | ✅ |
| T3.1 | useAsyncAction composable | Средний | Средняя | ✅ |
| T3.2 | calcPercent утилита | Средний | Низкая | ✅ |
| T3.3 | addIfAbsent утилита | Низкий | Низкая | ✅ |
| T3.4 | normalizeContentPath утилита | Низкий | Низкая | ✅ |
| T4.1 | Извлечь eventLoopEngine.ts | Средний | Средняя | ✅ |
| T4.2 | Тесты edge cases для quizScoring | Низкий | Низкая | ✅ |
| T4.3 | progressCalc → calcPercent | Низкий | Низкая | ✅ |
| T5.1 | Оставшийся i18n (aria-label) | Средний | Низкая | ✅ |
| T5.2 | Accessibility (a11y) | Средний | Средняя | ✅ |
| T5.3 | v-bind="$attrs" | Средний | Низкая | ✅ |
| T5.4 | Sidebar provide/inject | Средний | Средняя | ✅ |
| T5.5 | Error states | Средний | Средняя | ✅ |
| T5.6 | EventLoop inline styles | Низкий | Высокая | ⏳ |
| T5.7 | v-html комментарий | Низкий | Низкая | ✅ |
| T6.1-4 | Остатки из v1 | Низкий | Разная | ⏳ |
