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
* @name: Home fixes 0.1.15 - Tests
* @file: __tests__/home-fixes-0.1.15.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// @vitest-environment happy-dom
// 🏠 God 00:08 / Joseph fidelity-2: the four Home gaps. Every block lands in the same commit as its change.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbLocaleSwitcher from '../ab-locale-switcher'
import AbAppBar from '../ab-app-bar'
import AbSearchTrigger from '../ab-search-trigger'
import AbSidebar from '../ab-sidebar'
import ServerAbSidebar from '../server/ab-sidebar'
import { renderToStaticMarkup } from 'react-dom/server'

const css = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8') // 📄
afterEach(cleanup) // 🧹
const LOCALES = [{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }] as const

// 🧩 4. language list inside the mobile app drawer
describe('AbLocaleSwitcher presentation="inline" 🧩', () => {
  it('renders a labelled group of rows, no trigger and no menu', () => {
    const { getByRole, queryByRole, getAllByRole } = render(<AbLocaleSwitcher locales={LOCALES} current="en" label="Language" presentation="inline" onSelect={() => {}} />)
    const group = getByRole('group', { name: 'Language' }) // ♿
    expect(group.getAttribute('data-presentation')).toBe('inline') // 🧩
    expect(queryByRole('menu')).toBeNull() // 🚫 popover
    const rows = getAllByRole('button') // 🔘 no trigger: only the rows
    expect(rows).toHaveLength(2)
    expect(rows[0].getAttribute('aria-pressed')).toBe('true') // ✅ English
    expect(rows[1].getAttribute('lang')).toBe('fr') // 🗣️
  })
  it('button rows call onSelect; link rows mark aria-current + hreflang', () => {
    const onSelect = vi.fn() // 📣
    const a = render(<AbLocaleSwitcher locales={LOCALES} current="en" label="Language" presentation="inline" onSelect={onSelect} />)
    fireEvent.click(a.getAllByRole('button')[1]) // 🖱️
    expect(onSelect).toHaveBeenCalledWith('fr') // ✅
    a.unmount()
    const b = render(<AbLocaleSwitcher locales={LOCALES} current="fr" label="Language" presentation="inline" getHref={(c) => `/${c}`} />)
    const links = b.getAllByRole('link') // 🔗
    expect(links[1].getAttribute('aria-current')).toBe('true') // 🎯 Français
    expect(links[0].getAttribute('hreflang')).toBe('en') // 🌍
  })
  it('CSS: 48px rows, --tint active, motion-free', () => {
    const s = css('ab-locale-switcher/styles.module.css') // 🎨
    expect(s).toMatch(/\.inlineItem \{[^}]*block-size: 48px; min-block-size: 44px;/) // 👆 John: exactly 48, ≥ 44 hit area
    expect(s).toMatch(/\.inlineItem\[data-active='true'\] \{ background: var\(--ab-color-tint, #f4e7db\); color: var\(--ab-color-accent-text, #88603d\)/) // 🎯
  })
})

// 🔎 1. compact AbAppBar on mobile: "Search ⌘K" pill, not an icon circle
describe('AbAppBar compactSearch + AbSearchTrigger compactLabel 🔎', () => {
  it('compact density defaults to the pill; comfortable stays icon; the prop overrides', () => {
    const bar = (p: object) => render(<AbAppBar search={<AbSearchTrigger variant="field" label="Search docs…" compactLabel="Search" onOpen={() => {}} />} {...p} />).container.querySelector('header')!
    expect(bar({ density: 'compact' }).getAttribute('data-compact-search')).toBe('pill') // 💊
    cleanup()
    expect(bar({}).getAttribute('data-compact-search')).toBeNull() // 🔘 unchanged
    cleanup()
    expect(bar({ density: 'compact', compactSearch: 'icon' }).getAttribute('data-compact-search')).toBeNull() // 🔘 opt out
  })
  it('the trigger renders both labels; the short one is hidden by default (one accessible name off the app bar)', () => {
    const { container } = render(<AbSearchTrigger variant="field" label="Search docs…" compactLabel="Search" onOpen={() => {}} />)
    expect(container.querySelector('[data-ab-part="search-label"]')!.textContent).toBe('Search docs…') // 🏷️
    expect(container.querySelector('[data-ab-part="search-label-compact"]')!.textContent).toBe('Search') // 📱
    expect(css('ab-search-trigger/styles.module.css')).toMatch(/\.abSearchTriggerShort \{ display: none; \}/) // 🙈
    expect(container.querySelector('[data-ab-part="key-gap"]')).not.toBeNull() // ⌨️ "⌘ K" on desktop
  })
  it('CSS: below 768px the pill is 34px, pill radius, 13px, label swap, tight 18px cap; icon collapse skips the pill bar', () => {
    const s = css('ab-app-bar/styles.module.css') // 🎨
    expect(s).toMatch(/\.abAppBar:not\(\[data-compact-search='pill'\]\) \.abAppBarSearch > :global\(\.AbSearchTrigger\):not\(\[data-size='sm'\]\) \{ width: 40px;/) // 🔘
    const block = s.slice(s.indexOf("compactSearch=\"pill\" below 768px")) // 📏
    expect(block).toMatch(/height: 34px; gap: 6px; padding: 0 6px 0 10px;/)
    expect(block).toMatch(/border-radius: var\(--ab-radius-pill, 999px\); font-size: 13px;/)
    expect(block).toMatch(/\[data-ab-part='search-label-compact'\] \{ display: inline; \}/)
    expect(block).toMatch(/\[data-ab-part='key-gap'\] \{ display: none; \}/)
  })
})

// 🏷️ 2. the tablet sidebar logo row (core ≥ 0.2.1 decides where it shows)
describe('AbSidebar logo row 🏷️', () => {
  const sections = [{ id: 's', items: [{ href: '/', label: 'Home' }] }]
  it('client + server render data-ab-part="sidebar-logo" before the header, only when `logo` is set', () => {
    for (const S of [AbSidebar, ServerAbSidebar]) {
      const html = renderToStaticMarkup(<S sections={sections} logo={<span role="img" aria-label="Elements">E</span>} header={<b>v</b>} />) // 🖼️
      expect(html).toMatch(/data-ab-part="sidebar-logo"><span role="img" aria-label="Elements">/) // 🏷️
      expect(html.indexOf('sidebar-logo')).toBeLessThan(html.indexOf('<b>v</b>')) // ⬆️ above the header
      expect(renderToStaticMarkup(<S sections={sections} />)).not.toContain('sidebar-logo') // 🫥 opt-in
    }
  })
  it('CSS: 60px (--ab-header-height) row, 0 20px', () => {
    expect(css('ab-sidebar/styles.module.css')).toMatch(/\.abSidebarLogo \{ flex: none; display: flex; align-items: center; box-sizing: border-box; height: var\(--ab-header-height, 60px\); padding: 0 20px; \}/) // 📏
  })
})

// ✓ John 00:20 #1: the check is an 18px, 2px-stroke bronze glyph
describe('inline language list: check mark ✓', () => {
  it('18px svg, stroke 2, currentColor; #8b6340 light, --ab-color-accent dark', () => {
    const { container } = render(<AbLocaleSwitcher locales={LOCALES} current="en" label="Language" presentation="inline" onSelect={() => {}} />)
    const svg = container.querySelector('[data-ab-part="locale-check"]')! // ✓
    expect(svg.getAttribute('width')).toBe('18'); expect(svg.getAttribute('stroke-width')).toBe('2'); expect(svg.getAttribute('stroke')).toBe('currentColor')
    expect(container.querySelectorAll('[data-ab-part="locale-check"]')).toHaveLength(1) // 🎯 active row only
    const s = css('ab-locale-switcher/styles.module.css')
    expect(s).toMatch(/\.inlineCheck \{[^}]*color: var\(--ab-locale-check-color, #8b6340\)/) // 🥉
    expect(s).toMatch(/:global\(\.dark\) \.inlineCheck, :global\(\[data-theme='dark'\]\) \.inlineCheck \{ color: var\(--ab-locale-check-color, var\(--ab-color-accent, #c29a6f\)\); \}/) // 🌙
  })
})

// 📏 John 00:20 #2: rows exactly 48px, 8px apart
describe('inline language list: row rhythm 📏', () => {
  it('48px rows (44px floor), 20px line box, 8px list gap, bare <li>', () => {
    const s = css('ab-locale-switcher/styles.module.css')
    expect(s).toMatch(/\.inlineList \{ display: grid; gap: 8px;/) // ↕️
    expect(s).toMatch(/\.inlineList > li \{ display: block; margin: 0; padding: 0; line-height: 0; \}/) // 🧹
    expect(s).toMatch(/font-size: 16px; line-height: 20px;/) // 🔤
  })
})

// 🏷️ John 00:20 #3: the bottom-drawer title (package-owned h2) is Mulish 16/800; #5: 16px + safe-area bottom padding stays
describe('AbBottomDrawer title + padding 🏷️', () => {
  it('h2 = --ab-font-title (Mulish) 16/800; padding-bottom 16px + safe area', () => {
    const s = css('ab-bottom-drawer/styles.module.css')
    expect(s).toMatch(/\.abBottomDrawer h2 \{ font-family: var\(--ab-font-title, 'Mulish', inherit\); font-size: 16px; font-weight: 800;/) // 🔤
    expect(s).toMatch(/padding-bottom: calc\(16px \+ env\(safe-area-inset-bottom, 0px\)\);/) // 📱
  })
})

// ➖ John 00:20 #4: last-with-divider when mixed; no uppercase label when it's the only content
describe('inline language list: showLabel + divider ➖', () => {
  it('showLabel={false}: no label row, the group keeps its name via aria-label', () => {
    const { container, getByRole } = render(<AbLocaleSwitcher locales={LOCALES} current="en" label="Language" presentation="inline" showLabel={false} onSelect={() => {}} />)
    expect(getByRole('group', { name: 'Language' })).toBeTruthy() // ♿
    expect(container.textContent).not.toContain('Language') // 🙈 no visible label
  })
  it('divider: data hook + 1px --div rule above; off by default', () => {
    const a = render(<AbLocaleSwitcher locales={LOCALES} current="en" label="Language" presentation="inline" divider onSelect={() => {}} />)
    expect(a.getByRole('group').getAttribute('data-divider')).toBe('true') // ➖
    a.unmount()
    expect(render(<AbLocaleSwitcher locales={LOCALES} current="en" label="Language" presentation="inline" onSelect={() => {}} />).getByRole('group').getAttribute('data-divider')).toBeNull() // 🫥
    expect(css('ab-locale-switcher/styles.module.css')).toMatch(/\.inline\[data-divider='true'\] \{ margin-top: 8px; padding-top: 8px; border-top: 1px solid var\(--ab-color-div/) // 🎨
  })
})

// 🔁 James 00:22: switching presentation at runtime must not break the hook order
describe('AbLocaleSwitcher presentation switch 🔁', () => {
  it('menu → inline → menu re-renders without a hooks error', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {}) // 🤫 catch React warnings
    const P = (p: { presentation: 'menu' | 'inline' }) => <AbLocaleSwitcher locales={LOCALES} current="en" label="Language" onSelect={() => {}} {...p} />
    const r = render(<P presentation="menu" />)
    expect(r.container.querySelector('[aria-haspopup]')).not.toBeNull() // 🌐 trigger
    r.rerender(<P presentation="inline" />)
    expect(r.container.querySelector('[data-presentation="inline"]')).not.toBeNull() // 🧩
    r.rerender(<P presentation="menu" />)
    expect(r.container.querySelector('[aria-haspopup]')).not.toBeNull() // 🌐 back
    expect(err.mock.calls.flat().join(' ')).not.toMatch(/order of Hooks|Rendered (more|fewer) hooks/) // ✅
    err.mockRestore()
  })
})

// 🔗 God 00:37 #1: the mobile pill is a 114px link to /docs, no ⌘K, no hotkey
describe('AbAppBar searchCompact 🔗', () => {
  it('renders both slots (CSS picks); the compact one is an <a href="/docs"> with no key cap or shortcut', () => {
    const { container } = render(<AbAppBar density="compact" search={<AbSearchTrigger variant="field" label="Search docs…" onOpen={() => {}} />} searchCompact={<AbSearchTrigger size="sm" href="/docs" label="Search" />} />)
    const wide = container.querySelector('[data-when="wide"]')!, compact = container.querySelector('[data-when="compact"]')! // 🧩
    expect(wide.querySelector('button')).not.toBeNull() // 🔘 desktop dialog opener
    const a = compact.querySelector('a')! // 🔗
    expect(a.getAttribute('href')).toBe('/docs')
    expect(a.querySelector('kbd')).toBeNull() // ⌨️ no cap
    expect(a.getAttribute('aria-keyshortcuts')).toBeNull() // 🚫 no hotkey
  })
  it('without searchCompact nothing changes (no data-when)', () => {
    const { container } = render(<AbAppBar density="compact" search={<AbSearchTrigger variant="field" onOpen={() => {}} />} />)
    expect(container.querySelector('[data-when]')).toBeNull() // 🫥
  })
  it('CSS: compact slot hidden ≥ 768px, wide hidden below; 114px in a compact bar', () => {
    const s = css('ab-app-bar/styles.module.css')
    expect(s).toMatch(/\.abAppBarSearch\[data-when='compact'\] \{ display: none; \}/)
    expect(s).toMatch(/\.abAppBarSearch\[data-when='wide'\] \{ display: none; \}/)
    expect(s).toMatch(/width: var\(--ab-app-bar-compact-search-width, 114px\)/)
  })
})

// ♿ God 00:37 #3: the inline list has its own aria-label (default from `label`)
describe('inline language list: ariaLabel ♿', () => {
  it('defaults to the label (visible or not) and can be overridden', () => {
    const r = (p: object) => render(<AbLocaleSwitcher locales={LOCALES} current="en" label="Language" presentation="inline" onSelect={() => {}} {...p} />)
    expect(r({}).getByRole('group', { name: 'Language' })).toBeTruthy() // 🏷️ via the visible label
    cleanup()
    expect(r({ showLabel: false }).getByRole('group', { name: 'Language' })).toBeTruthy() // 🙈 label hidden, same name
    cleanup()
    const g = r({ ariaLabel: 'Choose a language' }).getByRole('group', { name: 'Choose a language' }) // ✍️ override
    expect(g.getAttribute('aria-labelledby')).toBeNull() // 🎯 one source of the name
  })
})

// 📝 James P2 (round 3): the double-⌘K pitfall is documented on `searchCompact`
describe('AbAppBar searchCompact docs', () => {
  it('warns that a hotkey trigger in both slots registers ⌘K twice', () => {
    const src = readFileSync(join(__dirname, '..', 'ab-app-bar', 'index.tsx'), 'utf8') // 📄
    expect(src).toMatch(/BOTH `search` and `searchCompact` registers ⌘K\s*\*?\s*twice/) // ⚠️
    expect(src).toMatch(/hotkey=\{false\}` to the other/) // 💡 the fix
  })
})
