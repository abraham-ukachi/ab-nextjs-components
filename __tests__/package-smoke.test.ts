import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const componentFiles = [
  'ab-icon/index.tsx',
  'ab-logo/index.tsx',
  'ab-button/index.tsx',
  'ab-icon-button/index.tsx',
  'ab-input/index.tsx',
  'ab-balloon/index.tsx',
  'ab-avatar/index.tsx',
  'ab-tab/index.tsx',
  'ab-tabs/index.tsx',
  'ab-menu/index.tsx',
  'ab-collapsible/index.tsx',
  'ab-color/index.tsx',
  'ab-info/index.tsx',
  'ab-like-button/index.tsx',
  'server/ab-icon/index.tsx',
  'server/ab-logo/index.tsx',
  'server/ab-button/index.tsx',
  'server/ab-avatar/index.tsx',
  'server/ab-badge/index.tsx',
]

describe('ab-nextjs-components package smoke', () => {
  it('targets Next 16.3.4 peers + soft peers', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    expect(pkg.name).toBe('ab-nextjs-components')
    expect(pkg.version).toBe('0.1.2')
    expect(pkg.type).toBe('module')
    expect(pkg.peerDependencies.next).toBe('16.3.4')
    expect(pkg.peerDependencies.react).toBe('^19')
    expect(pkg.peerDependencies.clsx).toBe('^2')
    expect(pkg.peerDependencies['ab-nextjs-hooks']).toBeTruthy()
    expect(pkg.exports['./ab-button']).toBe('./ab-button/index.tsx')
    expect(pkg.exports['./server/ab-logo']).toBe('./server/ab-logo/index.tsx')
  })

  it('exports supportedComponents catalog (19 Done)', async () => {
    const mod = await import('../index')
    expect(mod.supportedComponents).toHaveLength(19)
    expect(mod.supportedComponents.every((item) => item.status === 'Done')).toBe(true)
    expect(mod.supportedComponents.filter((item) => item.kind === 'client')).toHaveLength(14)
    expect(mod.supportedComponents.filter((item) => item.kind === 'server')).toHaveLength(5)
  })

  it('ships component entry files', () => {
    for (const file of componentFiles) {
      expect(existsSync(join(root, file))).toBe(true)
    }
  })

  it('keeps CSS modules free of @apply', () => {
    const cssFiles = [
      'ab-icon/styles.module.css',
      'ab-logo/styles.module.css',
      'ab-button/styles.module.css',
      'ab-icon-button/styles.module.css',
      'ab-input/styles.module.css',
      'ab-balloon/styles.module.css',
      'ab-avatar/styles.module.css',
      'ab-tab/styles.module.css',
      'ab-tabs/styles.module.css',
      'ab-menu/styles.module.css',
      'ab-collapsible/styles.module.css',
      'ab-color/styles.module.css',
      'ab-info/styles.module.css',
      'ab-like-button/styles.module.css',
      'server/ab-avatar/styles.module.css',
      'server/ab-badge/styles.module.css',
    ]
    for (const file of cssFiles) {
      const css = readFileSync(join(root, file), 'utf8')
      expect(css.includes('@apply')).toBe(false)
    }
  })
})
