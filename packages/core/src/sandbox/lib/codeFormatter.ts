/**
 * Простой форматтер кода без внешних зависимостей.
 * Нормализует отступы, удаляет trailing whitespace и лишние пустые строки.
 */
export function formatCode(code: string): string {
  const lines = code.split('\n')

  // Удаляем trailing whitespace с каждой строки
  const trimmed = lines.map((line) => line.trimEnd())

  // Удаляем лишние пустые строки (максимум 1 подряд)
  const collapsed: string[] = []
  let prevEmpty = false
  for (const line of trimmed) {
    const isEmpty = line.trim() === ''
    if (isEmpty && prevEmpty) continue
    collapsed.push(line)
    prevEmpty = isEmpty
  }

  // Нормализуем табы → 2 пробела
  const normalized = collapsed.map((line) => line.replace(/\t/g, '  '))

  // Убираем пустые строки в начале и конце
  let start = 0
  while (start < normalized.length && normalized[start].trim() === '') start++
  let end = normalized.length - 1
  while (end > start && normalized[end].trim() === '') end--

  const result = normalized.slice(start, end + 1)

  // Добавляем финальный newline
  return result.join('\n') + '\n'
}
