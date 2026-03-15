// Задача: Реестр сервисов на unique symbol
// Сложность: easy
//
// Создайте типобезопасный реестр сервисов, используя unique symbol как ключи.
// Каждый сервис идентифицируется уникальным символом, что исключает коллизии имён.
//
// Требования:
// 1. Создайте unique symbol для каждого типа сервиса (DATABASE, LOGGER, CACHE)
// 2. Реализуйте класс ServiceRegistry с методами register() и resolve()
// 3. Метод resolve() должен возвращать правильный тип сервиса на основе символа

// === Типы сервисов ===

export interface DatabaseService {
  query(sql: string): string[];
}

export interface LoggerService {
  log(message: string): void;
  logs: string[];
}

export interface CacheService {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
}

// === Токены сервисов (unique symbol) ===

// TODO: Объявите три unique symbol как токены для сервисов
// export const DATABASE: unique symbol = ...
// export const LOGGER: unique symbol = ...
// export const CACHE: unique symbol = ...

// === Карта токен → тип сервиса ===

// TODO: Создайте интерфейс ServiceMap, связывающий каждый символ с типом сервиса
// Используйте typeof DATABASE, typeof LOGGER, typeof CACHE как ключи

// === Реестр сервисов ===

// TODO: Реализуйте класс ServiceRegistry:
// - Приватное хранилище Map<symbol, unknown>
// - register<K extends keyof ServiceMap>(token: K, service: ServiceMap[K]): void
// - resolve<K extends keyof ServiceMap>(token: K): ServiceMap[K]
// - resolve выбрасывает ошибку, если сервис не зарегистрирован

export {};
