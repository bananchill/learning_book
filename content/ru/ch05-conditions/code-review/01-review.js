// Код для ревью: проблемы с условными операторами
// Найдите все проблемы и предложите улучшения

function getDiscount(user) {
    var discount = 0

    if (user != null) {
        if (user.isActive != false) {
            if (user.totalPurchases > 10000) {
                if (user.memberSince < 2020) {
                    discount = 20
                } else {
                    discount = 15
                }
            } else {
                if (user.totalPurchases > 5000) {
                    discount = 10
                } else {
                    discount = 5
                }
            }
        }
    }

    return discount
}

function getLabel(status) {
    var label
    if (status == "active") {
        label = "Активен"
    } else if (status == "inactive") {
        label = "Неактивен"
    } else if (status == "pending") {
        label = "Ожидает"
    } else if (status == "banned") {
        label = "Заблокирован"
    } else {
        label = "Неизвестно"
    }
    return label
}
