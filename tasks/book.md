# Book Code Review — Задачи на исправление

Дата ревью: 2026-03-11
Обновлено: 2026-03-11

---

## P0 — Критические (блокирующие)

### 1. Нет тестов для UI-компонентов
- [x] Создать `.test.ts` для каждого из 14 компонентов (vitest + @vue/test-utils)
- **Результат:** 115 тестов, 14 файлов — все проходят

### 2. Нет тестов для core-фич
- [x] Добавить тесты для 7 модулей: sandbox, chat, quiz, tasks, walkthrough, interview, progress
- **Результат:** 174 теста, 7 файлов — все проходят

### 3. Нет тестовой инфраструктуры
- [x] Добавить `vitest.workspace.ts` в корень
- [x] Добавить `vitest.config.ts` в packages/ui и packages/core
- [x] Добавить `"test"` скрипт во все packages/*/package.json
- [x] Установить `@testing-library/vue`, `@vitejs/plugin-vue`, `jsdom`, `@testing-library/jest-dom`

---

## P1 — Высокий приоритет

### 4. Захардкоженные русские строки (нарушение i18n)
- [x] HomePage.vue: `"глав"`, `"задач"`, `"квизов"` → `t('home.hero.stats.*')`
- [x] AppSidebar.vue: `"GitHub"` → `t('nav.github')`
- [x] QuestionCard.vue: `"Верно"` / `"Неверно"` → `t('quiz.true_label')` / `t('quiz.false_label')`
- [x] ProgressStats.vue: 4 строки → `t('progress.*')`
- [x] TaskCard.vue: `"~N мин"` → `t('task.estimated_minutes', { n })`
- [x] CodeReviewView.vue: 3 строки → `t('code_review.found_line')` / `missed_line` / `false_positive`
- [x] EventLoopSimulator.vue: 11 строк → `t('event_loop.*')`

### 5. Добавить недостающие i18n-ключи в ru.json
- [x] `quiz.true_label`, `quiz.false_label`
- [x] `progress.chapters_started`, `progress.tasks_completed`, `progress.quizzes_passed`, `progress.streak_days`
- [x] `task.estimated_minutes`
- [x] `code_review.found_line`, `code_review.missed_line`, `code_review.false_positive`
- [x] `nav.github`
- [x] `event_loop.*` (11 ключей)

### 6. Захардкоженные данные в HomePage
- [x] Статистика (39/120+/60+) теперь через i18n-ключи `home.hero.stats.*`

### 7. Захардкоженный GitHub URL
- [x] Вынесен в `import.meta.env.VITE_GITHUB_URL` с фоллбэком
- [x] Добавлен в `.env.example`

---

## P2 — Средний приоритет

### 8. Дубликаты vite-конфигов
- [x] Удалён `apps/book/vite.config.js`
- [x] Удалён `apps/admin/vite.config.js`
- [x] Удалён `apps/admin/vite.config.d.ts`

### 9. Нет lint-инфраструктуры
- [x] Создан `eslint.config.js` (flat config с vue + typescript-eslint)
- [x] Установлены `@eslint/js`, `typescript-eslint`, `eslint-plugin-vue`, `vue-eslint-parser`
- [x] Добавлен `"lint"` скрипт во все 7 пакетов/приложений

### 10. Нет tailwind.config
- **Примечание:** Tailwind v4 с `@tailwindcss/vite` не требует `tailwind.config.ts` — вместо него используется `@theme` в `tokens.css`, что уже корректно настроено
- [x] Не нужен — Tailwind v4 автоматически сканирует файлы через Vite-плагин

### 11. Отсутствуют визуализации в ch03 и ch04
- [ ] Создать визуализации для ch03-parallelism
- [ ] Создать визуализации для ch04-v8-engine
- **Примечание:** Требует запуск Visualizer-агента из content pipeline

### 12. Неполный .env.example
- [x] Добавлены: `ANTHROPIC_API_KEY`, `RESEARCH_MODEL`, `VITE_GITHUB_URL`

### 13. Роутер не учитывает group в URL-структуре
- [x] Задокументировано комментарием в router.ts: group опущен для краткости URL, chapter.id уникален внутри subsection

---

## P3 — Низкий приоритет

### 14. Нет playground.vue в главах
- [ ] Создать playground.vue для каждой главы
- **Примечание:** Требует запуск content pipeline агентов

### 15. API не экспортирует типы запросов/ответов
- [ ] Добавить типы API-контрактов в `@book/shared`

### 16. Несогласованность tsconfig path aliases
- [ ] Унифицировать стратегию path aliases между apps/

### 17. CSS-переменные вместо Tailwind-токенов
- [x] Заменены ВСЕ `bg-[var(--color-*)]` → `bg-*` во всех файлах apps/book и apps/admin
- [x] 70+ замен в apps/admin, 40+ в apps/book

---

## Итоги

| Категория | Было | Стало |
|-----------|------|-------|
| Тесты UI | 0/14 | **14/14** (115 тестов) |
| Тесты Core | 0/7 | **7/7** (174 теста) |
| i18n хардкод | ~20 строк | **0 строк** |
| ESLint | отсутствовал | **настроен** |
| Vite дубликаты | 3 файла | **удалены** |
| CSS var() хардкод | ~110 мест | **0 мест** |
| .env.example | пустой | **заполнен** |

**Осталось (требует content/agent pipeline):**
- Визуализации для ch03, ch04 (P2 #11)
- playground.vue для 4 глав (P3 #14)
- API типы контрактов (P3 #15)
- Унификация tsconfig aliases (P3 #16)
