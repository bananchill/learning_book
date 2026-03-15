import { describe, it, expect } from "vitest"
import {
  isPersonCompatibleWithHasName,
  isHasNameCompatibleWithPerson,
  isPersonCompatibleWithHasAge,
  areHasNameAndHasAgeCompatible,
  canPassLiteralWithExtraProps,
} from "./02-easy-structural-check"

describe("Проверка структурной совместимости", () => {
  it("Person совместим с HasName (Person имеет name)", () => {
    expect(isPersonCompatibleWithHasName()).toBe(true)
  })

  it("HasName НЕ совместим с Person (нет age и email)", () => {
    expect(isHasNameCompatibleWithPerson()).toBe(false)
  })

  it("Person совместим с HasAge (Person имеет age)", () => {
    expect(isPersonCompatibleWithHasAge()).toBe(true)
  })

  it("HasName и HasAge НЕ совместимы (нет общих свойств)", () => {
    expect(areHasNameAndHasAgeCompatible()).toBe(false)
  })

  it("Объектный литерал с лишними свойствами вызывает excess property check", () => {
    expect(canPassLiteralWithExtraProps()).toBe(false)
  })
})
