// Найди проблемы с обработкой ошибок

// Проблема 1: проглатывание ошибки
async function loadConfig() {
  try {
    const response = await fetch('/config.json')
    return await response.json()
  } catch (e) {
    // молчим об ошибке
  }
}

// Проблема 2: fetch не выбрасывает при 404
async function getUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`)
    const user = await response.json()
    return user
  } catch (error) {
    console.error('Пользователь не найден')
    return null
  }
}

// Проблема 3: throw строки вместо Error
function validateAge(age) {
  if (age < 0) throw 'Возраст не может быть отрицательным'
  if (age > 150) throw 'Нереалистичный возраст'
  return age
}

// Проблема 4: catch ловит всё подряд без разбора
async function processData(data) {
  try {
    const parsed = JSON.parse(data)
    const result = await sendToServer(parsed)
    return result
  } catch (error) {
    // Ловим и парсинг и сетевые ошибки одинаково
    return { error: 'Что-то пошло не так' }
  }
}

// Проблема 5: необработанный промис
function startProcess() {
  loadHeavyData().then(data => {
    processData(data)
    // нет .catch() — ошибка будет unhandledRejection
  })
}
