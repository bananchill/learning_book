// Найдите проблемы в этом коде
// Задача: анимация элементов при скролле

// Проблема 1: анимация через left вместо transform
function animatePosition(el, toX) {
  let x = 0
  function frame() {
    x += (toX - x) * 0.1
    el.style.left = x + 'px'  // МЕДЛЕННО: вызывает Layout каждый кадр
    if (Math.abs(toX - x) > 0.5) {
      requestAnimationFrame(frame)
    }
  }
  requestAnimationFrame(frame)
}

// Проблема 2: scroll обработчик без throttle — каждый пиксель скролла
window.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('.animate-on-scroll')
  elements.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visible')
    }
  })
})

// Проблема 3: измерение производительности через Date.now()
function measurePerf(fn) {
  const start = Date.now()  // недостаточная точность
  fn()
  return Date.now() - start // погрешность до 1 мс
}

export { animatePosition, measurePerf }
