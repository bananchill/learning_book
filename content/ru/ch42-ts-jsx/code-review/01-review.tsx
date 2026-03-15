// Найдите проблемы в этом коде
// Задача: типобезопасные JSX-компоненты

// Проблема 1: any вместо типизированных пропсов
function UserCard(props: any) {
  return {
    type: 'div',
    props: { className: 'user-card' },
    children: [
      { type: 'h2', props: {}, children: [props.name] },
      { type: 'p', props: {}, children: [props.email] },
    ],
  }
}

// Проблема 2: отсутствует проверка children
function Container(props: { children: any }) {
  return {
    type: 'div',
    props: { className: 'container' },
    children: Array.isArray(props.children) ? props.children : [props.children],
  }
}

// Проблема 3: angle-bracket каст в .tsx (некорректно)
function getInput() {
  const el = document.getElementById('name')
  // В реальном .tsx это вызовет ошибку
  // const input = <HTMLInputElement>el
  const input = el as any
  return input.value
}

// Проблема 4: не типизированный spread
function Button(props: any) {
  const { label, ...rest } = props
  return {
    type: 'button',
    props: { ...rest },
    children: [label],
  }
}

// Проблема 5: дженерик без trailing comma в стрелочной функции .tsx
// const identity = <T>(x: T): T => x  // ошибка в .tsx
const identity = (x: any): any => x

export { UserCard, Container, getInput, Button, identity }
