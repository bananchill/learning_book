/**
 * Задача: Валидирующий Proxy
 *
 * Реализуй функцию createValidated(target, schema), где:
 * - target — объект для хранения данных
 * - schema — объект { propName: validatorFn }
 *
 * Поведение:
 * - При записи свойства из schema: вызвать validator(value)
 *   - если вернул true — записать значение
 *   - если вернул false — бросить TypeError с сообщением
 *     "Invalid value for <propName>: <value>"
 * - При записи свойства не из schema — записывать без проверки
 * - Чтение работает нормально
 *
 * Примеры:
 *   const user = createValidated({}, {
 *     age: v => typeof v === 'number' && v >= 0 && v <= 150,
 *     email: v => typeof v === 'string' && v.includes('@')
 *   })
 *
 *   user.age = 25        // OK
 *   user.age = -5        // TypeError: Invalid value for age: -5
 *   user.email = 'a@b'  // OK
 *   user.email = 'bad'  // TypeError: Invalid value for email: bad
 *   user.name = 'Алиса' // OK — name не в schema
 */

export function createValidated(target, schema) {
  // твой код здесь
}
