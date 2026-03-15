// Код для ревью: найди проблемы с выводом типов и совместимостью

interface Animal {
  name: string;
  sound(): string;
}

interface Cat extends Animal {
  purr(): void;
}

interface Dog extends Animal {
  fetch(toy: string): void;
}

// 1. Функция пытается работать с массивом животных
function processAnimals(animals: any[]) {
  for (const animal of animals) {
    console.log(animal.name);
    animal.sound();
  }
}

// 2. Массив без явного типа
const pets = [];
pets.push({ name: "Мурка", sound: () => "мяу", purr: () => {} });
pets.push({ name: "Шарик", sound: () => "гав", fetch: (toy: string) => {} });

// 3. Обработчик событий с бивариантностью
interface BaseEvent {
  type: string;
}

interface ClickEvent extends BaseEvent {
  type: "click";
  x: number;
  y: number;
}

type EventHandler = {
  handle(event: BaseEvent): void;
};

function createClickHandler(): EventHandler {
  return {
    handle(event: ClickEvent) {
      // Используем x и y, но handler объявлен для BaseEvent
      console.log(event.x, event.y);
    },
  };
}

// 4. Unsound присваивание массивов
function addAnimal(animals: Animal[]) {
  animals.push({ name: "Рыбка", sound: () => "буль" });
}

const cats: Cat[] = [
  { name: "Мурка", sound: () => "мяу", purr() {} },
];

// Передаём Cat[] как Animal[] -- unsound!
addAnimal(cats);
// Теперь cats[1] не имеет метода purr()

// 5. Потеря информации о типе при as any
function getConfig(): { host: string; port: number } {
  const raw = fetchConfig() as any;
  return {
    host: raw.host,
    port: raw.port,
  };
}

function fetchConfig(): unknown {
  return JSON.parse('{"host": "localhost", "port": 3000}');
}

// 6. Неверный вывод типа возврата
function findAnimal(animals: Animal[], name: string) {
  const found = animals.find((a) => a.name === name);
  // Возвращает Animal | undefined, но используется как Animal
  return found.name;
}
