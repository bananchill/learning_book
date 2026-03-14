// Код для ревью: проблемы с функциями
// Найдите все проблемы

// Проблема 1: function expression до объявления
greetUser("Иван")

const greetUser = function(name) {
    return "Привет, " + name
}

// Проблема 2: стрелочная функция как метод
const counter = {
    count: 0,
    increment: () => {
        this.count++ // this — неправильный!
        return this.count
    },
    reset: () => {
        this.count = 0
    }
}

// Проблема 3: мутирование аргумента
function addDefaultRole(user) {
    user.role = user.role || "user" // мутирует оригинальный объект!
    return user
}

// Проблема 4: рекурсия без базового случая
function countDown(n) {
    console.log(n)
    countDown(n - 1) // нет остановки!
}

// Проблема 5: arguments вместо rest
function sum() {
    var total = 0
    for (var i = 0; i < arguments.length; i++) {
        total += arguments[i]
    }
    return total
}
