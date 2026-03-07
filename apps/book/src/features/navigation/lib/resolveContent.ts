import type { ChapterMeta } from '@book/shared'

/** Получить путь к файлу контента для главы/подглавы */
export function resolveContentPath(
  chapter: ChapterMeta,
  subchapterId?: string,
): string {
  if (subchapterId) {
    return `${chapter.contentPath}/${subchapterId}.md`
  }
  return `${chapter.contentPath}/index.md`
}
