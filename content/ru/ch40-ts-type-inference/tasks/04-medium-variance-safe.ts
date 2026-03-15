// Задача: Типобезопасный контейнер с вариантностью
//
// Реализуйте три типа контейнеров, соблюдающих правила вариантности.

// Базовые типы для тестирования
export interface Animal {
  name: string
}

export interface Cat extends Animal {
  purr(): void
}

// 1. ReadonlyBox -- ковариантный контейнер (только чтение)
//    ReadonlyBox<Cat> должен быть совместим с ReadonlyBox<Animal>
export interface ReadonlyBox<T> {
  // TODO: определите метод get
  get(): T
}

// 2. WriteBox -- контравариантный контейнер (только запись)
//    WriteBox<Animal> должен быть совместим с WriteBox<Cat>
export interface WriteBox<T> {
  // TODO: определите метод set
  set(value: T): void
}

// 3. Box -- инвариантный контейнер (чтение и запись)
export interface Box<T> {
  get(): T
  set(value: T): void
}

// 4. Реализуйте создание ReadonlyBox
export function createReadonlyBox<T>(value: T): ReadonlyBox<T> {
  // TODO: верните объект с методом get
  return { get: () => value }
}

// 5. Реализуйте создание WriteBox
export function createWriteBox<T>(
  initialValue: T,
): WriteBox<T> & { getCurrent(): T } {
  // TODO: верните объект с методом set и getCurrent для тестирования
  let current = initialValue
  return {
    set(value: T) {
      current = value
    },
    getCurrent() {
      return current
    },
  }
}

// 6. Реализуйте создание Box
export function createBox<T>(value: T): Box<T> & { getCurrent(): T } {
  // TODO: верните полный контейнер
  let current = value
  return {
    get() {
      return current
    },
    set(newValue: T) {
      current = newValue
    },
    getCurrent() {
      return current
    },
  }
}

// 7. Функция, демонстрирующая ковариантность ReadonlyBox
//    Принимает ReadonlyBox<Animal> и возвращает имя
export function getAnimalName(box: ReadonlyBox<Animal>): string {
  // TODO: реализуйте
  return box.get().name
}

// 8. Функция, демонстрирующая контравариантность WriteBox
//    Принимает WriteBox<Cat> и записывает кота
export function writeCat(box: WriteBox<Cat>, cat: Cat): void {
  // TODO: реализуйте
  box.set(cat)
}
