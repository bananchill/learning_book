// Code Review: найди проблемы в этой конфигурации TypeScript-проекта
// Представь, что эти конфиги написал джуниор для монорепо с Vite. Найди все ошибки.

// ===== tsconfig.json (корень) =====
const rootConfig = {
  compilerOptions: {
    // Устаревшая стратегия разрешения модулей
    moduleResolution: "node",
    // Слишком старый target для 2024 года
    target: "ES5",
    // Не включён строгий режим
    strict: false,
    // Нет esModuleInterop — проблемы с импортами CJS
    esModuleInterop: false,
    // Нет isolatedModules — проблемы с Vite/esbuild
    isolatedModules: false,
    // Нет skipLibCheck — медленная компиляция
    skipLibCheck: false,
  },
  // include слишком широкий — включает node_modules
  include: ["**/*"],
};

// ===== packages/shared/tsconfig.json =====
const sharedConfig = {
  compilerOptions: {
    // Забыли composite для Project References
    // composite: true,  ← НЕ ВКЛЮЧЕНО

    // Забыли declaration — зависимые пакеты не увидят типы
    declaration: false,

    // outDir не указан — файлы генерируются рядом с исходниками
    // outDir: ???

    // rootDir не указан — структура выхода непредсказуема
    // rootDir: ???
  },
  // Нет include — TypeScript включит всё
};

// ===== packages/app/tsconfig.json =====
const appConfig = {
  compilerOptions: {
    // paths настроены, но бандлер не знает о них
    paths: {
      "@/*": ["./src/*"],
      "@shared/*": ["../../packages/shared/src/*"],
    },
    // Для Vite нужен noEmit, но его нет
    // noEmit: true,  ← НЕ ВКЛЮЧЕНО

    // jsx не настроен (если используется React/Vue)
    // jsx: ???
  },
  // include указывает на несуществующую директорию
  include: ["source/**/*"],
  // references не настроены — нет связи с shared
  // references: ???
};

// ===== vite.config.ts — алиасы НЕ продублированы =====
const viteConfig = {
  // Нет resolve.alias — paths из tsconfig не будут работать в рантайме!
  // resolve: {
  //   alias: {
  //     "@": path.resolve(__dirname, "./src"),
  //     "@shared": path.resolve(__dirname, "../../packages/shared/src"),
  //   }
  // }
};
