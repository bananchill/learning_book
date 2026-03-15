// Задание: расширь интерфейс через declaration merging
//
// Дан базовый интерфейс EventMap и класс EventBus.
// Используй declaration merging, чтобы:
// 1. Расширить EventMap новыми событиями
// 2. EventBus.emit и EventBus.on должны быть типобезопасными

// Базовый интерфейс — определяет маппинг "имя события → тип данных"
export interface EventMap {
  // Пока пуст — будет расширен через declaration merging
}

// Класс EventBus с типобезопасными on/emit
export class EventBus {
  private listeners: Map<string, Array<(data: any) => void>> = new Map();

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {
    const handlers = this.listeners.get(event as string) || [];
    handlers.push(handler as (data: any) => void);
    this.listeners.set(event as string, handlers);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    const handlers = this.listeners.get(event as string) || [];
    handlers.forEach((handler) => handler(data));
  }

  off<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void): void {
    const handlers = this.listeners.get(event as string) || [];
    const index = handlers.indexOf(handler as (data: any) => void);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}

// === ТВОЁ ЗАДАНИЕ ===
// Используй declaration merging, чтобы расширить EventMap следующими событиями:
//
// "user:login"    → { userId: number; timestamp: Date }
// "user:logout"   → { userId: number }
// "message:new"   → { id: number; text: string; from: string }
// "message:read"  → { id: number; readAt: Date }
//
// Подсказка: объяви ещё один interface EventMap с новыми полями

// Напиши расширение здесь:
