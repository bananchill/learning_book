// Этот код содержит несколько проблем с асинхронностью.
// Найди и опиши все проблемы.

async function loadUserData(userId) {
  const user = await fetch(`/api/users/${userId}`).then(r => r.json())
  const posts = await fetch(`/api/posts?userId=${userId}`).then(r => r.json())
  const comments = await fetch(`/api/comments?userId=${userId}`).then(r => r.json())

  return { user, posts, comments }
}

async function processItems(items) {
  const results = []
  items.forEach(async (item) => {
    const result = await processItem(item)
    results.push(result)
  })
  return results
}

function fetchWithRetry(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url)
      resolve(response.json())
    } catch (e) {
      reject(e)
    }
  })
}

async function saveAll(items) {
  try {
    for (const item of items) {
      await save(item)
    }
  } catch (e) {
    // ошибка? ну ладно
  }
}
