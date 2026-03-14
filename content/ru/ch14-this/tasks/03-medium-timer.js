// Задача: исправить класс Timer с потерянным this в setInterval
// Timer имеет:
//   constructor(onTick) — сохраняет коллбэк, инициализирует this.count = 0
//   start()   — запускает setInterval каждые 100ms: count++, вызывает onTick(count)
//   stop()    — останавливает интервал
//   reset()   — сбрасывает count в 0 и останавливает

export class Timer {
  constructor(onTick) {
    this.count = 0
    this.onTick = onTick
    // твой код здесь
  }

  start() {
    // Проблема: this теряется в setInterval — исправь это
    this.intervalId = setInterval(function() {
      this.count++             // this === undefined (ошибка!)
      this.onTick(this.count)
    }, 100)
  }

  stop() {
    // твой код здесь
  }

  reset() {
    // твой код здесь
  }
}
