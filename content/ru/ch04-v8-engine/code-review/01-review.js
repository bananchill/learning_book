// Найди проблемы с производительностью V8 в этом коде

function createUsers(data) {
  const users = []
  for (let i = 0; i < data.length; i++) {
    const user = {}
    if (data[i].age) user.age = data[i].age
    if (data[i].name) user.name = data[i].name
    if (data[i].email) user.email = data[i].email
    users.push(user)
  }
  return users
}

function processItems(items) {
  return items.map(item => {
    const result = { value: item.value, label: item.label }
    if (item.deprecated) {
      delete result.label
    }
    return result
  })
}

function getProperty(objects, prop) {
  return objects.map(obj => obj[prop])
}

// Вызывается с разными shape:
// getProperty([{x:1, y:2}, {a:1, b:2}, {foo:1}, {z:1, w:2, q:3}], 'x')

function createCache() {
  const data = new Array(100000).fill('x'.repeat(1000))

  return {
    get(key) {
      return data.find(item => item === key)
    },
    getSize() {
      return data.length
    },
  }
}

function makeProcessor() {
  let config = { mode: 'fast', debug: false }
  let buffer = []
  let temp = null

  return function process(input) {
    eval('temp = input')
    buffer.push(temp)
    return buffer.length
  }
}
