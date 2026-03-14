import { Callout, DeepDive } from '@book/ui'

# if / else if / else

`if` — самый базовый условный оператор JavaScript. Выполняет блок кода если условие истинно.

## Синтаксис

```javascript
// Простой if
if (temperature > 30) {
  console.log('Жарко!');
}

// if / else
if (score >= 60) {
  console.log('Сдал');
} else {
  console.log('Не сдал');
}

// if / else if / else
if (score >= 90) {
  console.log('Отлично');
} else if (score >= 70) {
  console.log('Хорошо');
} else if (score >= 60) {
  console.log('Удовлетворительно');
} else {
  console.log('Неудовлетворительно');
}
```

## Всегда используйте фигурные скобки

```javascript
// Плохо — кажется безобидным, но опасно
if (isLoggedIn)
  showDashboard();
  sendAnalytics(); // Эта строка выполняется ВСЕГДА, хотя выглядит как условная

// Хорошо — явно и надёжно
if (isLoggedIn) {
  showDashboard();
  sendAnalytics();
}
```

<Callout type="warning">
Никогда не опускайте фигурные скобки, даже для однострочных условий. Это предотвращает трудноуловимые баги при добавлении строк.
</Callout>

## Условие — любое выражение

Условие в `if` может быть любым выражением — JavaScript приведёт его к boolean:

```javascript
const users = [];
if (users.length) {         // 0 — falsy, поэтому else
  renderList(users);
} else {
  renderEmpty();
}

const user = getUser();
if (user) {                 // null/undefined — falsy
  showProfile(user);
}
```

## Вложенные условия и глубина

```javascript
// Плохо — глубокая вложенность ("pyramid of doom")
if (user) {
  if (user.isActive) {
    if (user.hasPermission('admin')) {
      performAdminAction();
    }
  }
}

// Хорошо — ранний возврат (см. главу о паттернах)
if (!user) return;
if (!user.isActive) return;
if (!user.hasPermission('admin')) return;
performAdminAction();
```

<DeepDive title="Приведение к boolean в условии if">

JavaScript выполняет `ToBoolean` преобразование для условия `if`. Следующие записи эквивалентны:

```javascript
if (value) { ... }
if (Boolean(value)) { ... }
if (!!value) { ... }
```

Единственный случай, где это может удивить: объекты всегда truthy, включая `new Boolean(false)` и `new Number(0)`. Но это крайне редкий сценарий.

</DeepDive>
