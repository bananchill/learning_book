import { Callout, DeepDive } from '@book/ui'

# Паттерны условий

Профессиональный код избегает глубокой вложенности и сложных условных деревьев. Разберём три ключевых паттерна.

## Early Return (ранний возврат)

Проверяйте "плохие" случаи в начале функции и возвращайтесь сразу:

```javascript
// Плохо — вложенность растёт
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.isPaid) {
        // основная логика здесь
        return fulfillOrder(order);
      } else {
        return 'Не оплачен';
      }
    } else {
      return 'Пустой заказ';
    }
  } else {
    return 'Нет заказа';
  }
}

// Хорошо — flat, читаемый код
function processOrder(order) {
  if (!order) return 'Нет заказа';
  if (order.items.length === 0) return 'Пустой заказ';
  if (!order.isPaid) return 'Не оплачен';

  // основная логика — только здесь, в конце функции
  return fulfillOrder(order);
}
```

## Guard Clauses (защитные условия)

Guard clause — проверка пред-условия в начале функции. Документирует предположения:

```javascript
function withdraw(account, amount) {
  // Защитные условия — явно документируют инварианты
  if (!account) throw new Error('Аккаунт не передан');
  if (amount <= 0) throw new Error('Сумма должна быть положительной');
  if (amount > account.balance) throw new Error('Недостаточно средств');

  // Основная логика — выполняется только при всех соблюдённых условиях
  account.balance -= amount;
  return account.balance;
}
```

<Callout type="tip">
Guard clauses делают предположения функции явными. Читатель сразу видит: "что нужно для работы этого кода".
</Callout>

## Lookup Tables (таблицы соответствий)

Вместо длинного `switch` — объект-словарь:

```javascript
// Плохо — длинный switch
function getStatusText(status) {
  switch (status) {
    case 'active':   return 'Активен';
    case 'inactive': return 'Неактивен';
    case 'pending':  return 'Ожидает';
    case 'banned':   return 'Заблокирован';
    default:         return 'Неизвестно';
  }
}

// Хорошо — lookup table
const STATUS_LABELS = {
  active:   'Активен',
  inactive: 'Неактивен',
  pending:  'Ожидает',
  banned:   'Заблокирован',
};

function getStatusText(status) {
  return STATUS_LABELS[status] ?? 'Неизвестно';
}
```

**Преимущества lookup tables:**
- Данные отделены от логики
- Легко добавить новый вариант — не нужно трогать switch
- Можно вынести в конфиг, загрузить с сервера
- Проще тестировать

```javascript
// Lookup table с функциями — диспетчеризация
const HANDLERS = {
  click: handleClick,
  keydown: handleKeydown,
  scroll: handleScroll,
};

function handleEvent(event) {
  const handler = HANDLERS[event.type];
  if (handler) handler(event);
}
```

<DeepDive title="Когда lookup table лучше switch?">

Lookup table подходит когда значения статичны и хранятся как данные. Switch лучше когда:

1. Нужна сложная логика в каждом случае (не просто значение)
2. Нужен fall-through
3. Условия — диапазоны, а не конкретные значения

Признак для перехода: если `switch` содержит только `return 'строка'` — это кандидат на lookup table.

</DeepDive>
