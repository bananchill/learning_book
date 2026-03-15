// Задание: создай типобезопасную систему плагинов
//
// Используй declaration merging для расширяемого реестра плагинов.
// Каждый плагин регистрируется по имени, и система гарантирует:
// - register() принимает только известные имена плагинов
// - get() возвращает правильный тип для каждого плагина
// - has() проверяет наличие плагина

// 1. Интерфейс реестра плагинов — расширяется через declaration merging
export interface PluginRegistry {
  // Пустой — плагины расширяют его
}

// 2. Интерфейс плагина
export interface Plugin<T = unknown> {
  name: string;
  version: string;
  instance: T;
}

// 3. Реализуй класс PluginManager
//    - register<K extends keyof PluginRegistry>(name: K, plugin: Plugin<PluginRegistry[K]>): void
//    - get<K extends keyof PluginRegistry>(name: K): Plugin<PluginRegistry[K]> | undefined
//    - has(name: keyof PluginRegistry): boolean
//    - getAll(): Array<Plugin>
export class PluginManager {
  // Реализуй здесь
}

// 4. Расширь PluginRegistry через declaration merging для трёх плагинов:
//
// "logger" → { log(msg: string): void; level: string }
// "cache"  → { get(key: string): unknown; set(key: string, value: unknown): void; clear(): void }
// "auth"   → { login(user: string, pass: string): boolean; logout(): void; isAuthenticated: boolean }

// Напиши расширение PluginRegistry здесь:


// 5. Реализуй фабричные функции для создания плагинов:

// createLoggerPlugin(level: string): Plugin<PluginRegistry["logger"]>
export function createLoggerPlugin(level: string): Plugin<any> {
  // Реализуй здесь
}

// createCachePlugin(): Plugin<PluginRegistry["cache"]>
export function createCachePlugin(): Plugin<any> {
  // Реализуй здесь
}

// createAuthPlugin(): Plugin<PluginRegistry["auth"]>
export function createAuthPlugin(): Plugin<any> {
  // Реализуй здесь
}
