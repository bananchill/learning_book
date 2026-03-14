// Напиши функцию getTypeInfo, которая возвращает информацию о типе значения
//
// Возвращает объект: { type: string, isNull: boolean }
// type — результат оператора typeof
// isNull — true только если значение строго равно null
//
// Примеры:
//   getTypeInfo(42)        → { type: 'number', isNull: false }
//   getTypeInfo('hello')   → { type: 'string', isNull: false }
//   getTypeInfo(null)      → { type: 'object', isNull: true }  ← особенность JS!
//   getTypeInfo(undefined) → { type: 'undefined', isNull: false }

export function getTypeInfo(value) {
  // Твой код здесь
}
