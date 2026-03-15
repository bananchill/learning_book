// Code Review: найди проблемы с использованием утилитарных типов
// Представь, что этот код написал разработчик, который только начал изучать utility types.

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  createdAt: Date
}

// Проблема 1: ручное перечисление полей вместо Pick
interface UserPreview {
  id: number
  name: string
}

// Проблема 2: ручное определение вместо Omit
interface CreateUserDto {
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
}

// Проблема 3: any вместо Partial
function updateUser(id: number, updates: any): User {
  const user = getUserById(id)
  return { ...user, ...updates }
}

// Проблема 4: ручной объект вместо Record
const roleLabels: { [key: string]: string } = {
  admin: 'Администратор',
  user: 'Пользователь',
  moderator: 'Модератор'
}

// Проблема 5: дублирование типа вместо ReturnType
function fetchUsers(): Promise<User[]> {
  return fetch('/api/users').then(r => r.json())
}

// Тип дублирует определение fetchUsers
type FetchUsersResult = Promise<User[]>

// Проблема 6: ручная фильтрация union вместо Exclude
type NonAdminRole = 'user' | 'moderator'

// Проблема 7: отсутствие Readonly для конфигурации
const appConfig = {
  apiUrl: 'https://api.example.com',
  maxRetries: 3,
  timeout: 5000
}

// Кто-то случайно может мутировать конфиг
appConfig.maxRetries = -1

// Вспомогательная функция (не часть ревью)
function getUserById(id: number): User {
  return { id, name: 'Test', email: 'test@test.com', role: 'user', createdAt: new Date() }
}
