import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const read = (rel: string) => readFileSync(join(root, rel), 'utf8')

describe('contributing fixes (0.1.6)', () => {
  it('AbSidebar is a <nav data-ab-part="sidebar"> (not <aside>)', () => {
    for (const file of ['ab-sidebar/index.tsx', 'server/ab-sidebar/index.tsx']) {
      const src = read(file)
      expect(src).toMatch(/<nav data-type=\{type\} data-ab-part="sidebar"/)
      expect(src).not.toMatch(/<aside\b/)
      expect(src).toMatch(/<\/nav>/)
    }
  })

  it('AbMenu exposes data-id for useAbMenu', () => {
    const src = read('ab-menu/index.tsx')
    expect(src).toMatch(/data-id=\{id\}/)
    expect(src).toMatch(/data-id=\{item\.id\}/)
    expect(src).toMatch(/['"]menu-item['"]/)
    expect(src).toMatch(/role="close-menu"/)
  })

  it('AbLogo defaults to a shipped data-URI logo (not a missing public path)', () => {
    for (const file of ['ab-logo/index.tsx', 'server/ab-logo/index.tsx']) {
      const src = read(file)
      expect(src).toMatch(/data:image\/svg\+xml,/)
      expect(src).not.toMatch(/\/ab-nextjs-icons\/logos\/ab-logo\.svg/)
    }
    expect(read('ab-logo/ab-logo.svg')).toMatch(/<svg/)
  })
})
