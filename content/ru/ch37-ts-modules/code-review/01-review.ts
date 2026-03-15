// Найди проблемы с модулями, namespace и declaration merging

// Проблема 1: namespace внутри модуля
// utils.ts
export namespace StringUtils {
  export function trim(s: string): string {
    return s.trim();
  }
  export function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
// Использование: StringUtils.trim("  hello  ")
// Лишний уровень вложенности — модуль уже является scope


// Проблема 2: обычный import вместо import type
// types.ts экспортирует только интерфейсы
import { UserDTO, ProductDTO, OrderDTO } from './types';
// verbatimModuleSyntax: true в tsconfig — ошибка компиляции!
// Импорт останется в JS, хотя типы стираются

function processUser(user: UserDTO): void {
  console.log(user);
}


// Проблема 3: конфликт при слиянии интерфейсов
interface ApiResponse {
  status: number;
  data: string;
}

interface ApiResponse {
  status: string;    // Конфликт! В первом объявлении status: number
  timestamp: Date;
}


// Проблема 4: module augmentation без импорта модуля
// Хотим расширить express Request
declare module 'express' {
  interface Request {
    userId: string;
  }
}
// Файл не содержит import/export — это скрипт, не модуль!
// declare module не сработает как module augmentation


// Проблема 5: export = и ESM import одновременно
// legacy-lib.ts
class LegacyService {
  getData(): string[] {
    return ['a', 'b', 'c'];
  }
}
export = LegacyService;

// consumer.ts
// import LegacyService from './legacy-lib';  // Ошибка при esModuleInterop: false!
// Нужно: import LegacyService = require('./legacy-lib')
// Или включить esModuleInterop: true
