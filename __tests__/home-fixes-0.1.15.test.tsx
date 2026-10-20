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
    expect(s).toMatch(/\.inlineItem \{[^}]*min-block-size: 48px/) // 👆
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
      const html = renderToStaticMarkup(<S sections={sections} logo={<img alt="Elements" src="/l.svg" />} header={<b>v</b>} />) // 🖼️
      expect(html).toMatch(/data-ab-part="sidebar-logo"><img alt="Elements"/) // 🏷️
      expect(html.indexOf('sidebar-logo')).toBeLessThan(html.indexOf('<b>v</b>')) // ⬆️ above the header
      expect(renderToStaticMarkup(<S sections={sections} />)).not.toContain('sidebar-logo') // 🫥 opt-in
    }
  })
  it('CSS: 60px (--ab-header-height) row, 0 20px', () => {
    expect(css('ab-sidebar/styles.module.css')).toMatch(/\.abSidebarLogo \{ flex: none; display: flex; align-items: center; box-sizing: border-box; height: var\(--ab-header-height, 60px\); padding: 0 20px; \}/) // 📏
  })
})
