// Code Review: найди проблемы в этом TypeScript-коде
// Представь, что этот код написал джуниор. Найди все ошибки и плохие практики.

function getUser(id: any) {
  const users = [
    { id: 1, name: "Алиса", age: 25 },
    { id: 2, name: "Боб", age: 30 },
  ];
  return users.find(u => u.id == id);
}

function formatUser(user: any): string {
  return "Пользователь: " + user.name + ", возраст: " + user.age;
}

function getUserAge(id: any) {
  const user = getUser(id);
  return user.age;
}

function greetAll(names: any) {
  const result = [];
  for (let i = 0; i < names.length; i++) {
    result.push("Привет, " + names[i]);
  }
  return result;
}

const config = {
  port: "3000",
  debug: "true",
};

function startServer(port: number, debug: boolean) {
  console.log(`Starting on port ${port}, debug: ${debug}`);
}

startServer(config.port, config.debug);
