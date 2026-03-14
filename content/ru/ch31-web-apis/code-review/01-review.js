// Найдите проблемы в этом коде
// Задача: API сервис для загрузки данных

// Проблема 1: не проверяется response.ok
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  return response.json() // что если 404 или 500?
}

// Проблема 2: нет таймаута — запрос может висеть вечно
async function loadData(url) {
  const response = await fetch(url)
  return response.json()
}

// Проблема 3: не отменяется предыдущий поиск
let lastQuery = ''
async function search(query) {
  if (query === lastQuery) return
  lastQuery = query
  const result = await fetch(`/api/search?q=${query}`)
  return result.json()
  // Если быстро набираем 'ив' → 'ива' → 'иван',
  // все три запроса выполняются, результаты приходят в случайном порядке
}

// Проблема 4: localStorage без try/catch
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
  // Что если localStorage полон (QuotaExceededError)?
}

export { fetchUser, loadData, search, saveToStorage }
