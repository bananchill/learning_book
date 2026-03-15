// Code Review: найди проблемы в этом TypeScript-коде
// Представь, что этот код написал джуниор. Найди все ошибки и плохие практики.

interface Config {
  host: string;
  port: number;
  debug: boolean;
  timeout: number;
}

// Проблема 1: функция принимает Partial, но не обрабатывает undefined
function startServer(config: Partial<Config>) {
  console.log(`Starting on ${config.host}:${config.port}`);
  if (config.debug) {
    console.log("Debug mode enabled");
  }
  setTimeout(() => {
    console.log("Server timeout");
  }, config.timeout);
}

// Проблема 2: readonly не используется где нужно
interface Point {
  x: number;
  y: number;
}

function translatePoint(p: Point, dx: number, dy: number): Point {
  p.x += dx;
  p.y += dy;
  return p;
}

// Проблема 3: any вместо generic
interface Box {
  contents: any;
}

function unbox(box: Box): any {
  return box.contents;
}

// Проблема 4: неправильное использование extends
interface Animal {
  name: string;
  sound: string;
}

interface Dog extends Animal {
  name: string;  // Дублирование свойства из базового интерфейса
  breed: string;
}

// Проблема 5: отсутствие readonly для массива, который не нужно мутировать
function getFirst(items: string[]): string | undefined {
  items.sort();
  return items[0];
}

// Проблема 6: индексная сигнатура с any
interface AppState {
  [key: string]: any;
  user: any;
  theme: any;
}

function getState(state: AppState, key: string) {
  return state[key];
}
