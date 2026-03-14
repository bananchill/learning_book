// Найди проблемы в коде с Proxy и Reflect

// Проблема 1: set не возвращает true
const proxy1 = new Proxy({}, {
  set(target, prop, value) {
    if (typeof value !== 'number') {
      throw new TypeError('Only numbers allowed')
    }
    target[prop] = value
    // забыли return true!
  }
})

proxy1.x = 5 // в строгом режиме — TypeError!


// Проблема 2: неправильное делегирование без Reflect
class Base {
  get doubled() { return this.value * 2 }
}
const obj = Object.create(new Base())
obj.value = 10

const proxy2 = new Proxy(obj, {
  get(target, prop) {
    return target[prop] // target[prop] — this будет target, не proxy!
  }
})

// Если Base.doubled использует this.someTrackedProp,
// трекинг зависимостей сломается — this = target, не proxy


// Проблема 3: рекурсивный прокси без выхода
const proxy3 = new Proxy({}, {
  get(target, prop, receiver) {
    console.log('get:', prop)
    return proxy3[prop] // читаем из proxy3 — снова вызывает ловушку!
    // бесконечная рекурсия!
  }
})

proxy3.test // Maximum call stack exceeded


// Проблема 4: прокси для примитива
const str = 'hello'
const proxiedStr = new Proxy(str, {  // TypeError: str is not an object!
  get(target, prop) {
    return target[prop]
  }
})
