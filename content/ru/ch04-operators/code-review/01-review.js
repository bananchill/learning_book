// Код для ревью: проблемы с операторами
// Найдите проблемы и предложите исправления

function getUserDisplay(user) {
    var name = user.firstName + " " + user.lastName
    var age = user.age || 0      // пользователю может быть 0 лет (новорождённый)
    var score = user.score || 100 // дефолтный счёт 100, если не задан

    if (user.role == "admin") {
        name = "[ADMIN] " + name
    }

    var isAdult = user.age >= 18 ? true : false
    var hasAccess = user.isActive == true && user.role != "banned"

    return name + " (" + age + " лет), счёт: " + score
}

// Использование
const users = [
    {firstName: "Иван", lastName: "Петров", age: 25, role: "user", isActive: true, score: 0},
    {firstName: "Мария", lastName: "Сидорова", age: 30, role: "admin", isActive: true, score: undefined}
]

users.forEach(u => console.log(getUserDisplay(u)))
