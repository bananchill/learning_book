<template>
  <div class="p-6 bg-gray-950 text-white rounded-xl font-mono text-sm">
    <h2 class="text-lg font-bold mb-4 text-green-400">Песочница: Прототипы и классы</h2>

    <div class="flex gap-2 mb-4 flex-wrap">
      <button
        v-for="ex in examples"
        :key="ex.id"
        @click="select(ex)"
        :class="[
          'px-3 py-1 rounded text-xs font-semibold transition-colors',
          activeId === ex.id
            ? 'bg-green-500 text-gray-900'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        ]"
      >
        {{ ex.label }}
      </button>
    </div>

    <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs mb-4 leading-relaxed">{{ activeCode }}</pre>

    <div class="bg-gray-900 rounded-lg p-4">
      <div class="text-green-400 text-xs font-semibold mb-2">Что происходит под капотом:</div>
      <p class="text-gray-300 text-xs leading-relaxed">{{ activeExplanation }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Example { id: string; label: string; code: string; explanation: string }

const examples: Example[] = [
  {
    id: 'object-create',
    label: 'Object.create',
    code: `const proto = {
  greet() {
    return 'Привет, ' + this.name
  }
}

const obj = Object.create(proto)
obj.name = 'Алиса'

obj.greet()  // "Привет, Алиса"

// Цепочка:
// obj → proto → Object.prototype → null
Object.getPrototypeOf(obj) === proto  // true
Object.hasOwn(obj, 'greet')           // false (в прототипе)
Object.hasOwn(obj, 'name')            // true (собственное)`,
    explanation: 'Object.create(proto) создаёт новый объект и устанавливает proto как его [[Prototype]]. Метод greet не копируется в obj — он остаётся в proto и доступен через прототипную цепочку. Все объекты, созданные через Object.create(proto), разделяют один экземпляр функции greet.'
  },
  {
    id: 'class-sugar',
    label: 'class = прототипы',
    code: `class Animal {
  constructor(name) { this.name = name }
  speak() { return this.name + ' говорит' }
}

// Под капотом это примерно:
// function Animal(name) { this.name = name }
// Animal.prototype.speak = function() { return this.name + ' говорит' }

const cat = new Animal('Кот')

// Метод — в прототипе, не в экземпляре
Object.hasOwn(cat, 'speak')   // false
Object.hasOwn(cat, 'name')    // true

// Все экземпляры используют одну функцию
const dog = new Animal('Пёс')
cat.speak === dog.speak  // true`,
    explanation: 'Методы класса размещаются в Animal.prototype — все экземпляры используют одну функцию через прототипную цепочку. Это экономично: при 1000 экземплярах — всё равно одна функция speak в памяти. Собственные свойства (name) — отдельные для каждого экземпляра.'
  },
  {
    id: 'extends',
    label: 'extends и super',
    code: `class Shape {
  constructor(color) { this.color = color }
  describe() { return 'Фигура: ' + this.color }
}

class Circle extends Shape {
  constructor(radius, color) {
    super(color)  // вызов конструктора Shape — ОБЯЗАТЕЛЕН
    this.radius = radius
  }
  area() { return Math.PI * this.radius ** 2 }
  describe() {
    return super.describe() + ', радиус: ' + this.radius
  }
}

const c = new Circle(5, 'red')
c.describe() // "Фигура: red, радиус: 5"
c instanceof Circle  // true
c instanceof Shape   // true — наследование работает`,
    explanation: 'extends настраивает цепочку прототипов: Circle.prototype[[Prototype]] = Shape.prototype. super() в конструкторе вызывает родительский конструктор — без него this недоступен. super.method() вызывает метод из прототипа родителя, позволяя расширить, а не полностью заменить поведение.'
  }
]

const activeId = ref('object-create')
const activeCode = ref(examples[0].code)
const activeExplanation = ref(examples[0].explanation)

function select(ex: Example) {
  activeId.value = ex.id
  activeCode.value = ex.code
  activeExplanation.value = ex.explanation
}
</script>
