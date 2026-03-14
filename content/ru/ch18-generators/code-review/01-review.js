// Найди проблемы с генераторами и итераторами

// Проблема 1: утечка бесконечного генератора
function* infiniteNumbers() {
  let i = 0
  while (true) {
    yield i++
  }
}

// ⚠️ Это зависнет навсегда!
const allNumbers = [...infiniteNumbers()]
console.log(allNumbers[0])


// Проблема 2: неправильная передача значения в генератор
function* calculator() {
  const a = yield 'введи первое число'
  const b = yield 'введи второе число'
  return a + b
}

const calc = calculator()
calc.next(10)  // передаём 10 в первый next — оно теряется!
calc.next(20)
calc.next(5)   // результат будет NaN или неожиданным


// Проблема 3: итератор используется как итерируемый
function makeIterator(arr) {
  let index = 0
  return {
    next() {
      return index < arr.length
        ? { value: arr[index++], done: false }
        : { value: undefined, done: true }
    }
    // нет [Symbol.iterator]!
  }
}

const iter = makeIterator([1, 2, 3])
for (const item of iter) {  // TypeError: iter is not iterable!
  console.log(item)
}


// Проблема 4: забыт await в async-генераторе
async function* fetchData(urls) {
  for (const url of urls) {
    const data = fetch(url).then(r => r.json()) // нет await!
    yield data // выдаёт Promise, не данные
  }
}

for await (const item of fetchData(['/api/1'])) {
  console.log(item.name) // TypeError: Cannot read property of Promise
}
