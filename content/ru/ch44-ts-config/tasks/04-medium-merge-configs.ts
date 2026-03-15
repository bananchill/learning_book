// Задание: реализуй функцию мержа конфигов, имитирующую extends в tsconfig.json

interface TsConfig {
  compilerOptions?: Record<string, unknown>;
  files?: string[];
  include?: string[];
  exclude?: string[];
}

// Реализуй функцию mergeConfigs:
// Имитирует поведение extends в tsconfig.json:
//
// 1. compilerOptions — МЕРЖАТСЯ (shallow merge)
//    Дочерний переопределяет родительский, но несуществующие в дочернем
//    опции берутся из родительского.
//
// 2. files, include, exclude — ЗАМЕНЯЮТСЯ целиком
//    Если в дочернем указан files — используется дочерний files.
//    Если в дочернем НЕ указан files — используется родительский files.
//    То же для include и exclude.
//
// Примеры:
//   base:  { compilerOptions: { strict: true, target: "ES5" }, include: ["src"] }
//   child: { compilerOptions: { target: "ES2022" }, include: ["lib"] }
//   result: { compilerOptions: { strict: true, target: "ES2022" }, include: ["lib"] }
//
//   base:  { compilerOptions: { strict: true }, files: ["a.ts"], include: ["src"] }
//   child: { compilerOptions: { noEmit: true } }
//   result: { compilerOptions: { strict: true, noEmit: true }, files: ["a.ts"], include: ["src"] }

export function mergeConfigs(base: TsConfig, child: TsConfig): TsConfig {
  // твой код здесь
  return {};
}

// Реализуй функцию mergeChain:
// Принимает массив конфигов (от корневого к дочернему)
// и мержит их последовательно.
// Например: [root, mid, leaf] → merge(merge(root, mid), leaf)
export function mergeChain(configs: TsConfig[]): TsConfig {
  // твой код здесь
  return {};
}
