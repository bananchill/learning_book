// Найдите проблемы в этом коде
// Задача: типобезопасный API-клиент

// Проблема 1: потеря типов при generic операциях
function pickFields(obj, fields) {
  const result = {}
  fields.forEach(f => { result[f] = obj[f] })
  return result
}

// Проблема 2: Record с неправильными ключами
const statusLabels = {
  active: 'Активен',
  inactive: 'Неактивен',
  // 'deleted' забыт — нет TypeScript-ошибки без Record
}

// Проблема 3: не используем ReturnType
async function fetchUser(id) {
  const response = await fetch(`/api/users/${id}`)
  return response.json()
}

// Проблема 4: дублирование типов вместо Omit/Pick
const createUser = (name, email, password) => ({
  name, email, password
})

const updateUser = (id, name, email) => ({
  id, name, email
  // нет password — дублируем поля руками
})

export { pickFields, statusLabels, fetchUser, createUser, updateUser }
