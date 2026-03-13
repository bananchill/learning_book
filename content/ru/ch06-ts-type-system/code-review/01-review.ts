// Код для ревью: найди проблемы с типами

interface User {
  id: any
  name: string
  email: string
  role: string
}

function processUsers(data: any) {
  const users: User[] = data

  for (const user of users) {
    if (user.role == 'admin') {
      sendAdminNotification(user as any)
    }

    const displayName = user.name || 'Аноним'
    console.log(`${displayName} (${user.email})`)
  }
}

function sendAdminNotification(admin: { name: string; email: string }) {
  // Отправка уведомления
  fetch('/api/notify', {
    method: 'POST',
    body: JSON.stringify({ to: admin.email, name: admin.name })
  })
}

function getUserRole(user: User): string {
  switch (user.role) {
    case 'admin': return 'Администратор'
    case 'user': return 'Пользователь'
    case 'moderator': return 'Модератор'
  }
}

function parseApiResponse(response: any): User[] {
  return response.data.users
}
