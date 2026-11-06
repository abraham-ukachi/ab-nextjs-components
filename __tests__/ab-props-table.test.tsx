/*
* @license MIT
* ~~~~~~~~~~~~
* ab-nextjs-components
* ~~~~~~~~~~~~
* Copyright (c) 2026 Abraham Ukachi. The abElements Project.
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the 'Software'), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*
* @project: ab-nextjs-components
* @name: AbPropsTable - Tests (unreleased)
* @file: __tests__/ab-props-table.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/

// @vitest-environment happy-dom
// 🧪 vitest
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
// 🖨️ the public entry must render without browser lifecycle code.
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// 🧩 under test
import AbPropsTable, { AB_PROPS_TABLE_DEFAULT_LABELS } from '../ab-props-table'
import type { AbPropsTableRow } from '../ab-props-table'
import * as pkg from '../index'

const root = join(__dirname, '..')
const source = (file: string) => readFileSync(join(root, file), 'utf8')
const rows: AbPropsTableRow[] = [
  { name: 'tone', type: "'soft' | 'solid'", default: { kind: 'value', value: "'soft'" }, description: 'Sets the surface.' },
]
afterEach(cleanup)

describe('AbPropsTable', () => {
  it('is a server-safe root/subpath export without client or raw-HTML hooks', () => {
    const entry = source('ab-props-table/index.tsx')
    expect(entry).not.toMatch(/^['"]use client['"]/m)
    expect(entry).not.toContain('dangerouslySetInnerHTML')
    expect(entry).not.toMatch(/\beval\s*\(/)
    expect(pkg.AbPropsTable).toBe(AbPropsTable)
    const manifest = JSON.parse(source('package.json'))
    expect(manifest.exports['./ab-props-table']).toBe('./ab-props-table/index.tsx')
    expect(manifest.files).toContain('ab-props-table')
    expect(renderToStaticMarkup(<AbPropsTable rows={rows} label="Button props" />)).toContain('<table')
  })

  it('renders a named caption, column/row headers and one focusable region', () => {
    const { container, getByRole, getAllByRole } = render(<AbPropsTable rows={rows} caption="Button properties" />)
    const region = getByRole('region', { name: 'Button properties' })
    expect(region.getAttribute('tabindex')).toBe('0')
    expect(container.querySelectorAll('[tabindex="0"]')).toHaveLength(1)
    expect(region.querySelector('caption')?.textContent).toBe('Button properties')
    expect(getAllByRole('columnheader').map((el) => el.textContent)).toEqual(['Name', 'Type', 'Default', 'Description'])
    expect(getByRole('rowheader', { name: 'tone' }).getAttribute('scope')).toBe('row')
    expect(container.querySelectorAll('td')).toHaveLength(3)
    expect(container.querySelectorAll('tr span')).toHaveLength(0)
  })

  it('uses an accessible visually-hidden caption when no visible caption is requested', () => {
    const { container, getByRole } = render(<AbPropsTable rows={rows} label="Properties" />)
    expect(container.querySelector('caption')?.className).toMatch(/srOnly/)
    expect(getByRole('region', { name: 'Properties' }).tagName).toBe('DIV')
  })

  it('distinguishes absent, unknown and explicit defaults', () => {
    const { container } = render(<AbPropsTable rows={[
      { name: 'none', type: 'string' },
      { name: 'unknown', type: 'string', default: { kind: 'unknown' } },
      { name: 'value', type: 'string', default: { kind: 'value', value: "'soft'" } },
    ]} />)
    const cells = container.querySelectorAll('tbody td:nth-child(3)')
    expect(cells[0].textContent).toBe('—No default')
    expect(cells[0].querySelector('[aria-hidden="true"]')?.textContent).toBe('—')
    expect(cells[1].textContent).toBe('unknown')
    expect(cells[2].querySelector('code')?.textContent).toBe("'soft'")
  })

  it('escapes HTML-like text in types, defaults and descriptions', () => {
    const attack = '<script>alert("x")</script>'
    const { container } = render(<AbPropsTable rows={[{ name: 'markup', type: attack, default: { kind: 'value', value: attack }, description: attack }]} />)
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelectorAll('code')[1].textContent).toBe(attack)
    expect(container.querySelectorAll('td')[2].textContent).toBe(attack)
    expect(renderToStaticMarkup(<AbPropsTable rows={[{ name: 'markup', type: attack }]} />)).toContain('&lt;script&gt;')
  })

  it('wraps long type values and keeps the table in its own scroller', () => {
    const long = 'VeryLongGenericType<'.repeat(30) + 'string>'
    const { container } = render(<AbPropsTable rows={[{ name: 'value', type: long }]} />)
    expect(container.querySelector('tbody td code')?.textContent).toBe(long)
    const css = source('ab-props-table/styles.module.css')
    expect(css).toContain('max-inline-size: 100%')
    expect(css).toContain('overflow-x: auto')
    expect(css).toContain('overflow-wrap: anywhere')
  })

  it('supports partial labels, column ordering and visibility', () => {
    const { container, getByRole } = render(<AbPropsTable
      rows={[{ name: 'lang', type: 'string', default: { kind: 'unknown' } }]}
      labels={{ name: 'Prop', unknownDefault: 'not extracted' }}
      columns={['type', 'name', 'default']}
    />)
    expect(container.querySelectorAll('thead th')[0].textContent).toBe('Type')
    expect(container.querySelectorAll('thead th')[1].textContent).toBe('Prop')
    expect(container.querySelectorAll('thead th')).toHaveLength(3)
    expect(container.querySelector('tbody td:nth-child(3)')?.textContent).toBe('not extracted')
    expect(getByRole('rowheader', { name: 'lang' }).tagName).toBe('TH')
    expect(AB_PROPS_TABLE_DEFAULT_LABELS.description).toBe('Description')
  })

  it('marks required and deprecated props without changing column semantics', () => {
    const { getByRole } = render(<AbPropsTable rows={[{ name: 'legacy', type: 'string', required: true, deprecated: 'Use tone.' }]} />)
    expect(getByRole('rowheader').textContent).toContain('Required')
    expect(getByRole('rowheader').textContent).toContain('Deprecated: Use tone.')
  })

  it('has light/dark scheme styles and cascadable token fallbacks', () => {
    const css = source('ab-props-table/styles.module.css')
    expect(css).toContain('color-scheme: light dark')
    expect(css).toContain("[data-theme='dark']")
    expect(css).toContain('@media (prefers-color-scheme: dark)')
    expect(css).toContain('var(--ab-color-border')
  })
})

  it('uses only custom properties supplied by the published theme', () => {
    const css = source('ab-props-table/styles.module.css') // 🎨 component tokens + fallbacks
    // 🚫 the locally defined aliases are not theme inputs; only their var() dependencies are.
    const themeVarNames = [...css.matchAll(/var\((--ab-(?!props-table-)[a-z0-9-]+)/g)].map((match) => match[1])
    const themeTokens = readFileSync(join(root, 'node_modules/ab-nextjs-theme/css/ab-tokens.css'), 'utf8')
    // 📦 0.3.9 supplies muted + accent-text (not consumer-invented text-muted/code-inline aliases).
    expect(themeTokens).toContain('--ab-color-muted:')
    expect(themeTokens).toContain('--ab-color-accent-text:')
    for (const name of new Set(themeVarNames)) {
      expect(themeTokens, `missing published theme token ${name}`).toContain(`${name}:`)
      expect(css, `${name} must retain its standalone fallback`).toMatch(new RegExp(`var\\(${name},`))
    }
  })
