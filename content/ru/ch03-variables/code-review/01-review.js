// Код для ревью: проблемы с типами и переменными
// Найдите все проблемы и объясните их

var userName = "Иван"
var userAge = "25"  // возраст пришёл из формы как строка
var isAdmin = 1

function getUserInfo(user) {
    if (user == null) {
        return "Пользователь не найден"
    }

    var totalPrice = userAge * 10 + " рублей"

    if (isAdmin == true) {
        console.log("Администратор вошёл в систему")
    }

    return "Имя: " + userName + ", возраст: " + userAge
}

var result = getUserInfo({ name: userName })
var result = getUserInfo(null)
console.log(result)
