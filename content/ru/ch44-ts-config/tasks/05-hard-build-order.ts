// Задание: реализуй топологическую сортировку для Project References

// Граф зависимостей: ключ — имя проекта, значение — массив зависимостей
// Пример: { app: ["core", "shared"], core: ["shared"], shared: [] }
// Означает: app зависит от core и shared, core зависит от shared
interface DependencyGraph {
  [project: string]: string[];
}

// Результат сортировки
interface BuildOrderResult {
  // Порядок сборки (от независимых к зависимым)
  // Для примера выше: ["shared", "core", "app"]
  order: string[];

  // Есть ли циклические зависимости
  hasCycle: boolean;
}

// Реализуй функцию getBuildOrder:
// 1. Выполни топологическую сортировку графа зависимостей
// 2. Проекты без зависимостей идут первыми
// 3. Если есть цикл — верни { order: [], hasCycle: true }
//
// Примеры:
//   { shared: [], core: ["shared"], app: ["core", "shared"] }
//   → { order: ["shared", "core", "app"], hasCycle: false }
//
//   { a: ["b"], b: ["a"] }
//   → { order: [], hasCycle: true }
//
//   { a: [], b: [], c: ["a", "b"] }
//   → { order: ["a", "b", "c"], hasCycle: false }
//     (порядок a и b может быть любым, оба не зависят друг от друга)

export function getBuildOrder(graph: DependencyGraph): BuildOrderResult {
  // твой код здесь
  return { order: [], hasCycle: false };
}

// Реализуй функцию getAffectedProjects:
// Возвращает список проектов, которые нужно пересобрать
// при изменении указанного проекта (включая сам проект).
// Это все проекты, которые прямо или транзитивно зависят от changed.
//
// Пример:
//   graph: { shared: [], core: ["shared"], app: ["core"], tests: ["app"] }
//   changed: "shared"
//   → ["shared", "core", "app", "tests"]  (порядок: от changed к зависимым)

export function getAffectedProjects(
  graph: DependencyGraph,
  changed: string
): string[] {
  // твой код здесь
  return [];
}
