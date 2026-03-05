# 🎓 Research Agents

Claude-оркестратор управляет командой из 5 специализированных суб-агентов для автоматического исследования любой темы.

## Как это работает

```
Ты даёшь тему
     │
     ▼
🧭 Планировщик ──→ план: подвопросы + поисковые запросы
     │                          ↓ ты одобряешь
     ▼
🔍 Поисковик ────→ 8-15 источников (arXiv, блоги, веб)
     │                          ↓ ты одобряешь
     ▼
📖 Читатель ─────→ ключевые тезисы из каждого источника
     │                          ↓ ты одобряешь
     ▼
🔬 Аналитик ─────→ сравнение, противоречия, инсайты
     │                          ↓ ты одобряешь
     ▼
✍️ Автор ─────────→ Markdown-отчёт (1000+ слов)
```

Каждый агент — это **отдельный вызов Claude API** со своим системным промптом (`.md` файл). Оркестратор передаёт данные по цепочке.

## Быстрый старт

```bash
# 1. Установка
pip install anthropic

# 2. API ключ
export ANTHROPIC_API_KEY="sk-ant-..."

# 3. Запуск
python main.py "Как работает RLHF в больших языковых моделях"
```

## CLI

```bash
# Простой запуск
python main.py "тема"

# С пользовательскими источниками
python main.py --source url https://arxiv.org/abs/2203.02155 "RLHF"
python main.py --source youtube https://youtu.be/abc "RLHF"

# Несколько источников
python main.py \
  -s url https://example.com/article \
  -s youtube https://youtu.be/abc \
  "тема исследования"

# Интерактивный режим
python main.py -i

# Другая модель
python main.py -m claude-opus-4-20250514 "тема"
```

## Структура проекта

```
research-agents/
├── main.py                     # CLI точка входа
├── requirements.txt
│
├── agents/                     # .md промпты агентов
│   ├── orchestrator.md         # Мета-промпт оркестратора
│   ├── planner.md              # 🧭 Планировщик
│   ├── searcher.md             # 🔍 Поисковик
│   ├── reader.md               # 📖 Читатель
│   ├── analyzer.md             # 🔬 Аналитик
│   └── writer.md               # ✍️ Автор отчёта
│
├── orchestrator/               # Python-оркестратор
│   ├── core.py                 # Вызов агентов через API
│   ├── pipeline.py             # Пошаговая цепочка
│   └── display.py              # Красивый вывод в терминале
│
└── config/
    └── settings.py             # Настройки
```

## Как добавить / изменить агента

Каждый агент — это `.md` файл в `agents/`. Чтобы изменить поведение агента, просто отредактируй его промпт.

Чтобы добавить нового агента:

1. Создай `agents/my_agent.md` с системным промптом
2. Добавь в `config/settings.py`:
   ```python
   AGENT_FILES["my_agent"] = AGENTS_DIR / "my_agent.md"
   AGENT_TOOLS["my_agent"] = []  # или нужные инструменты
   ```
3. Вызывай из оркестратора:
   ```python
   result = call_agent_json("my_agent", "сообщение")
   ```

## Результат

После завершения сохраняются два файла:
- `report_<тема>_<время>.md` — Markdown-отчёт
- `report_<тема>_<время>.log.json` — лог работы агентов

## Настройки

Переменные окружения:
- `ANTHROPIC_API_KEY` — API ключ (обязательно)
- `RESEARCH_MODEL` — модель Claude (по умолчанию `claude-sonnet-4-20250514`)
