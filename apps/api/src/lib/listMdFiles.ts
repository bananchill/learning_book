import { readdir } from 'fs/promises'

/** Возвращает список .md файлов в директории (без расширения) */
export async function listMdFiles(dir: string): Promise<string[]> {
  try {
    const entries = await readdir(dir)
    return entries
      .filter((f) => f.endsWith('.md') && f !== 'index.md' && f !== 'cheatsheet.md')
      .map((f) => f.replace('.md', ''))
      .sort()
  } catch {
    return []
  }
}
