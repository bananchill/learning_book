/**
 * Code Review: Найдите и исправьте проблемы в этом коде.
 *
 * Класс управления пользователями с множественными антипаттернами.
 * Найдите минимум 6 проблем.
 */

class UserManager {
  users: any[] = [];
  private static instance: any;

  // Проблема 1: нет модификаторов доступа, any-тип
  // Проблема 2: singleton через any

  constructor() {
    // Проблема 3: singleton без приватного конструктора
    if (UserManager.instance) {
      return UserManager.instance;
    }
    UserManager.instance = this;
  }

  // Проблема 4: any параметры, нет валидации
  addUser(name: any, email: any, role: any) {
    const user = {
      id: Math.random(), // Проблема 5: ненадёжная генерация ID
      name: name,
      email: email,
      role: role,
      createdAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  // Проблема 6: метод делает слишком много, any возвращаемый тип
  getUser(identifier: any): any {
    // Ищем по id ИЛИ по email ИЛИ по имени — неясная логика
    return this.users.find(
      (u) =>
        u.id === identifier ||
        u.email === identifier ||
        u.name === identifier
    );
  }

  // Проблема 7: мутация через публичный массив — можно обойти removeUser
  removeUser(id: number) {
    this.users = this.users.filter((u) => u.id !== id);
  }

  // Проблема 8: стрелочное поле вместо метода без причины, потеря наследуемости
  updateUser = (id: number, data: any) => {
    const user = this.getUser(id);
    if (user) {
      Object.assign(user, data); // Проблема 9: Object.assign без валидации
    }
    return user;
  };

  // Проблема 10: метод toString переопределён без override
  toString() {
    return `UserManager: ${this.users.length} users`;
  }
}

// Использование
const manager = new UserManager();
manager.addUser("Иван", "ivan@test.com", "admin");
manager.users.push({ name: "хакер" }); // обход addUser через публичный массив!
