import { describe, it, expect } from "vitest"
import {
  createReadonlyBox,
  createWriteBox,
  createBox,
  getAnimalName,
  writeCat,
  type Animal,
  type Cat,
  type ReadonlyBox,
  type WriteBox,
} from "./04-medium-variance-safe"

const myCat: Cat = { name: "Мурка", purr() {} }
const myAnimal: Animal = { name: "Шарик" }

describe("Типобезопасный контейнер с вариантностью", () => {
  describe("ReadonlyBox (ковариантный)", () => {
    it("создаёт ReadonlyBox и читает значение", () => {
      const box = createReadonlyBox(myCat)
      expect(box.get()).toBe(myCat)
    })

    it("ReadonlyBox<Cat> совместим с ReadonlyBox<Animal> (ковариантность)", () => {
      const catBox: ReadonlyBox<Cat> = createReadonlyBox(myCat)
      // Ковариантность: ReadonlyBox<Cat> -> ReadonlyBox<Animal>
      const name = getAnimalName(catBox as ReadonlyBox<Animal>)
      expect(name).toBe("Мурка")
    })
  })

  describe("WriteBox (контравариантный)", () => {
    it("создаёт WriteBox и записывает значение", () => {
      const box = createWriteBox(myCat)
      const newCat: Cat = { name: "Барсик", purr() {} }
      box.set(newCat)
      expect(box.getCurrent()).toBe(newCat)
    })

    it("writeCat записывает Cat в WriteBox<Cat>", () => {
      const box = createWriteBox(myCat)
      const newCat: Cat = { name: "Барсик", purr() {} }
      writeCat(box, newCat)
      expect(box.getCurrent()).toBe(newCat)
    })
  })

  describe("Box (инвариантный)", () => {
    it("создаёт Box и поддерживает чтение и запись", () => {
      const box = createBox(myCat)
      expect(box.get()).toBe(myCat)

      const newCat: Cat = { name: "Барсик", purr() {} }
      box.set(newCat)
      expect(box.get()).toBe(newCat)
    })

    it("getAnimalName работает с Box<Animal>", () => {
      const box = createBox(myAnimal)
      expect(getAnimalName(box)).toBe("Шарик")
    })
  })
})
