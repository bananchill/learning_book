// Задание: напиши функцию, которая генерирует рекомендуемые compilerOptions
// для указанного типа проекта

type ProjectType = 'frontend' | 'node-lib' | 'node-app';

interface CompilerOptions {
  target: string;
  module: string;
  moduleResolution: string;
  strict: boolean;
  esModuleInterop: boolean;
  isolatedModules: boolean;
  skipLibCheck: boolean;
  declaration: boolean;
  sourceMap: boolean;
  noEmit: boolean;
  lib: string[];
}

// Реализуй функцию getRecommendedOptions:
//
// Для "frontend" (Vite/webpack):
//   target: "ES2022", module: "ESNext", moduleResolution: "bundler"
//   strict: true, esModuleInterop: true, isolatedModules: true, skipLibCheck: true
//   declaration: false, sourceMap: false, noEmit: true
//   lib: ["ES2022", "DOM", "DOM.Iterable"]
//
// Для "node-lib" (npm-пакет на Node.js):
//   target: "ES2022", module: "NodeNext", moduleResolution: "nodenext"
//   strict: true, esModuleInterop: true, isolatedModules: true, skipLibCheck: true
//   declaration: true, sourceMap: true, noEmit: false
//   lib: ["ES2022"]
//
// Для "node-app" (Node.js-приложение):
//   target: "ES2022", module: "NodeNext", moduleResolution: "nodenext"
//   strict: true, esModuleInterop: true, isolatedModules: true, skipLibCheck: true
//   declaration: false, sourceMap: true, noEmit: false
//   lib: ["ES2022"]

export function getRecommendedOptions(projectType: ProjectType): CompilerOptions {
  // твой код здесь
  return {
    target: '',
    module: '',
    moduleResolution: '',
    strict: false,
    esModuleInterop: false,
    isolatedModules: false,
    skipLibCheck: false,
    declaration: false,
    sourceMap: false,
    noEmit: false,
    lib: [],
  };
}

// Реализуй функцию needsDeclaration:
// Возвращает true, если для данного типа проекта нужна генерация .d.ts
export function needsDeclaration(projectType: ProjectType): boolean {
  // твой код здесь
  return false;
}

// Реализуй функцию needsDOM:
// Возвращает true, если для данного типа проекта нужны DOM-типы
export function needsDOM(projectType: ProjectType): boolean {
  // твой код здесь
  return false;
}
