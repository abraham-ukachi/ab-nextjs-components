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
* @name: Layout rule + Joseph steering (0.1.13)
* @file: __tests__/layout-rule-0.1.13.test.tsx
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
import { afterEach, describe, expect, it, vi } from 'vitest'
// 🖼️ renderers
import { cleanup, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// 🧭 a French route: the app bar must strip `/fr` like the sidebar / navbar
vi.mock('next/navigation', () => ({ usePathname: () => '/fr/docs/hooks' }))
// 🧩 under test
import AbAppBar from '../ab-app-bar'
import AbSidebar from '../ab-sidebar'
import AbPackageCard from '../ab-package-card'
import AbIcon from '../ab-icon'
import ServerAbIcon from '../server/ab-icon'
import { scopeAbIconIds } from '../ab-icon/helpers'
import { AB_MAIN_SCROLLER_SELECTOR, getAbMainScroller } from '../ab-toc'
import { AbLinkProvider } from '../ab-link'
import type React from 'react'

afterEach(cleanup) // 🧹
// ⬛ a filled icon with a mask (same shape as ab-nextjs-icons `homeFilledMask`)
const HOME = { outlined: '<svg><path d="M0 0"/></svg>', filled: '<svg><defs><mask id="homeFilledMask"><rect/></mask></defs><path mask="url(#homeFilledMask)"/></svg>' }

describe('AbIcon per-instance mask ids (Joseph) 🆔', () => {
  it('two filled Homes on one page never share a mask id (client + server)', () => {
    for (const Icon of [AbIcon, ServerAbIcon]) {
      const html = renderToStaticMarkup(<><Icon name="home" svg={HOME} filled /><Icon name="home" svg={HOME} filled /></>)
      const ids = Array.from(html.matchAll(/id="([^"]+)"/g), (m) => m[1])
      expect(ids).toHaveLength(2) // 🆔 two masks
      expect(new Set(ids).size).toBe(2) // 🔀 unique
      for (const id of ids) expect(html).toContain(`url(#${id})`) // 🔗 each ref points at its own mask
    }
  })
  it('scopeAbIconIds rewrites declarations and refs, leaves id-free markup alone', () => {
    expect(scopeAbIconIds(HOME.filled, ':r7:')).toContain('id="homeFilledMask-r7"') // 🆔
    expect(scopeAbIconIds(HOME.filled, ':r7:')).toContain('url(#homeFilledMask-r7)') // 🎭
    expect(scopeAbIconIds(HOME.outlined, 'r1')).toBe(HOME.outlined) // 🙅
  })
})

describe('AbAppBar active link from the AbLinkProvider locales (Joseph) 🌍', () => {
  const nav = [{ href: '/docs', label: 'Docs' }, { href: '/blog', label: 'Blog' }]
  it('/fr/docs/hooks marks Docs when the provider knows `fr`', () => {
    const { container } = render(<AbLinkProvider component={(p: { href: string; children?: React.ReactNode }) => <a {...p} />} locales={['en', 'fr']}><AbAppBar nav={nav} /></AbLinkProvider>)
    expect(container.querySelector('a[aria-current="page"]')?.textContent).toBe('Docs') // 🎯
  })
  it('the `locales` prop works without a provider, and activeHref still wins', () => {
    const a = render(<AbAppBar nav={nav} locales={['fr']} />)
    expect(a.container.querySelector('a[aria-current="page"]')?.textContent).toBe('Docs') // 🎯
    cleanup()
    const b = render(<AbAppBar nav={nav} locales={['fr']} activeHref="/blog" />)
    expect(b.container.querySelector('a[aria-current="page"]')?.textContent).toBe('Blog') // ✋ explicit
  })
})

describe('AbPackageCard names wrap at hyphens (Joseph) 🧩', () => {
  it('puts a <wbr> after each hyphen, keeps the full name in title', () => {
    const html = renderToStaticMarkup(<AbPackageCard name="ab-nextjs-components" href="/docs/components" description="x" />)
    expect(html).toContain('ab-<wbr/>nextjs-<wbr/>components') // ✂️ break points
    expect(html).toContain('title="ab-nextjs-components"') // 🏷️
  })
})

describe('AbSidebar item keys (James nit) 🔑', () => {
  it('keys items by `id`, falling back to `href`, and still renders both same-href items', () => {
    const src = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../ab-sidebar/view.tsx'), 'utf8')
    expect(src).toMatch(/<li key=\{item\.id \?\? item\.href\}>/) // 🔑
    const html = renderToStaticMarkup(<AbSidebar sections={[{ id: 'a', items: [{ id: 'x', href: '/docs', label: 'Docs' }, { id: 'y', href: '/docs', label: 'Docs again' }] }]} />)
    expect(html).toContain('Docs again') // 🧱 both rendered
  })
})

describe('AbToc follows the main scroller (D35/G55) 📜', () => {
  it('getAbMainScroller ships: `ab-nextjs-components/ab-toc` export + files, and the root barrel (Joseph)', async () => {
    const pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '../package.json'), 'utf8'))
    expect(pkg.exports['./ab-toc']).toBe('./ab-toc/index.tsx') // 🚪 subpath
    expect(pkg.files).toContain('ab-toc') // 📦 packed
    const root = await import('../index') // 🌳 root barrel
    expect(typeof root.getAbMainScroller).toBe('function')
    expect(root.AB_MAIN_SCROLLER_SELECTOR).toBe('[data-ab-part="main-content"]')
  })
  it('no component calls getAbMainScroller during render (James nit: effects / handlers only)', () => {
    const base = join(dirname(fileURLToPath(import.meta.url)), '..')
    const walk = (d: string): string[] => readdirSync(d).flatMap((f) => { const p = join(d, f); return f === 'node_modules' || f === '__tests__' ? [] : statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(f) ? [p] : [] })
    for (const f of walk(base)) {
      const calls = readFileSync(f, 'utf8').split('\n').filter((l) => /getAbMainScroller\(/.test(l) && !/^\s*(\*|\/\/)/.test(l) && !/export function getAbMainScroller/.test(l))
      for (const l of calls) expect(l, f).toMatch(/useEffect|useLayoutEffect|onClick|=>/) // 🧭 inside an effect / handler only
    }
  })
  it('getAbMainScroller finds the core panes main pane, else null (= window)', () => {
    expect(getAbMainScroller()).toBeNull() // 🪟 no panes
    document.body.innerHTML = '<div data-ab-part="main-content"><h2 id="install"></h2></div>'
    const pane = document.querySelector<HTMLElement>(AB_MAIN_SCROLLER_SELECTOR)
    expect(getAbMainScroller()).toBe(pane) // 📜
    expect(getAbMainScroller(document.getElementById('install'))).toBe(pane) // 🎯 the pane holding it
    document.body.innerHTML = ''
  })
})
