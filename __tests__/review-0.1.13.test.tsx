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
* @name: 0.1.13 review + integration fixes (James, Joseph)
* @file: __tests__/review-0.1.13.test.tsx
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
import { cleanup, fireEvent, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ComponentType, ReactNode } from 'react'
// 🧭 a French route (Joseph #10)
vi.mock('next/navigation', () => ({ usePathname: () => '/fr/docs/hooks' }))
// 🧩 under test
import AbSearchTrigger from '../ab-search-trigger'
import AbButton from '../ab-button'
import AbNavbar from '../ab-navbar'
import AbSidebar from '../ab-sidebar'
import ServerAbSidebar from '../server/ab-sidebar'
import AbToc from '../ab-toc'
import AbPackageCard from '../ab-package-card'
import AbAppBar from '../ab-app-bar'
import { AbLinkProvider, stripAbLocalePrefix } from '../ab-link'
import { AbIconRegistrar } from '../ab-icon'
import { getRegisteredAbIcon } from '../ab-icon/helpers'

afterEach(cleanup) // 🧹
const root = join(dirname(fileURLToPath(import.meta.url)), '..') // 📁
const read = (rel: string) => readFileSync(join(root, rel), 'utf8') // 📄

describe('AbSearchTrigger (James #3, #4, D24a, Joseph #16) 🔎', () => {
  it('a plain /docs link shows no ⌘K and no aria-keyshortcuts', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger href="/docs" />) // 🖨️
    expect(html).toMatch(/^<a /) // 🔗
    expect(html).toContain('href="/docs"') // 🔗 D24a
    expect(html).not.toContain('aria-keyshortcuts') // 🚫
    expect(html).not.toContain('Ctrl') // 🚫 no hint
  })
  it('with a bound hotkey it shows the hint and announces it', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger onOpen={() => {}} />) // 🔘
    expect(html).toContain('aria-keyshortcuts="Meta+K Control+K"') // ♿
    expect(html).toContain('Ctrl') // ⌨️
  })
  it('shortcut={false} (alias of hotkey) hides it again', () => {
    expect(renderToStaticMarkup(<AbSearchTrigger onOpen={() => {}} shortcut={false} />)).not.toContain('aria-keyshortcuts') // 🔕
  })
  it('onOpen + href renders an <a>; JS intercepts a plain click and opens the dialog', () => {
    const onOpen = vi.fn() // 🔔
    const { container } = render(<AbSearchTrigger href="/search" onOpen={onOpen} />)
    const a = container.querySelector('a')! // 🔗 works with JS off
    expect(a.getAttribute('href')).toBe('/search')
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
    a.dispatchEvent(ev) // 🖱️
    expect(onOpen).toHaveBeenCalledTimes(1) // 🔔
    expect(ev.defaultPrevented).toBe(true) // 🚫 no navigation
    fireEvent.click(a, { metaKey: true }) // 🆕 new tab keeps the link
    expect(onOpen).toHaveBeenCalledTimes(1)
  })
  it('compact keeps the label for screen readers only', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger href="/docs" compact label="Search docs" />)
    expect(html).toContain('data-compact="true"') // 📱
    expect(html).toContain('Search docs') // ♿
  })
})

