// Найди нарушения принципов ФП в этом коде

// Проблема 1: мутация входного аргумента
function sortUsers(users) {
  users.sort((a, b) => a.name.localeCompare(b.name))
  return users
}

// Проблема 2: нечистая функция с глобальным состоянием
let discountRate = 0.1

function applyDiscount(price) {
  return price * (1 - discountRate) // зависит от внешней переменной
}

// Проблема 3: побочный эффект в трансформации
function processItems(items) {
  return items.map(item => {
    console.log('Обрабатываю:', item.id) // побочный эффект в map!
    return { ...item, processed: true }
  })
}

// Проблема 4: мутация в pipe
function addMetadata(item) {
  item.updatedAt = new Date()  // мутация аргумента!
  return item
}

function markActive(item) {
  item.active = true  // мутация аргумента!
  return item
}

const processItem = item => {
  addMetadata(item)
  markActive(item)
  return item
}

// Проблема 5: смешение логики и побочных эффектов
async function loadAndSave(id) {
  const data = await fetch(`/api/${id}`).then(r => r.json())
  const processed = data.items
    .filter(i => i.active)
    .map(i => ({ ...i, value: i.value * 2 }))
  // Логика и сохранение перемешаны — нельзя тестировать чистую трансформацию
  await db.save(processed)
  return processed
}
