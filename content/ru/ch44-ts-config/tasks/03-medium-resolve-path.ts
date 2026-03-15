// Задание: реализуй функцию разрешения алиасов путей из tsconfig.json

// Маппинг paths из tsconfig.json
// Ключ — паттерн (например, "@utils/*"), значение — массив подстановок
interface PathMapping {
  [pattern: string]: string[];
}

// Результат разрешения пути
interface ResolveResult {
  resolved: string; // Разрешённый путь
  pattern: string;  // Какой паттерн сработал
}

// Реализуй функцию resolvePath:
// 1. Проверь точное совпадение (ключ без *)
// 2. Проверь паттерны с * (ключ содержит *)
// 3. Если совпадений нет — вернуть null
//
// Правила:
// - Точное совпадение: "config" → ["./src/config/index.ts"]
//   Если importPath === "config", вернуть первый элемент массива
//
// - Паттерн с *: "@utils/*" → ["./src/utils/*"]
//   Если importPath = "@utils/date", то * = "date"
//   Подставить "date" вместо * в значение → "./src/utils/date"
//
// - Если несколько паттернов подходят, используй самый длинный (более специфичный)
//
// Примеры:
//   paths: { "@/*": ["./src/*"], "@utils/*": ["./src/shared/utils/*"] }
//   resolvePath("@utils/date", paths)
//     → { resolved: "./src/shared/utils/date", pattern: "@utils/*" }
//   resolvePath("@/components/Button", paths)
//     → { resolved: "./src/components/Button", pattern: "@/*" }

export function resolvePath(
  importPath: string,
  paths: PathMapping
): ResolveResult | null {
  // твой код здесь
  return null;
}

// Реализуй функцию matchesPattern:
// Проверяет, подходит ли importPath под паттерн paths
// Паттерн "prefix*suffix" — importPath должен начинаться с prefix и заканчиваться на suffix
// Если * нет — точное совпадение
export function matchesPattern(importPath: string, pattern: string): boolean {
  // твой код здесь
  return false;
}

// Реализуй функцию extractWildcard:
// Извлекает часть пути, соответствующую * в паттерне
// extractWildcard("@utils/date/format", "@utils/*") → "date/format"
// extractWildcard("config", "config") → ""
export function extractWildcard(importPath: string, pattern: string): string {
  // твой код здесь
  return '';
}
