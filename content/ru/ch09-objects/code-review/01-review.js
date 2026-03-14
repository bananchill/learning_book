// Код на ревью: функция обновления профиля пользователя
// Найдите проблемы и предложите улучшения

function updateUserProfile(user, updates) {
  // Мутируем исходный объект — это может привести к проблемам
  user.name = updates.name;
  user.email = updates.email;
  user.age = updates.age;

  // Проверяем поле вручную для каждого свойства
  if (updates.settings != null) {
    user.settings = updates.settings;
  }

  return user;
}

// Использование
const user = {
  id: 1,
  name: 'Иван',
  email: 'ivan@example.com',
  age: 25,
  settings: { theme: 'dark', lang: 'ru' }
};

const updated = updateUserProfile(user, { name: 'Мария', email: 'maria@example.com' });

// После вызова user изменился! Это неожиданно
console.log(user === updated); // true — это один и тот же объект
console.log(user.age); // undefined — поле затёрто!
