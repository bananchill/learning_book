// Найди проблемы с модулями

// Проблема 1: default export без смысла
// utils.js
export default {
  formatDate(date) { return date.toISOString() },
  formatCurrency(n) { return n + ' ₽' },
  capitalize(s) { return s[0].toUpperCase() + s.slice(1) }
}
// Импорт: import utils from './utils.js'
// Проблема: tree shaking не работает — весь объект всегда в бандле


// Проблема 2: смешивание default и named без причины
// В одном файле:
export default class UserService { }
export default class AuthService { }  // SyntaxError: только один default!


// Проблема 3: неправильный re-export
// Хотим реэкспортировать default как named:
export default from './module.js'  // SyntaxError!
// Правильно:
// export { default as moduleName } from './module.js'


// Проблема 4: require в ESM контексте
// package.json: "type": "module"
import path from 'path'
const config = require('./config.json')  // ReferenceError: require is not defined


// Проблема 5: циклическая зависимость с константой
// a.js:
import { B_VALUE } from './b.js'
export const A_VALUE = B_VALUE + '_A'  // B_VALUE = undefined при цикле!

// b.js:
import { A_VALUE } from './a.js'
export const B_VALUE = 'B'  // инициализируется раньше
