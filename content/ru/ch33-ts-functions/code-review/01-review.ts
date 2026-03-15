// Code Review: найди проблемы с типизацией функций
// Представь, что этот код написал джуниор. Найди все ошибки и плохие практики.

// 1. Коллбэк без типа
function applyToAll(items: string[], callback: Function) {
  return items.map(callback as any);
}

// 2. Перегрузки вместо union
function getLength(input: string): number;
function getLength(input: any[]): number;
function getLength(input: any): number {
  return input.length;
}

// 3. any вместо unknown
function parseConfig(raw: string): any {
  return JSON.parse(raw);
}

// 4. Забытый this-параметр
const handler = {
  message: "Нажата кнопка",
  handleClick: function (event: Event) {
    console.log(this.message); // this может быть потерян
  },
};

document.addEventListener("click", handler.handleClick);

// 5. Spread без as const
function move(x: number, y: number): void {
  console.log(`Перемещение в (${x}, ${y})`);
}

const coords = [10, 20];
// move(...coords); // Ошибка TypeScript

// 6. Неправильная типизация деструктуризации
function createUser({ name: string, age: number }) {
  return { name: string, age: number };
}
