// Задание: создай типизированный EventEmitter
//
// Требования:
// 1. Опиши интерфейс EventMap для маппинга событий на аргументы коллбэков
// 2. Реализуй класс TypedEmitter с методами on, off, emit
// 3. Метод on принимает имя события и коллбэк с правильной сигнатурой
// 4. Метод emit принимает имя события и аргументы, соответствующие коллбэку
// 5. Метод off удаляет конкретный обработчик
//
// Пример использования:
//   interface MyEvents {
//     greet: (name: string) => void;
//     calculate: (a: number, b: number) => void;
//     done: () => void;
//   }
//
//   const emitter = new TypedEmitter<MyEvents>();
//   emitter.on('greet', (name) => console.log(`Привет, ${name}!`));
//   emitter.emit('greet', 'Алиса'); // OK
//   emitter.emit('greet', 42);       // Ошибка типа!

// Опиши тип для маппинга событий
// EventMap — это объект, где ключ — имя события, значение — функция-обработчик

export class TypedEmitter<T extends Record<string, (...args: any[]) => void>> {
  // твой код здесь
  // Хранилище обработчиков

  // on(event, handler) — подписка
  on(event: any, handler: any): void {
    // твой код здесь
  }

  // off(event, handler) — отписка
  off(event: any, handler: any): void {
    // твой код здесь
  }

  // emit(event, ...args) — вызов обработчиков
  emit(event: any, ...args: any[]): void {
    // твой код здесь
  }
}
