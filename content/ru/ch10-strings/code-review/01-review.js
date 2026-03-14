// Код на ревью: функция форматирования имени пользователя
// Найдите проблемы и предложите улучшения

function formatUserName(firstName, lastName, title) {
  // Конкатенация через + — неудобно читать
  var fullName = '';

  if (title != null && title != '') {
    fullName = title + ' ' + firstName + ' ' + lastName;
  } else {
    fullName = firstName + ' ' + lastName;
  }

  // Обрезка пробелов — но только trim() не поможет при пустых аргументах
  fullName = fullName.trim();

  // Проверка на пустое имя — неполная
  if (fullName == '') {
    return 'Аноним';
  }

  return fullName;
}

// Проблемы: что если firstName или lastName — undefined?
// Что если содержат лишние пробелы?
console.log(formatUserName('Иван', 'Петров', 'Др.')); // 'Др. Иван Петров' ✓
console.log(formatUserName(undefined, 'Петров', ''));  // 'undefined Петров' ✗
console.log(formatUserName('', '', ''));               // 'Аноним' ✓
console.log(formatUserName('  Иван  ', 'Петров'));     // 'Иван   Петров' ✗ — лишние пробелы
