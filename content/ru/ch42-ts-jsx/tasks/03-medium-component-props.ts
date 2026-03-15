/**
 * Задача: Извлечение и проверка типов пропсов компонента
 *
 * Создайте утилитный тип ExtractProps<T>, который извлекает тип пропсов
 * из функционального компонента (функции, принимающей props и возвращающей any).
 *
 * Реализуйте функцию validateProps, которая проверяет, что объект
 * содержит все обязательные ключи.
 */

/**
 * Утилитный тип: извлекает тип пропсов из функционального компонента.
 * Если T — функция вида (props: P) => any, вернуть P.
 * Иначе — never.
 *
 * Пример:
 *   type Props = ExtractProps<(props: { name: string }) => any>
 *   // Props = { name: string }
 */
export type ExtractProps<T> = unknown // TODO: реализуйте тип

/**
 * Результат валидации пропсов.
 */
export type ValidationResult<P> =
  | { valid: true; props: P }
  | { valid: false; missing: string[] }

/**
 * Проверяет, что объект содержит все указанные обязательные ключи.
 *
 * @param obj - проверяемый объект
 * @param requiredKeys - массив обязательных ключей
 * @returns { valid: true, props: obj } если все ключи присутствуют,
 *          { valid: false, missing: [...] } если какие-то отсутствуют
 */
export function validateProps<P extends Record<string, unknown>>(
  obj: Record<string, unknown>,
  requiredKeys: string[]
): ValidationResult<P> {
  // TODO: реализуйте функцию
}

/**
 * Создаёт фабрику для валидации пропсов конкретного компонента.
 *
 * @param requiredKeys - массив обязательных ключей пропсов
 * @returns функция-валидатор, принимающая объект и возвращающая ValidationResult
 */
export function createPropsValidator<P extends Record<string, unknown>>(
  requiredKeys: (keyof P & string)[]
): (obj: Record<string, unknown>) => ValidationResult<P> {
  // TODO: реализуйте функцию
}
