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
* @name: Home fidelity variants 0.1.14 - Tests (P4–P19)
* @file: __tests__/home-variants-0.1.14.test.tsx
* @type: Vitest suite
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// @vitest-environment happy-dom
// 🏠 Joseph's P-items, one describe per item (values = the Home fidelity spec §4, measured in WebKit by
//    /workspace/home-shell/verify-fidelity/run-variants.cjs). Every block lands in the same commit as its change.
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbSearchTrigger from '../ab-search-trigger'
import AbThemeToggle from '../ab-theme-toggle'
import AbAppBar from '../ab-app-bar'

const css = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8') // 📄
afterEach(cleanup) // 🧹

// 🔎 P6
describe('P6 AbSearchTrigger variant="field" · size="sm" 🔎', () => {
  it('field: data hook, 18px icon, one "Ctrl K" cap on the server, label visible', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger variant="field" label="Search docs…" onOpen={() => {}} />)
    expect(html).toContain('data-variant="field"')
    expect(html).toMatch(/<kbd[^>]*>Ctrl K<\/kbd>/) // ⌨️ one cap (⌘ K on Apple after hydration)
    expect(html).toContain('Search docs…')
  })
  it('sm: "Search" + "CtrlK" cap, no space', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger size="sm" onOpen={() => {}} />)
    expect(html).toContain('data-size="sm"'); expect(html).toMatch(/<kbd[^>]*>CtrlK<\/kbd>/)
  })
  it('coming soon stays out of the field: tooltip + SR text only', () => {
    const { container } = render(<AbSearchTrigger variant="field" label="Search docs…" comingSoon />)
    const el = container.querySelector('[data-ab-part="search-trigger"]')!
    expect(el.getAttribute('title')).toBe('Coming soon') // 💬
    expect(el.textContent).toContain(', Coming soon') // 🗣️ announced
    expect(el.querySelector('[class*="Soon"]')).toBeNull() // 🚫 no painted tag
  })
  it('CSS: 36px, padding 0 6 0 10, radius 10, 13.5px faint; sm 34px pill; cap 20px radius 5 + 2px bottom', () => {
    const s = css('ab-search-trigger/styles.module.css')
    expect(s).toMatch(/width: var\(--ab-search-trigger-width, 300px\); max-width: 100%; height: 36px;/)
    expect(s).toMatch(/gap: 8px; padding: 0 6px 0 10px;/); expect(s).toMatch(/border-radius: var\(--ab-radius-button, 10px\);/)
    expect(s).toMatch(/font-size: 13\.5px;/); expect(s).toMatch(/height: 34px;/); expect(s).toMatch(/gap: 6px; padding: 0 6px 0 10px;/)
    expect(s).toMatch(/min-width: 20px; height: 20px; padding: 0 5px; margin-left: 2px;/); expect(s).toMatch(/border-bottom-width: 2px; border-radius: var\(--ab-radius-kbd, 5px\);/)
  })
})

// 🌗 P7
describe('P7 AbThemeToggle appearance="thumb" 🌗', () => {
  const labels = { group: 'Theme', light: 'Light', dark: 'Dark', system: 'System' }
  it('two radios, data-appearance, the active glyph is filled', () => {
    const { container } = render(<AbThemeToggle labels={labels} modes={['light', 'dark']} value="light" appearance="thumb" />)
    const g = container.querySelector('[role="radiogroup"]')!
    expect(g.getAttribute('data-appearance')).toBe('thumb'); expect(g.querySelectorAll('[role="radio"]')).toHaveLength(2)
    const on = g.querySelector('[aria-checked="true"]')!, off = g.querySelector('[aria-checked="false"]')!
    expect(on.innerHTML).toMatch(/filled|_fill1|FILL/i); expect(off.innerHTML).not.toMatch(/data-variant="filled"/)
  })
  it('CSS: padding 3, gap 2, --card2 pill, 28px segments, thumb bg/shadow, accent text', () => {
    const s = css('ab-theme-toggle/styles.module.css')
    expect(s).toMatch(/\.group\[data-appearance='thumb'\] \{\s*gap: 2px; padding: 3px;/); expect(s).toMatch(/background: var\(--ab-color-card2, #fbf3ec\)/)
    expect(s).toMatch(/\.segment \{ width: 28px; height: 28px; color: var\(--ab-color-faint/)
    expect(s).toMatch(/background: var\(--ab-color-thumb, #fff\); color: var\(--ab-color-accent-text/); expect(s).toMatch(/box-shadow: var\(--ab-shadow-thumb/)
  })
})

// 📏 P4 / P5 / P19
describe('P4/P5/P19 AbAppBar density="compact" · divider · moreMenu={false} 📏', () => {
  const nav = [{ href: '/docs', label: 'Docs' }, { href: '/packages', label: 'Packages' }]
  it('compact + divider + no More button', () => {
    const { container } = render(<AbAppBar brand={<b>Ab</b>} nav={nav} activeHref="/docs" density="compact" divider moreMenu={false} actions={<i />} />)
    const bar = container.querySelector('[data-ab-part="app-bar"]')!
    expect(bar.getAttribute('data-density')).toBe('compact'); expect(bar.getAttribute('data-more')).toBe('false')
    expect(bar.querySelector('[data-ab-part="app-bar-divider"]')?.getAttribute('aria-hidden')).toBe('true') // ➖ decorative
    expect(bar.querySelector('[aria-haspopup]')).toBeNull() // ⋮ gone
    // ➖ order: nav → divider → actions (mock: links, rule, GitHub)
    const kids = Array.from(bar.children).map((c) => c.tagName === 'NAV' ? 'nav' : c.getAttribute('data-ab-part') ?? 'x')
    expect(kids.indexOf('app-bar-divider')).toBe(kids.indexOf('nav') + 1)
  })
  it('defaults unchanged: More button still there', () => {
    const { container } = render(<AbAppBar nav={nav} />)
    expect(container.querySelector('[aria-haspopup="menu"]')).not.toBeNull()
    expect(container.querySelector('[data-density]')).toBeNull()
  })
  it('CSS: header-height, padding 22, gap 14, links 13.5/550 gap 20, brand 236 / 270, gapped transparent, mobile 0 8 0 16', () => {
    const c = css('ab-app-bar/styles.module.css')
    expect(c).toMatch(/height: var\(--ab-header-height, 60px\); min-height: 0; gap: 14px;/)
    expect(c).toMatch(/max\(22px, env\(safe-area-inset-left, 0px\)\)/)
    expect(c).toMatch(/font-size: 13\.5px; font-weight: 550; color: var\(--ab-color-muted/); expect(c).toMatch(/\.abAppBarNav ul \{ gap: 20px; \}/)
    expect(c).toMatch(/width: var\(--ab-app-bar-brand-width, 236px\)/); expect(c).toMatch(/--ab-app-bar-brand-width: 270px; padding-inline: 14px 12px; background: transparent;/)
    expect(c).toMatch(/\.abAppBarDivider \{ flex: none; width: 1px; height: 20px; background: var\(--ab-color-div/)
    expect(c).toMatch(/gap: 2px; padding-inline: max\(16px, env\(safe-area-inset-left, 0px\)\) max\(8px/)
    expect(c).toMatch(/:global\(\.AbSearchTrigger\):not\(\[data-size='sm'\]\) \{ width: 40px;/) // 📱 the sm pill keeps its label
  })
})
