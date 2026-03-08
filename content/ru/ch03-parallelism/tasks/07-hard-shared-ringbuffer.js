// Реализуй SPSC (single-producer, single-consumer) кольцевой буфер
// на SharedArrayBuffer
//
// constructor(capacity) — создаёт буфер на capacity элементов
//   Внутренняя структура SAB: [head, tail, data0, data1, ..., dataN]
//   head — индекс следующей записи (producer)
//   tail — индекс следующего чтения (consumer)
//
// push(value) → boolean
//   Записывает value. Возвращает false если буфер полон.
//
// pop() → number | undefined
//   Читает значение. Возвращает undefined если буфер пуст.
//
// get size → number
//   Текущее количество элементов

export class RingBuffer {
  constructor(capacity) {
    // твой код здесь
  }

  push(value) {
    // твой код здесь
  }

  pop() {
    // твой код здесь
  }

  get size() {
    // твой код здесь
  }
}
