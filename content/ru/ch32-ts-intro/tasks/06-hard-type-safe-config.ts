// Задание: создай типобезопасную систему конфигурации

// 1. Опиши интерфейс AppConfig:
//    - port: number
//    - host: string
//    - debug: boolean
//    - maxRetries: number
//    - apiUrl: string

// твой интерфейс здесь

// 2. Напиши функцию createConfig, которая принимает Partial<AppConfig>
// и возвращает полный AppConfig с дефолтными значениями:
//    port: 3000, host: "localhost", debug: false, maxRetries: 3, apiUrl: "http://localhost:3000/api"

export function createConfig(overrides: any): any {
  // твой код здесь
  return {};
}

// 3. Напиши функцию get, которая принимает AppConfig и ключ,
// и возвращает значение с правильным типом.
// Подсказка: используй keyof и дженерики

export function get(config: any, key: string): any {
  // твой код здесь
  return undefined;
}

// 4. Напиши функцию validate, которая проверяет конфиг:
//    - port должен быть от 1 до 65535
//    - host не должен быть пустой строкой
//    - maxRetries от 0 до 10
//    - apiUrl должен начинаться с http:// или https://
// Возвращает массив строк с ошибками (пустой, если всё ок)

export function validate(config: any): string[] {
  // твой код здесь
  return [];
}
