// Код для ревью: Итерируемая коллекция с генератором
// Найдите и исправьте проблемы с типизацией, протоколом итерации и генераторами.

// Проблема 1: Неверное использование symbol вместо unique symbol
let PRIORITY = Symbol("priority");

interface Task {
  title: string;
  [PRIORITY]: number; // Ключ на основе символа
}

// Проблема 2: Неправильная реализация Iterable
class TaskQueue {
  private tasks: Task[] = [];

  add(task: Task): void {
    this.tasks.push(task);
  }

  // Итератор не возвращает правильный тип
  [Symbol.iterator]() {
    let index = 0;
    return {
      next() {
        if (index < this.tasks.length) {
          return { value: this.tasks[index++], done: false };
        }
        return { done: true };
      },
    };
  }
}

// Проблема 3: Генератор с неправильной типизацией
function* processTasks(queue: TaskQueue) {
  for (const task of queue) {
    // yield должен принимать boolean через next(), но тип не указан
    const shouldSkip = yield task.title;
    if (shouldSkip) {
      continue;
    }
    console.log(`Обработка: ${task.title}`);
  }
  // Возвращает количество обработанных задач, но тип не указан
  return 0;
}

// Проблема 4: for...in вместо for...of
function getAllTitles(queue: TaskQueue): string[] {
  const titles: string[] = [];
  for (const task in queue) {
    titles.push(task.title);
  }
  return titles;
}

// Проблема 5: Отсутствие return() в итераторе с ресурсами
class DatabaseCursor implements Iterable<Record<string, unknown>> {
  private connection: { close(): void } | null = null;

  constructor(private query: string) {}

  [Symbol.iterator](): Iterator<Record<string, unknown>> {
    this.connection = { close: () => console.log("Соединение закрыто") };
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    let index = 0;

    return {
      next(): IteratorResult<Record<string, unknown>> {
        if (index < rows.length) {
          return { value: rows[index++], done: false };
        }
        return { value: undefined, done: true };
      },
      // Нет метода return() — соединение не закрывается при break
    };
  }
}
