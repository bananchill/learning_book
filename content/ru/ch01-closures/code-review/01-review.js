// Найди проблемы с замыканиями в этом коде

function setupHandlers() {
  const buttons = document.querySelectorAll('.btn')
  const heavyData = new Array(10000).fill('x'.repeat(1000))

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
      console.log('Кнопка ' + i + ' нажата')
      console.log('Данные: ' + heavyData.length)
    })
  }
}

function createMultipliers() {
  var multipliers = []
  for (var i = 1; i <= 5; i++) {
    multipliers.push(function (x) {
      return x * i
    })
  }
  return multipliers
}

function processUsers(users) {
  var result = []
  for (var i = 0; i < users.length; i++) {
    var user = users[i]
    result.push({
      getName: function () {
        return user.name
      },
    })
  }
  return result
}
