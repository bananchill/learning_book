import { useRouter } from 'vue-router'

/**
 * Возвращает обработчик кликов, который перехватывает внутренние <a> ссылки
 * и маршрутизирует их через Vue Router (SPA-навигация вместо перезагрузки).
 * Использование: <div @click="onContentClick">...</div>
 */
export function useRouterLinks() {
  const router = useRouter()

  function onContentClick(event: MouseEvent) {
    const target = (event.target as HTMLElement).closest('a')
    if (!target) return

    const href = target.getAttribute('href')
    if (!href) return

    // Пропускаем внешние ссылки, якоря, mailto и т.д.
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return

    // Пропускаем клики с модификаторами (ctrl+click = новая вкладка)
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    // Пропускаем ссылки с target="_blank"
    if (target.getAttribute('target') === '_blank') return

    // Внутренняя ссылка — используем Vue Router
    event.preventDefault()
    router.push(href)
  }

  return { onContentClick }
}
