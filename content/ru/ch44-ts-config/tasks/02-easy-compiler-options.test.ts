import { describe, it, expect } from 'vitest'
import {
  getRecommendedOptions,
  needsDeclaration,
  needsDOM,
} from './02-easy-compiler-options'

describe('getRecommendedOptions', () => {
  it('frontend — noEmit true, bundler, DOM', () => {
    const opts = getRecommendedOptions('frontend')
    expect(opts.target).toBe('ES2022')
    expect(opts.module).toBe('ESNext')
    expect(opts.moduleResolution).toBe('bundler')
    expect(opts.strict).toBe(true)
    expect(opts.esModuleInterop).toBe(true)
    expect(opts.isolatedModules).toBe(true)
    expect(opts.skipLibCheck).toBe(true)
    expect(opts.noEmit).toBe(true)
    expect(opts.declaration).toBe(false)
    expect(opts.lib).toContain('DOM')
    expect(opts.lib).toContain('ES2022')
  })

  it('node-lib — declaration true, NodeNext', () => {
    const opts = getRecommendedOptions('node-lib')
    expect(opts.module).toBe('NodeNext')
    expect(opts.moduleResolution).toBe('nodenext')
    expect(opts.declaration).toBe(true)
    expect(opts.sourceMap).toBe(true)
    expect(opts.noEmit).toBe(false)
    expect(opts.lib).not.toContain('DOM')
  })

  it('node-app — declaration false, NodeNext', () => {
    const opts = getRecommendedOptions('node-app')
    expect(opts.module).toBe('NodeNext')
    expect(opts.moduleResolution).toBe('nodenext')
    expect(opts.declaration).toBe(false)
    expect(opts.sourceMap).toBe(true)
    expect(opts.noEmit).toBe(false)
    expect(opts.lib).toEqual(['ES2022'])
  })

  it('все варианты имеют strict: true', () => {
    const types: Array<'frontend' | 'node-lib' | 'node-app'> = [
      'frontend',
      'node-lib',
      'node-app',
    ]
    for (const t of types) {
      expect(getRecommendedOptions(t).strict).toBe(true)
    }
  })
})

describe('needsDeclaration', () => {
  it('node-lib — нужна', () => {
    expect(needsDeclaration('node-lib')).toBe(true)
  })

  it('frontend — не нужна', () => {
    expect(needsDeclaration('frontend')).toBe(false)
  })

  it('node-app — не нужна', () => {
    expect(needsDeclaration('node-app')).toBe(false)
  })
})

describe('needsDOM', () => {
  it('frontend — нужен', () => {
    expect(needsDOM('frontend')).toBe(true)
  })

  it('node-lib — не нужен', () => {
    expect(needsDOM('node-lib')).toBe(false)
  })

  it('node-app — не нужен', () => {
    expect(needsDOM('node-app')).toBe(false)
  })
})
