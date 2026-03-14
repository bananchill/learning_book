// Код для ревью: проблемы с работой с массивами
// Найдите все проблемы

function processUsers(users) {
    // Сортировка без функции сравнения для чисел
    var ages = users.map(u => u.age)
    ages.sort() // числовая сортировка неправильная!

    // Мутирование пришедшего массива
    users.push({ name: "Admin", age: 0, role: "admin" })

    // Неэффективная проверка через indexOf
    function hasAdmin(arr) {
        return arr.indexOf("admin") != -1 // сравнение через !=
    }

    // Игнорирование возвращаемого значения map
    users.map(function(user) {
        user.displayName = user.name.toUpperCase() // мутирует объекты!
        return user
    })

    // Неправильная сортировка строк с числами
    var names = ["Иван10", "Иван2", "Иван1"]
    names.sort() // лексикографическая, может быть неправильной

    return users
}
