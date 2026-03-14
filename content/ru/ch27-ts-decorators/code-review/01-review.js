// Найдите проблемы в этом коде
// Задача: декораторы для API-контроллера

// Проблема 1: декоратор мутирует оригинальный объект
function logMethod(target, key, descriptor) {
  const original = descriptor.value
  // Внимание: не возвращает descriptor!
  descriptor.value = function (...args) {
    console.log('Вызов:', key, args)
    return original.apply(this, args)
  }
}

// Проблема 2: кэш на уровне класса, не экземпляра
function memoize(target, key, descriptor) {
  const original = descriptor.value
  const cache = new Map() // ПРОБЛЕМА: один кэш для всех экземпляров

  descriptor.value = function (...args) {
    const cacheKey = JSON.stringify(args)
    if (cache.has(cacheKey)) return cache.get(cacheKey)
    const result = original.apply(this, args)
    cache.set(cacheKey, result)
    return result
  }
  return descriptor
}

// Проблема 3: декоратор класса не обрабатывает аргументы конструктора
function singleton(constructor) {
  let instance
  // ПРОБЛЕМА: теряем тип и не передаём аргументы
  return function () {
    if (!instance) instance = new constructor()
    return instance
  }
}

export { logMethod, memoize, singleton }
