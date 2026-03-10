import { describe, it, expect } from 'vitest'
import { createObjectPool } from './07-hard-gc-friendly'

describe('createObjectPool', () => {
  const factory = () => ({ x: 0, y: 0 })

  it('acquire создаёт объект через factory, если пул пуст', () => {
    const pool = createObjectPool(factory, 5)
    const obj = pool.acquire()
    expect(obj).toEqual({ x: 0, y: 0 })
  })

  it('release и acquire — переиспользуют объект', () => {
    const pool = createObjectPool(factory, 5)
    const obj1 = pool.acquire()
    obj1.x = 42
    pool.release(obj1)

    const obj2 = pool.acquire()
    expect(obj2).toBe(obj1) // тот же объект
    expect(obj2.x).toBe(42)
  })

  it('size отражает количество объектов в пуле', () => {
    const pool = createObjectPool(factory, 5)
    expect(pool.size()).toBe(0)

    const obj = pool.acquire()
    expect(pool.size()).toBe(0) // объект выдан, пул пуст

    pool.release(obj)
    expect(pool.size()).toBe(1)
  })

  it('не превышает maxSize', () => {
    const pool = createObjectPool(factory, 2)
    const objects = [pool.acquire(), pool.acquire(), pool.acquire()]

    objects.forEach(o => pool.release(o))
    expect(pool.size()).toBe(2) // maxSize = 2, третий отброшен
  })

  it('clear очищает пул', () => {
    const pool = createObjectPool(factory, 5)
    pool.release(pool.acquire())
    pool.release(pool.acquire())
    expect(pool.size()).toBe(2)

    pool.clear()
    expect(pool.size()).toBe(0)
  })

  it('после clear — acquire создаёт новые объекты', () => {
    const pool = createObjectPool(factory, 5)
    const obj1 = pool.acquire()
    pool.release(obj1)
    pool.clear()

    const obj2 = pool.acquire()
    expect(obj2).not.toBe(obj1)
  })
})
