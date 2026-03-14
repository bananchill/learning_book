// Найди проблемы с прототипами и наследованием

// Проблема 1: изменение встроенного прототипа
Object.prototype.isEmpty = function() {
  return Object.keys(this).length === 0
}

const obj = { name: 'test' }
console.log(obj.isEmpty()) // работает, но...

// Проблема 2: метод в конструкторе вместо прототипа
class Animal {
  constructor(name) {
    this.name = name
    this.speak = function() {  // создаётся для каждого экземпляра!
      console.log(this.name + ' говорит что-то')
    }
  }
}

// Проблема 3: прямое присваивание __proto__
function createDog(name) {
  const dog = {}
  dog.__proto__ = {
    bark() { console.log('Гав!') }
  }
  dog.name = name
  return dog
}

// Проблема 4: неверная проверка instanceof
function processArray(data) {
  if (data instanceof Object) {  // массивы тоже Object!
    console.log('Это объект, длина: ' + data.length)
  }
}

processArray([1, 2, 3]) // выведет, но не то, что ожидалось
processArray({ length: 5 }) // тоже выведет

// Проблема 5: мутация свойства прототипа (массив в прототипе)
function Base() {}
Base.prototype.items = []  // РАЗДЕЛЯЕТСЯ между всеми экземплярами!

const b1 = new Base()
const b2 = new Base()
b1.items.push('a')
console.log(b2.items) // ["a"] — неожиданно!
