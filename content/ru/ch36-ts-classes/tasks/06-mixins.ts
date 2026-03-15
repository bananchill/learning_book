/**
 * Задача: Система миксинов
 *
 * 1. Определите тип Constructor<T>
 *
 * 2. Реализуйте миксин Serializable — добавляет:
 *    - serialize(): string — JSON.stringify(this)
 *    - static deserialize<T>(json: string): T — JSON.parse
 *
 * 3. Реализуйте миксин Validatable — добавляет:
 *    - validationErrors: string[]
 *    - abstract validate(): boolean (добавляет errors в validationErrors)
 *    - isValid(): boolean — вызывает validate() и возвращает результат
 *
 * 4. Реализуйте миксин EventEmitter — добавляет:
 *    - on(event: string, handler: Function): void
 *    - off(event: string, handler: Function): void
 *    - emit(event: string, ...args: any[]): void
 *
 * 5. Скомпонуйте миксины в класс Model(BaseClass)
 *    и создайте UserModel с полями name и email.
 */

// Тип конструктора для миксинов
export type Constructor<T = {}> = new (...args: any[]) => T;

// Миксин: сериализация в JSON
export function Serializable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    serialize(): string {
      return JSON.stringify(this);
    }
  };
}

// Миксин: система событий
export function EventEmitter<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private _handlers: Map<string, Set<Function>> = new Map();

    on(event: string, handler: Function): void {
      if (!this._handlers.has(event)) {
        this._handlers.set(event, new Set());
      }
      this._handlers.get(event)!.add(handler);
    }

    off(event: string, handler: Function): void {
      this._handlers.get(event)?.delete(handler);
    }

    emit(event: string, ...args: any[]): void {
      this._handlers.get(event)?.forEach((handler) => handler(...args));
    }
  };
}

// Миксин: валидация
export function Validatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    validationErrors: string[] = [];

    isValid(): boolean {
      this.validationErrors = [];
      this.validate();
      return this.validationErrors.length === 0;
    }

    /**
     * Переопределите этот метод для добавления правил валидации.
     * Добавляйте ошибки в this.validationErrors.
     */
    validate(): void {
      // Базовая реализация — нет правил, всегда валидно
    }
  };
}

// Базовый класс сущности
export class Entity {
  constructor(public id: string) {}
}

// Композиция миксинов: Entity + Serializable + EventEmitter + Validatable
const ModelBase = Validatable(EventEmitter(Serializable(Entity)));

/**
 * Класс UserModel — пример использования скомпонованных миксинов.
 * Наследует: Entity (id) + Serializable (serialize) +
 *            EventEmitter (on/off/emit) + Validatable (isValid/validate)
 */
export class UserModel extends ModelBase {
  name: string;
  email: string;

  constructor(id: string, name: string, email: string) {
    super(id);
    this.name = name;
    this.email = email;
  }

  // Реализация валидации для пользователя
  override validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      this.validationErrors.push("Имя не может быть пустым");
    }
    if (!this.email || !this.email.includes("@")) {
      this.validationErrors.push("Некорректный email");
    }
  }
}
