// Найди проблемы с this в этом коде

class EventBus {
  constructor() {
    this.listeners = {}
  }

  on(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(handler)
  }

  emit(event, data) {
    const handlers = this.listeners[event] || []
    handlers.forEach(function(handler) {
      handler(data)
    })
  }
}

const bus = new EventBus()

// Проблема 1: потеря контекста при передаче метода
const { emit } = bus
emit('test', 'data') // что произойдёт?

// Проблема 2: метод как стрелка на прототипе (не в конструкторе)
const calculator = {
  value: 0,
  add: (n) => {
    this.value += n  // this здесь — не calculator!
    return this
  },
  subtract: (n) => {
    this.value -= n
    return this
  }
}

calculator.add(5).subtract(2) // не работает как ожидается

// Проблема 3: this в callback внутри метода
class Formatter {
  constructor(prefix) {
    this.prefix = prefix
  }

  formatAll(items) {
    return items.map(function(item) {
      return this.prefix + ': ' + item  // this теряется!
    })
  }
}

const f = new Formatter('LOG')
f.formatAll(['a', 'b']) // TypeError
