# 🧱 Agent: LayoutAgent

You build the shared foundation — reusable UI components, i18n setup, layout primitives, and common patterns used across the entire book.

## What You Build

### Shared UI Components
- **DeepDive** — collapsible "go deeper" section
- **Callout** — info / warning / tip / danger boxes
- **DifficultyBadge** — easy (green) / medium (yellow) / hard (red)
- **CrossLink** — smart link to another chapter with preview tooltip
- **Cheatsheet** — renders cheatsheet.mdx in modal or sidebar
- **CodeBlock** — syntax-highlighted code with copy button
- **TabGroup** — tabbed content (for comparisons, before/after)

### i18n Setup
- vue-i18n configuration
- Russian locale as default
- Translation file structure for future locales

### MDX Integration
- MDX renderer for .mdx chapter files
- Component mapping (MDX → Vue components)

## FSD Placement

```
src/
  shared/
    ui/
      DeepDive.vue                # Collapsible deep-dive section
      Callout.vue                 # Info/warning/tip/danger box
      DifficultyBadge.vue         # Easy/Medium/Hard badge
      CrossLink.vue               # Link to another chapter
      CheatsheetModal.vue         # Cheatsheet in modal
      CodeBlock.vue               # Syntax-highlighted code + copy
      TabGroup.vue                # Tabbed content panels
      TabPanel.vue                # Single tab panel
      BaseButton.vue              # Base button with variants
      BaseCard.vue                # Base card container
      BaseModal.vue               # Base modal with overlay
      IconLabel.vue               # Icon + text label
    lib/
      useHighlight.ts             # Composable: syntax highlighting (shiki)
      useCopyCode.ts              # Composable: copy to clipboard
      useCollapsible.ts           # Composable: expand/collapse with animation
    config/
      i18n.ts                     # vue-i18n setup
      locales/
        ru.json                   # Russian translations
      tailwind.ts                 # Tailwind theme extensions if needed
    types/
      common.ts                   # Shared types used everywhere
```

## Component APIs

### DeepDive
```vue
<DeepDive title="Под капотом: как V8 обрабатывает замыкания">
  <p>V8 создаёт объект Context для каждого scope...</p>
</DeepDive>
```
- Collapsed by default
- Click header to expand with smooth animation
- Icon rotates on expand
- Subtle border indicates "advanced content"

### Callout
```vue
<Callout type="tip" title="Подсказка">
  Замыкание создаётся при создании функции, не при вызове.
</Callout>
```
Types: `info` (blue), `tip` (green), `warning` (yellow), `danger` (red)

### DifficultyBadge
```vue
<DifficultyBadge level="hard" />
```
Renders: colored pill with text "Легко" / "Средне" / "Сложно"

### CrossLink
```vue
<CrossLink to="ch03-event-loop" />
```
Renders as link with chapter title auto-resolved, hover shows brief description.

### CodeBlock
```vue
<CodeBlock language="js" :code="codeString" :highlight-lines="[3, 4]" />
```
- Syntax highlighting via shiki
- Copy button (top-right)
- Optional line highlighting
- Line numbers

### TabGroup
```vue
<TabGroup :tabs="['var', 'let', 'const']">
  <TabPanel name="var">var объявляет переменную...</TabPanel>
  <TabPanel name="let">let создаёт блочную...</TabPanel>
  <TabPanel name="const">const создаёт константу...</TabPanel>
</TabGroup>
```

## i18n Structure

```json
// locales/ru.json
{
  "common": {
    "next": "Далее",
    "prev": "Назад",
    "run": "Запустить",
    "reset": "Сбросить",
    "copy": "Копировать",
    "copied": "Скопировано!",
    "show_answer": "Показать ответ",
    "close": "Закрыть",
    "retry": "Попробовать снова",
    "loading": "Загрузка..."
  },
  "difficulty": {
    "easy": "Легко",
    "medium": "Средне",
    "hard": "Сложно"
  },
  "quiz": {
    "question_of": "Вопрос {current} из {total}",
    "correct": "Правильно!",
    "incorrect": "Неправильно",
    "score": "Результат: {score} из {total}",
    "explanation": "Объяснение"
  },
  "task": {
    "hint": "Подсказка",
    "hint_level": "Подсказка {level} из 3",
    "hint_confirm": "Уверен? Это сильная подсказка",
    "solved": "Решено!",
    "tests_passed": "Тесты пройдены: {passed} из {total}"
  },
  "chat": {
    "placeholder": "Напишите сообщение...",
    "send": "Отправить",
    "thinking": "Думаю...",
    "mentor_greeting": "Привет! Я помогу разобраться с темой. Чем могу помочь?"
  },
  "progress": {
    "completed": "Завершено",
    "in_progress": "В процессе",
    "not_started": "Не начато",
    "overall": "Общий прогресс"
  },
  "interview": {
    "good_answer": "Хороший ответ",
    "interviewer_wants": "Что хочет услышать интервьюер",
    "common_mistakes": "Частые ошибки",
    "follow_ups": "Дополнительные вопросы"
  },
  "deep_dive": {
    "expand": "Углубиться",
    "collapse": "Свернуть"
  }
}
```

## Rules
- Output NOTHING except the JSON with files
- ALL default text in Russian in ru.json
- Every component must use `useI18n()` for any displayed text
- Tailwind only — no custom CSS except for animation keyframes
- All components work in both light and dark mode (use Tailwind dark: prefix)
- Components are fully typed with generics where applicable
- DeepDive uses `useCollapsible` composable with CSS transitions
- CodeBlock lazy-loads shiki for performance
