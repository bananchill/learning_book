// Найдите проблемы в этом коде
// Задача: обработчики событий для интерактивного списка

// Проблема 1: нет делегирования — отдельный обработчик на каждый элемент
function initList(listEl) {
  const items = listEl.querySelectorAll('.item')
  items.forEach(item => {
    item.addEventListener('click', () => deleteItem(item))
    // Проблема: новые элементы не будут иметь обработчика
    // Проблема: N обработчиков вместо одного
  })
}

// Проблема 2: обработчик не удаляется при удалении элемента
class Modal {
  constructor() {
    this.el = document.querySelector('.modal')
    // Сохраняем анонимные стрелки — не сможем удалить!
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close()
    })
    document.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close()
    })
  }
  // Нет метода destroy — утечка памяти!
  close() { this.el.style.display = 'none' }
}

// Проблема 3: stopPropagation используется слишком широко
document.querySelector('.dropdown').addEventListener('click', (e) => {
  e.stopPropagation() // блокирует ВСЕ клики выше — ломает другие обработчики
  toggleDropdown()
})

export { initList, Modal }
