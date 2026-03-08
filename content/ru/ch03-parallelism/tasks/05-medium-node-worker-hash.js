// Создай функцию hashInWorker(text, algorithm)
// Вычисляет хеш строки в отдельном worker_thread
// algorithm: 'sha256', 'md5', и т.д.
// Возвращает промис с hex-строкой
//
// Файл работает в dual-mode:
// - Как main: создаёт Worker и отправляет задачу
// - Как worker: считает хеш и отправляет результат

import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads'
import crypto from 'node:crypto'

export function hashInWorker(text, algorithm = 'sha256') {
  // твой код здесь
}

if (!isMainThread) {
  // воркер: твой код здесь
}
