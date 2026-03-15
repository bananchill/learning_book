// Задание: напиши функцию, которая валидирует и нормализует конфигурацию tsconfig.json

// Интерфейс входных данных (могут быть неполными)
interface RawTsConfig {
  files?: string[];
  include?: string[];
  exclude?: string[];
  compilerOptions?: Record<string, unknown>;
}

// Интерфейс нормализованного результата
interface NormalizedTsConfig {
  files: string[] | null;
  include: string[];
  exclude: string[];
  compilerOptions: Record<string, unknown>;
}

// 1. Реализуй функцию normalizeTsConfig:
//    - Если files указан и не пуст → files = files, include = []
//    - Если files не указан или пуст → files = null, include = include или ["**/*"] по умолчанию
//    - exclude по умолчанию: ["node_modules", "dist"]
//    - compilerOptions по умолчанию: пустой объект {}
export function normalizeTsConfig(raw: RawTsConfig): NormalizedTsConfig {
  // твой код здесь
  return {
    files: null,
    include: [],
    exclude: [],
    compilerOptions: {},
  };
}

// 2. Реализуй функцию getIncludedPatterns, которая возвращает
//    итоговые паттерны для поиска файлов:
//    - Если files указан → возвращает files
//    - Иначе → возвращает include
export function getIncludedPatterns(config: NormalizedTsConfig): string[] {
  // твой код здесь
  return [];
}

// 3. Реализуй функцию isFileExcluded, которая проверяет,
//    попадает ли файл под один из паттернов exclude.
//    Упрощённая проверка: паттерн без glob, просто startsWith.
//    Например, exclude: ["node_modules"] исключает "node_modules/lodash/index.ts"
export function isFileExcluded(
  filePath: string,
  exclude: string[]
): boolean {
  // твой код здесь
  return false;
}
