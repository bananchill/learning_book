/**
 * Code Review: Система уведомлений с enum
 *
 * Этот код содержит несколько проблем, связанных с использованием enum.
 * Найдите все ошибки и предложите исправления.
 */

// Проблема 1: Гетерогенный enum -- смешаны числа и строки
enum NotificationType {
  Email = 0,
  SMS = "SMS",
  Push = 2,
  InApp = "IN_APP",
}

// Проблема 2: const enum экспортируется из модуля
export const enum Priority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
}

// Проблема 3: Числовой enum с невалидным присвоением
enum Status {
  Pending,
  Sent,
  Failed,
  Delivered,
}

function processNotification(type: NotificationType, priority: Priority): void {
  // Проблема 4: Нет exhaustive check
  switch (type) {
    case NotificationType.Email:
      console.log("Отправляем email");
      break;
    case NotificationType.SMS:
      console.log("Отправляем SMS");
      break;
    // Push и InApp не обработаны!
  }
}

// Проблема 5: Используется магическое число вместо enum
function updateStatus(notificationId: string, status: number): void {
  // status = 0, 1, 2, 3 -- что это значит?
  if (status === 0) {
    console.log("Ожидает отправки");
  } else if (status === 1) {
    console.log("Отправлено");
  }
}

// Проблема 6: Итерация по числовому enum без фильтрации reverse mapping
function getAllStatuses(): string[] {
  return Object.keys(Status);
  // Вернёт ["0", "1", "2", "3", "Pending", "Sent", "Failed", "Delivered"]
  // вместо ожидаемых только имён
}

// Проблема 7: Присвоение произвольного числа числовому enum
const myStatus: Status = 42; // Нет ошибки TypeScript!

export { NotificationType, Status, processNotification, updateStatus, getAllStatuses };
