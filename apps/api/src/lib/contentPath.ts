import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** Корень монорепо */
const ROOT = resolve(__dirname, '..', '..', '..', '..')

export const CONTENT_DIR = resolve(ROOT, 'content', 'ru')
export const BOOK_CONFIG_PATH = resolve(ROOT, 'apps', 'book', 'book.config.json')
