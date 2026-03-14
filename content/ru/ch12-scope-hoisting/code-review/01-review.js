// Найди проблемы с hoisting и скоупом в этом коде

function initApp() {
  console.log('Версия приложения: ' + version) // ожидаем строку, что получим?

  if (true) {
    var version = '1.0.0'
    var config = { debug: true }
  }

  return config
}

function createHandlers() {
  var handlers = []

  for (var i = 0; i < 5; i++) {
    handlers.push(function handleClick() {
      console.log('Обработчик номер: ' + i)
    })
  }

  return handlers
}

// Используется до объявления — случайно или намеренно?
const result = calculate(10, 20)

var calculate = function(a, b) {
  return a + b
}

function setup() {
  // Тут есть проблема с typeof
  if (typeof userId !== 'undefined') {
    console.log('userId существует: ' + userId)
  }
  let userId = getUserId()
}
