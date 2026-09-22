import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('ab-nextjs-components package smoke', () => {
  it('targets Next 16.3.4 peers and package metadata', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
    expect(pkg.name).toBe('ab-nextjs-components')
    expect(pkg.version).toBe('0.1.2')
    expect(pkg.type).toBe('module')
    expect(pkg.peerDependencies.next).toBe('16.3.4')
    expect(pkg.peerDependencies.react).toBe('^19')
    expect(pkg.peerDependencies['react-dom']).toBe('^19')
    expect(pkg.exports['.']).toBeTruthy()
  })

  it('exports supportedComponents catalog (7 Pending, no fake Done)', async () => {
    const mod = await import('../index')
    expect(Array.isArray(mod.supportedComponents)).toBe(true)
    expect(mod.supportedComponents).toHaveLength(7)
    expect(mod.supportedComponents.every((item) => item.status === 'Pending')).toBe(true)
    expect(mod.default.supportedComponents).toHaveLength(7)
  })

  it('splits catalog into 4 client and 3 server entries', async () => {
    const mod = await import('../index')
    expect(mod.supportedComponents.filter((item) => item.kind === 'client')).toHaveLength(4)
    expect(mod.supportedComponents.filter((item) => item.kind === 'server')).toHaveLength(3)
  })
})
