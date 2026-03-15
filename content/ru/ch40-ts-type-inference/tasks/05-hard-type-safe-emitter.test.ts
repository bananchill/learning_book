import { describe, it, expect, vi } from "vitest"
import { TypedEmitter } from "./05-hard-type-safe-emitter"

interface TestEvents {
  click: { x: number; y: number }
  message: string
  disconnect: void
}

describe("TypedEmitter", () => {
  it("on + emit: обработчик вызывается с правильным payload", () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on("click", handler)
    emitter.emit("click", { x: 10, y: 20 })

    expect(handler).toHaveBeenCalledWith({ x: 10, y: 20 })
  })

  it("on: несколько обработчиков на одно событие", () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on("message", handler1)
    emitter.on("message", handler2)
    emitter.emit("message", "привет")

    expect(handler1).toHaveBeenCalledWith("привет")
    expect(handler2).toHaveBeenCalledWith("привет")
  })

  it("off: удаляет обработчик", () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.on("click", handler)
    emitter.off("click", handler)
    emitter.emit("click", { x: 0, y: 0 })

    expect(handler).not.toHaveBeenCalled()
  })

  it("once: обработчик вызывается только один раз", () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler = vi.fn()

    emitter.once("message", handler)
    emitter.emit("message", "первый")
    emitter.emit("message", "второй")

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith("первый")
  })

  it("listenerCount: возвращает количество обработчиков", () => {
    const emitter = new TypedEmitter<TestEvents>()

    expect(emitter.listenerCount("click")).toBe(0)

    emitter.on("click", () => {})
    emitter.on("click", () => {})

    expect(emitter.listenerCount("click")).toBe(2)
  })

  it("removeAllListeners: удаляет все обработчики события", () => {
    const emitter = new TypedEmitter<TestEvents>()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    emitter.on("click", handler1)
    emitter.on("click", handler2)
    emitter.removeAllListeners("click")
    emitter.emit("click", { x: 0, y: 0 })

    expect(handler1).not.toHaveBeenCalled()
    expect(handler2).not.toHaveBeenCalled()
    expect(emitter.listenerCount("click")).toBe(0)
  })

  it("разные события независимы", () => {
    const emitter = new TypedEmitter<TestEvents>()
    const clickHandler = vi.fn()
    const messageHandler = vi.fn()

    emitter.on("click", clickHandler)
    emitter.on("message", messageHandler)
    emitter.emit("click", { x: 5, y: 10 })

    expect(clickHandler).toHaveBeenCalledTimes(1)
    expect(messageHandler).not.toHaveBeenCalled()
  })

  it("emit без обработчиков не вызывает ошибку", () => {
    const emitter = new TypedEmitter<TestEvents>()
    expect(() => emitter.emit("click", { x: 0, y: 0 })).not.toThrow()
  })
})
