import { describe, it, expect, vi } from "vitest"
import {
  createBaseHandler,
  createClickHandler,
  dispatch,
  processEvents,
  type ClickEvent,
  type KeyPressEvent,
  type AppEvent,
  type BaseEvent,
  type EventHandler,
} from "./03-medium-function-compat"

const clickEvent: ClickEvent = {
  type: "click",
  timestamp: Date.now(),
  clientX: 100,
  clientY: 200,
}

const keyEvent: KeyPressEvent = {
  type: "keypress",
  timestamp: Date.now(),
  key: "Enter",
  code: "Enter",
}

describe("Совместимость функций", () => {
  it("createBaseHandler возвращает обработчик BaseEvent", () => {
    const handler = createBaseHandler()
    expect(typeof handler).toBe("function")
    // Обработчик BaseEvent должен работать с любым подтипом
    expect(() => handler(clickEvent)).not.toThrow()
    expect(() => handler(keyEvent)).not.toThrow()
  })

  it("createClickHandler возвращает обработчик ClickEvent", () => {
    const handler = createClickHandler()
    expect(typeof handler).toBe("function")
    expect(() => handler(clickEvent)).not.toThrow()
  })

  it("dispatch вызывает все обработчики", () => {
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    dispatch(clickEvent, [handler1, handler2])

    expect(handler1).toHaveBeenCalledWith(clickEvent)
    expect(handler2).toHaveBeenCalledWith(clickEvent)
  })

  it("dispatch работает с разными типами событий", () => {
    const handler = vi.fn()

    dispatch(clickEvent, [handler])
    dispatch(keyEvent, [handler])

    expect(handler).toHaveBeenCalledTimes(2)
  })

  it("processEvents вызывает handler для каждого события", () => {
    const handler = vi.fn()
    const events: AppEvent[] = [clickEvent, keyEvent]

    processEvents(events, handler)

    expect(handler).toHaveBeenCalledTimes(2)
    expect(handler).toHaveBeenCalledWith(clickEvent)
    expect(handler).toHaveBeenCalledWith(keyEvent)
  })

  it("baseHandler совместим с позицией обработчика подтипа (контравариантность)", () => {
    const baseHandler: EventHandler<BaseEvent> = createBaseHandler()
    // Обработчик BaseEvent можно использовать где ожидается обработчик ClickEvent
    const handlers: EventHandler<BaseEvent>[] = [baseHandler]
    expect(() => dispatch(clickEvent, handlers)).not.toThrow()
  })
})
