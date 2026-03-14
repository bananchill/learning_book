import { Callout } from '@book/ui'

# Шпаргалка: Декораторы TypeScript

## Типы декораторов

```typescript
// Класс: получает конструктор
function ClassDec(constructor: Function) { ... }

// Метод: получает прототип, имя, дескриптор
function MethodDec(target: any, key: string, desc: PropertyDescriptor) { ... }

// Свойство: получает прототип и имя
function PropDec(target: any, key: string) { ... }

// Параметр: получает прототип, имя метода, индекс параметра
function ParamDec(target: any, key: string, index: number) { ... }
```

## Фабрика декораторов

```typescript
function myDecorator(options: Options) {
  return function (target: any, key: string, desc: PropertyDescriptor) {
    // используем options
  }
}
```

## Порядок применения

```
Вычисление фабрик: сверху вниз
Применение декораторов: снизу вверх

@A   // вычисляется первым, применяется вторым
@B   // вычисляется вторым, применяется первым
class X {}
```

## reflect-metadata

```typescript
// Сохранить
Reflect.defineMetadata(key, value, target)
Reflect.defineMetadata(key, value, target, propertyKey)

// Получить
Reflect.getMetadata(key, target)
Reflect.getMetadata('design:type', target, propertyKey)

// Встроенные ключи (требуется emitDecoratorMetadata: true)
// design:type       — тип свойства
// design:paramtypes — типы параметров метода
// design:returntype — тип возвращаемого значения
```

<Callout type="info">
Для работы декораторов нужен `experimentalDecorators: true` в tsconfig. Для reflect-metadata — `emitDecoratorMetadata: true` и `import 'reflect-metadata'`.
</Callout>
