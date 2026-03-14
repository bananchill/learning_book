// Код для ревью: проблемы с циклами
// Найдите все проблемы

function findUsers(users, criteria) {
    var results = []

    for (var i = 0; i <= users.length; i++) {  // <= вместо <
        var user = users[i]

        if (user.isActive == true) {
            if (user.age >= criteria.minAge) {
                if (user.role == criteria.role || criteria.role == undefined) {
                    results.push(user)
                }
            }
        }
    }

    return results
}

// Итерация по объекту без hasOwnProperty
function getKeys(obj) {
    var keys = []
    for (var key in obj) {
        keys.push(key)  // может включать прототипные свойства!
    }
    return keys
}

// Утечка переменной из цикла
for (var j = 0; j < 5; j++) {
    setTimeout(function() {
        console.log(j)  // всегда 5!
    }, j * 100)
}
