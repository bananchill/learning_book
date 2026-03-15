// Code Review: найди проблемы с использованием операторов типов
// Этот код написал разработчик, который только начал изучать keyof, typeof и T[K].

const API_ENDPOINTS = {
  users: '/api/users',
  posts: '/api/posts',
  comments: '/api/comments',
}

// Проблема 1: тип слишком широкий
function getEndpoint(name: string): string {
  return API_ENDPOINTS[name as keyof typeof API_ENDPOINTS]
}

// Проблема 2: дублирование типа вместо typeof
interface Config {
  host: string
  port: number
  debug: boolean
}

const defaultConfig = {
  host: 'localhost',
  port: 3000,
  debug: true,
}

function mergeConfig(overrides: Partial<Config>): Config {
  return { ...defaultConfig, ...overrides }
}

// Проблема 3: any вместо T[K]
function getField(obj: Record<string, any>, key: string): any {
  return obj[key]
}

// Проблема 4: ручное перечисление ключей
type StatusName = 'OK' | 'NOT_FOUND' | 'ERROR'

const STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404,
  ERROR: 500,
} as const

function getStatusCode(name: StatusName): number {
  return STATUS_CODES[name]
}

// Проблема 5: typeof от вызова функции
function createUser() {
  return { id: 1, name: 'Алиса', role: 'admin' as const }
}

// @ts-ignore — разработчик подавил ошибку вместо исправления
type User = ReturnType<any>

// Проблема 6: потеря литеральных типов
const ROLES = ['admin', 'editor', 'viewer']
type Role = string // хотел бы "admin" | "editor" | "viewer"

function isRole(value: string): boolean {
  return ROLES.includes(value)
}
