# Proxy и Reflect

`Proxy` позволяет «обернуть» объект и перехватывать почти любые операции с ним: чтение, запись, удаление свойств, вызов, проверку `in` и многое другое. `Reflect` — его напарник, предоставляющий стандартные реализации этих операций.

import { Callout } from '@book/ui'

<Callout type="concept">
`new Proxy(target, handler)` — создаёт прокси для `target`. Каждый метод в `handler` — это «ловушка» (trap), перехватывающая конкретную операцию. Если ловушки нет — операция проходит к оригинальному объекту напрямую.
</Callout>

## Что изучим

- **[Proxy: ловушки и handler](/frontend/javascript/ch19-proxy/01-proxy-basics)** — get, set, has, deleteProperty и другие трапы
- **[Reflect API](/frontend/javascript/ch19-proxy/02-reflect)** — стандартные операции, правильное делегирование
- **[Практические паттерны](/frontend/javascript/ch19-proxy/03-practical-proxy)** — валидация, логирование, кэширование, иммутабельность
- **[Реактивность: Vue 3 под капотом](/frontend/javascript/ch19-proxy/04-reactivity)** — как Proxy лежит в основе `reactive()`