describe('AbButton pass-through + link padding (Joseph #7) 🔘', () => {
  it('forwards aria-* and data-* (useAbAsideToggle().props)', () => {
    const html = renderToStaticMarkup(<AbButton label="On this page" aria-expanded={false} aria-controls="ab-aside" data-testid="toc" />)
    expect(html).toContain('aria-expanded="false"') // ♿
    expect(html).toContain('aria-controls="ab-aside"') // ♿
    expect(html).toContain('data-testid="toc"') // 🗂️
  })
  it('the href variant gets real padding', () => {
    expect(read('ab-button/styles.module.css')).toMatch(/\.abButton\[data-type\] \{[^}]*padding: var\(--ab-button-padding/) // 📦 0.2.3: one rule for button + link
  })
})

describe('AbNavbar disabled + coming soon (Joseph #8) 🚧', () => {
  it('inert button items are aria-disabled, tagged, and never fire', () => {
    const onSelect = vi.fn()
    const { container } = render(<AbNavbar items={[{ kind: 'button', id: 'ai', icon: 'menu', label: 'Ask', onSelect, comingSoon: true }, { kind: 'button', id: 'x', icon: 'menu', label: 'X', onSelect, disabled: true }]} />)
    const [soon, off] = Array.from(container.querySelectorAll('button'))
    expect(soon.getAttribute('aria-disabled')).toBe('true') // 🚫
    expect(soon.textContent).toContain('Coming soon') // 🚧
    expect(off.getAttribute('aria-disabled')).toBe('true') // 🚫
    fireEvent.click(soon); fireEvent.click(off)
    expect(onSelect).not.toHaveBeenCalled() // 🔕
  })
})

describe('locale-stripped active state (Joseph #10) 🌍', () => {
  it('stripAbLocalePrefix only removes exact locale segments', () => {
    expect(stripAbLocalePrefix('/fr/docs/hooks', ['en', 'fr'])).toBe('/docs/hooks') // ✂️
    expect(stripAbLocalePrefix('/fr', ['fr'])).toBe('/') // 🏠
    expect(stripAbLocalePrefix('/fresh/x', ['fr'])).toBe('/fresh/x') // 🙅
    expect(stripAbLocalePrefix('/docs', [])).toBe('/docs') // 🙅
  })
  it('client sidebar + navbar read the locales from AbLinkProvider (or a prop)', () => {
    const A = ({ href, children, ...rest }: { href: string; children?: ReactNode }) => <a href={href} {...rest}>{children}</a> // 🔗 any link
    const html = renderToStaticMarkup(
      <AbLinkProvider component={A} locales={['en', 'fr']}>
        <AbSidebar sections={[{ id: 'd', items: [{ href: '/docs/hooks', label: 'Hooks' }] }]} />
        <AbNavbar items={[{ kind: 'link', href: '/docs/hooks', icon: 'menu', label: 'Hooks' }]} />
      </AbLinkProvider>,
    )
    expect(html.match(/aria-current="page"/g)?.length).toBe(2) // 🎯 both active under /fr
    expect(renderToStaticMarkup(<AbNavbar locales={['fr']} items={[{ kind: 'link', href: '/docs/hooks', icon: 'menu', label: 'H' }]} />)).toContain('aria-current="page"') // 🎯 prop
  })
  it('the server sidebar strips activeHref with `locales`', () => {
    expect(renderToStaticMarkup(<ServerAbSidebar activeHref="/fr/docs/hooks" locales={['fr']} sections={[{ id: 'd', items: [{ href: '/docs/hooks', label: 'Hooks' }] }]} />)).toContain('aria-current="page"')
  })
})

describe('AbLinkProvider structural generic (Joseph #9) 🔗', () => {
  it('accepts a link whose href is not a string, without a cast', () => {
    type IntlHref = string | { pathname: string; query?: Record<string, string> } // 🌍 next-intl style
    const IntlLink: ComponentType<{ href: IntlHref; locale?: string; children?: ReactNode }> = ({ children }) => <a>{children}</a>
    expect(renderToStaticMarkup(<AbLinkProvider component={IntlLink}><span>ok</span></AbLinkProvider>)).toBe('<span>ok</span>') // ✅ compiles + renders
  })
})

describe('server-safe icon registration (Joseph #11) 🗂️', () => {
  it('AbIconRegistrar registers during render and renders nothing', () => {
    const data = { outlined: '<svg viewBox="0 0 24 24"><path d="M0 0h1"/></svg>' }
    expect(renderToStaticMarkup(<AbIconRegistrar icons={{ reg_test_icon: data }} />)).toBe('') // 🫥
    expect(getRegisteredAbIcon('reg_test_icon')).toEqual(data) // ✅
    expect(read('ab-icon/registrar.tsx')).toMatch(/^'use client';$/m) // 🧭 a client boundary a Server Component can render
  })
})

describe('cards, toc, sidebar labels, snippet tokens, app bar (Joseph #3, #13–16) 🧩', () => {
  it('AbToc accepts `label` as an alias of `title`', () => {
    expect(renderToStaticMarkup(<AbToc label="Sur cette page" items={[{ id: 'a', label: 'A' }]} />)).toContain('Sur cette page') // 🏷️
  })
  it('AbPackageCard takes id + media, and names never wrap mid-name', () => {
    const html = renderToStaticMarkup(<AbPackageCard id="core" name="ab-nextjs-core" href="/docs/core" media={<span data-src="/x.png" />} />)
    expect(html).toContain('id="core"') // 🆔
    expect(html).toContain('data-src="/x.png"') // 🖼️
    expect(read('ab-package-card/styles.module.css')).toMatch(/\.abPackageCardName \{[^}]*overflow-wrap: anywhere; word-break: normal/) // ✂️ hyphens first, `anywhere` as the last resort (Joseph: never overflows the card)
    expect(read('ab-package-card/styles.module.css')).not.toMatch(/\.abPackageCardName \{[^}]*text-overflow: ellipsis/) // ✂️ never cut off
  })
  it('sidebar labels accept ReactNode and use label-large', () => {
    const html = renderToStaticMarkup(<AbSidebar collapsed sections={[{ id: 'p', items: [{ href: '/x', label: <code>ab-nextjs-core</code>, labelText: 'ab-nextjs-core' }] }]} />)
    expect(html).toContain('<code>ab-nextjs-core</code>') // 🧩
    expect(html).toContain('aria-label="ab-nextjs-core"') // ♿ rail name
    expect(read('ab-sidebar/styles.module.css')).toMatch(/--md-sys-typescale-label-large-size, 14px/) // 🔤
  })
  it('AbInstallSnippet uses the code-surface and code-font tokens', () => {
    const css = read('ab-install-snippet/styles.module.css')
    expect(css).toMatch(/background: var\(--ab-color-code-surface/) // 💻
    expect(css).toMatch(/color: var\(--ab-color-on-code-surface/) // 🖋️
    expect(css).toMatch(/font-family: var\(--ab-font-code/) // ⌨️
  })
  it('AbAppBar: compact phone layout + compactActions', () => {
    const html = renderToStaticMarkup(<AbAppBar brand="ab" actions={<b>wide</b>} compactActions={<i>small</i>} />)
    expect(html).toContain('data-has-compact-actions="true"') // 📱
    expect(html).toContain('<i>small</i>') // 👀
    expect(read('ab-app-bar/styles.module.css')).toMatch(/@media \(max-width: 767px\)/) // 📱
  })
})

describe("God's header on every code file 📝", () => {
  const walk = (dir: string): string[] => readdirSync(dir).flatMap((n) => {
    if (['node_modules', '.git', '__snapshots__', 'demo'].includes(n)) return [] // 🙅
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : (/\.(tsx?|mjs|js|css)$/.test(n) ? [p] : []) // 📄
  })
  for (const f of walk(root).map((p) => relative(root, p))) {
    it(f, () => {
      const head = read(f).slice(0, 4000) // 🔍 the header block
      expect(head).toContain('Copyright (c) 2026 Abraham Ukachi. The abElements Project.') // ©️
      expect(head).toContain('@authors: Abraham Ukachi <abrahamukachi@gmail.com>') // ✍️
    })
  }
})

// 🧪 WebKit findings (2026-10-20, 390 / 768 / 1280): the bar is exactly 64px, the closed More menu and the
//    install snippet never widen the page
describe('WebKit layout guards 📏', () => {
  it('AbAppBar has no block padding and a 64px min height', () => {
    const css = read('ab-app-bar/styles.module.css')
    expect(css).toMatch(/min-height: var\(--ab-app-bar-height, 64px\)/) // 📏
    expect(css).toMatch(/\.abAppBarMenu\[hidden\] \{ display: none; \}/) // 🙈
  })
  it('AbInstallSnippet keeps its border inside 100%', () => {
    expect(read('ab-install-snippet/styles.module.css')).toMatch(/\.root \{[^}]*box-sizing: border-box/) // 📦
  })
})
