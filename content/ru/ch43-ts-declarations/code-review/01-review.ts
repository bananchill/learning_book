// Code Review: найди проблемы в этих declaration files
// Представь, что этот код написал джуниор. Найди все ошибки и плохие практики.

// === Файл 1: глобальные декларации ===

declare function processData(data: any): any;

declare function handleEvent(callback: () => any): void;

declare function createUser(name: String, age: Number): Object;

// === Файл 2: декларации для модуля ===

declare module "utils" {
  function parse(input: string): Object;
  function parse(input: any): any;
  function parse(input: "json"): JsonResult;

  interface JsonResult {
    data: any;
    error: any;
  }
}

// === Файл 3: module augmentation ===

// Попытка расширить Express Request
declare module "express" {
  interface Request {
    user: any;
  }
}

// === Файл 4: типы для ассетов ===

declare module "*.png";
declare module "*.jpg";
declare module "*.svg";
