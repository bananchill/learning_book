// Найди проблемы в этом коде
// Код должен выводить приветствия для списка пользователей

var users = ['Иван', 'Мария', 'Пётр']

function printGreetings() {
  for (var i = 0; i <= users.length; i++) {  // проблема 1
    greeting = 'Привет, ' + users[i] + '!'   // проблема 2
    console.log(greeting)
  }
}

printGreetings()
