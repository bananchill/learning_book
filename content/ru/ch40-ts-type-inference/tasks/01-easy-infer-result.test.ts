import { describe, it, expect } from "vitest"
import {
  getTypeOfA,
  getTypeOfB,
  getTypeOfC,
  getTypeOfD,
  getTypeOfE,
} from "./01-easy-infer-result"

describe("Определи выведенный тип", () => {
  it("let a = 42 -> number", () => {
    expect(getTypeOfA()).toBe("number")
  })

  it("const b = 42 -> 42 (литеральный тип)", () => {
    expect(getTypeOfB()).toBe("42")
  })

  it("let c = [1, 'hello', true] -> (number | string | boolean)[]", () => {
    expect(getTypeOfC()).toBe("(number | string | boolean)[]")
  })

  it("const d = { name: 'Алиса' } as const -> d.name имеет тип \"Алиса\"", () => {
    expect(getTypeOfD()).toBe('"Алиса"')
  })

  it("const e = [new Date(), null] -> (Date | null)[]", () => {
    expect(getTypeOfE()).toBe("(Date | null)[]")
  })
})
