// Найди проблемы с каррированием в этом коде

// === Проблема 1: curry + rest-параметры ===
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args)
    return (...more) => curried(...args, ...more)
  }
}

const sumAll = (...nums) => nums.reduce((a, b) => a + b, 0)
const curriedSumAll = curry(sumAll)
// Ожидание: curriedSumAll(1)(2)(3) === 6
// Реальность: curriedSumAll(1) вызывает sumAll(1) сразу, потому что sumAll.length === 0

// === Проблема 2: каррирование метода объекта ===
const user = {
  name: 'Алексей',
  greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`
  },
}

const curriedGreet = curry(user.greet)
// Ожидание: curriedGreet('Привет')('!') === 'Привет, Алексей!'
// Реальность: this === undefined, получим 'Привет, undefined!'

// === Проблема 3: чрезмерное каррирование ===
const add = curry((a, b) => a + b)
// Используется только так:
const result1 = add(2)(3)
const result2 = add(5)(10)
const result3 = add(1)(1)
// Ни разу не создаётся промежуточная функция вроде addFive = add(5)
// Каррирование здесь бесполезно — overhead без пользы

// === Проблема 4: функция с нулевой арностью ===
function createConfig(options = {}) {
  return { debug: false, verbose: false, ...options }
}

const curriedConfig = curry(createConfig)
// createConfig.length === 0 (дефолтный параметр не считается)
// curriedConfig() сразу вызывает createConfig() — каррирование не работает

// === Проблема 5: утечка памяти через цепочку замыканий ===
function processData(data) {
  const pipeline = []
  for (let i = 0; i < 10000; i++) {
    const step = curry((config, transformer, input) => transformer(input, config))
    pipeline.push(step({ heavy: new Array(1000).fill('x') }))
    // Каждый step создаёт замыкание, удерживающее объект config с тяжёлым массивом
    // 10 000 замыканий × 1000 элементов = потенциальная проблема с памятью
  }
  return pipeline
}
