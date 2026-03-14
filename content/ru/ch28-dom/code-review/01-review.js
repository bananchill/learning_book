// Найдите проблемы в этом коде
// Задача: динамически строить список пользователей

// Проблема 1: XSS уязвимость
function renderUser(user) {
  const div = document.createElement('div')
  div.innerHTML = `<span>${user.name}</span>` // ОПАСНО если name содержит HTML
  return div
}

// Проблема 2: Layout Thrashing
function setHeights(elements) {
  elements.forEach(el => {
    const height = el.offsetHeight  // reflow
    el.style.marginBottom = height + 'px' // invalidate + reflow на следующей итерации
  })
}

// Проблема 3: многократные вставки без батчинга
function renderList(container, users) {
  container.innerHTML = ''
  users.forEach(user => {
    container.appendChild(renderUser(user)) // reflow при каждой вставке
  })
}

// Проблема 4: живая коллекция в цикле с модификацией
function removeAllItems(container) {
  const items = container.children // живая коллекция!
  for (let i = 0; i < items.length; i++) {
    items[i].remove() // модифицируем коллекцию во время итерации!
  }
}

export { renderUser, setHeights, renderList, removeAllItems }
