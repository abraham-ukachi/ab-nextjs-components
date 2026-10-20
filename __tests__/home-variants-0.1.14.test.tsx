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
import AbSidebar from '../ab-sidebar'
import ServerAbSidebar from '../server/ab-sidebar'
import AbPackageCard from '../ab-package-card'
import AbInstallSnippet from '../ab-install-snippet'
import AbToc from '../ab-toc'
import AbNavbar from '../ab-navbar'
import ServerAbNavbar from '../server/ab-navbar'

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

// 🧭 P8 / P9
describe('P8/P9 AbSidebar density="compact" · activeShape="rounded" · badgeVariant="text" · outlined collapse 🧭', () => {
  const sections = [
    { id: 'top', items: [{ href: '/', icon: 'home', label: 'Home' }] },
    { id: 'pk', label: 'Packages', itemSize: 'sm' as const, items: [{ href: '/fonts', icon: 'match_case', label: 'Fonts', badge: 'v0.2.x' }] },
  ]
  it('client: data hooks, 18 / 16px icons, outlined ⏪ toggle with double arrows', () => {
    const { container } = render(<AbSidebar sections={sections} activeHref="/" density="compact" activeShape="rounded" badgeVariant="text" collapseButtonVariant="outlined" />)
    const nav = container.querySelector('nav')!
    expect(nav.getAttribute('data-density')).toBe('compact'); expect(nav.getAttribute('data-active-shape')).toBe('rounded'); expect(nav.getAttribute('data-badge')).toBe('text')
    expect(container.querySelector('[data-size="sm"]')?.textContent).toContain('Fonts') // 📏 packages rows
    const t = container.querySelector('[data-ab-part="collapse"]')!
    expect(t.getAttribute('data-variant')).toBe('outlined'); expect(t.getAttribute('aria-expanded')).toBe('true')
    expect(t.querySelector('svg')).not.toBeNull() // ⏪ the builtin double arrow resolves
    expect(container.querySelector('[data-active="true"] svg')?.getAttribute('width') ?? '18').toBe('18')
  })
  it('server twin renders the same hooks', () => {
    const html = renderToStaticMarkup(<ServerAbSidebar sections={sections} activeHref="/" density="compact" activeShape="rounded" badgeVariant="text" />)
    expect(html).toContain('data-density="compact"'); expect(html).toContain('data-size="sm"')
  })
  it('CSS: rows 32 / 30, padding 0 10, gap 10, 13.5/500, tint 650 radius 8, group 11/700/.06em, mono 10.5 meta, 32px outlined toggle', () => {
    const c = css('ab-sidebar/styles.module.css')
    expect(c).toMatch(/gap: 10px; min-height: 0; height: 32px; padding: 0 10px;/); expect(c).toMatch(/\[data-size='sm'\] \{ height: 30px; \}/)
    expect(c).toMatch(/font-size: 13\.5px; font-weight: 500;/)
    expect(c).toMatch(/background: var\(--ab-color-tint, #f4e7db\); color: var\(--ab-color-accent-text, #88603d\); font-weight: 650;/)
    expect(c).toMatch(/padding: 14px 10px 6px; font-size: 11px; font-weight: 700; line-height: 15px; letter-spacing: 0\.06em;/)
    expect(c).toMatch(/\.abSidebarSections \{ gap: 1px;/) // 📏 1px between every row and label (WebKit: rows at the mock's y)
    expect(c).toMatch(/font: 500 10\.5px var\(--ab-font-code/); expect(c).toMatch(/padding: 12px 10px 6px 16px;/); expect(c).toMatch(/padding: 4px 10px 16px;/)
    expect(c).toMatch(/\.abSidebarToggle\[data-variant='outlined'\] \{\s*width: 32px; height: 32px;/)
  })
})

// 📦 P10 (P11 `variant="all"` was dropped by D1)
describe('P10 AbPackageCard preview · title · descriptionLines · chips + arrow 📦', () => {
  it('Home layout: decorative preview, display title link, mono name, clamp, version + sage tag chips, arrow', () => {
    const { container } = render(<AbPackageCard name="ab-nextjs-animations" title="Animations" href="/docs/animations" preview={<span>curve</span>} icon={<svg />} description="Motion tokens" descriptionLines={2} version="0.2.x" tags={['beta']} />)
    const card = container.querySelector('[data-ab-part="package-card"]')!
    expect(card.getAttribute('data-variant')).toBe('home')
    expect(card.querySelector('[aria-hidden="true"]')?.textContent).toBe('curve') // 🖼️ decorative
    expect(card.querySelectorAll('a')).toHaveLength(1); expect(card.querySelector('h3 a')?.textContent).toBe('Animations') // 🔗 one link
    expect(card.querySelector('code')?.textContent).toBe('ab-nextjs-animations')
    expect((card.querySelector('p') as HTMLElement).style.getPropertyValue('--ab-package-card-lines')).toBe('2')
    const chips = Array.from(card.querySelectorAll('[data-ab-part="chip"]')).map((c) => [c.textContent, c.getAttribute('data-tone')])
    expect(chips).toEqual([['v0.2.x', 'accent'], ['beta', 'sage']])
  })
  it('legacy layout unchanged without preview / title', () => {
    expect(renderToStaticMarkup(<AbPackageCard name="ab-nextjs-hooks" href="/h" />)).not.toContain('data-variant="home"')
  })
  it('CSS: radius 14, padding 10 10 12, preview 56 r9, icon 30 r8, h3 14/800, name 11 mono, desc 12.5/1.45 min 36, mobile 8 8 10 r13 / 44', () => {
    const c = css('ab-package-card/styles.module.css')
    for (const re of [/padding: 10px 10px 12px; border: 1px solid var\(--ab-color-border/, /border-radius: var\(--ab-radius-card, 14px\)/, /height: 56px; border-radius: var\(--ab-radius-tile, 9px\)/,
      /width: 30px; height: 30px; border-radius: var\(--ab-radius-row, 8px\)/, /font-size: 14px; font-weight: 800; line-height: 1\.2;/, /font: 400 11px\/1\.3 var\(--ab-font-code/,
      /font-size: 12\.5px; line-height: 1\.45; color: var\(--ab-color-muted, #6b5b50\); min-height: 36px;/, /\.home \{ padding: 8px 8px 10px; border-radius: 13px; \}/, /\.homePreview \{ height: 44px; \}/,
      /translateY\(-1px\)/]) expect(c).toMatch(re)
  })
})

// 💻 P12
describe('P12 AbInstallSnippet variant="terminal" 💻', () => {
  const labels = { group: 'Install', copy: 'Copy command', copied: 'Copied' }
  it('copy button sits in the tab row but OUTSIDE the tablist; the package is highlighted; command text intact', () => {
    const { container } = render(<AbInstallSnippet pkg="ab-nextjs-core" labels={labels} variant="terminal" />)
    const root = container.querySelector('[data-ab-part="install-snippet"]')!
    expect(root.getAttribute('data-variant')).toBe('terminal')
    const list = root.querySelector('[role="tablist"]')!
    expect(list.querySelectorAll(':scope > :not([role="tab"])')).toHaveLength(0) // ♿ only tabs inside
    const copy = root.querySelector('button[aria-label="Copy command"]')!
    expect(copy.closest('[role="tabpanel"]')).toBeNull(); expect(list.parentElement!.contains(copy)).toBe(true) // 📋 head row
    expect(root.querySelector('code')!.textContent).toBe('pnpm add ab-nextjs-core') // 📋 one string
    expect(root.querySelector('code span')!.textContent).toBe('ab-nextjs-core') // 🖍️
    expect(copy.querySelector('.AbIcon, svg')?.closest('[style]')?.getAttribute('style') ?? '').toMatch(/16px/) // 📏 16px glyph (AbIconButton iconSize)
  })
  it('CSS: radius 12, tab row 6 8 0 10 + hairline, tabs 12/600 underline #c29a6f, pre 14 16 16 13.5/1.4, $ #8e7a69, pkg #e7c8a5, scrolls', () => {
    const c = css('ab-install-snippet/styles.module.css')
    for (const re of [/border-radius: var\(--ab-radius-code, 12px\)/, /padding: 6px 8px 0 10px;/, /border-bottom: 1px solid rgb\(255 232 210 \/ 0\.08\)/,
      /padding: 6px 8px 8px;/, /font-size: 12px; font-weight: 600; line-height: 17px; color: rgb\(237 224 212 \/ 0\.55\)/, /color: #e7c8a5; box-shadow: inset 0 -2px 0 #c29a6f/,
      /padding: 14px 16px 16px;[^}]*overflow-x: auto;/, /color: #8e7a69/, /\.termPkg \{ color: #e7c8a5; \}/, /font-size: 13\.5px; line-height: 1\.4; white-space: pre;/]) expect(c).toMatch(re)
  })
})

// 📑 P14
describe('P14 AbToc footer slot 📑', () => {
  it('renders a rule + the footer inside the nav, nothing without it', () => {
    const items = [{ id: 'overview', label: 'Overview' }]
    const html = renderToStaticMarkup(<AbToc items={items} activeId="overview" footer={<a href="/edit">Edit this page</a>} />)
    expect(html).toMatch(/<hr[^>]*\/?><div[^>]*data-ab-part="toc-footer"[^>]*><a href="\/edit">Edit this page<\/a><\/div><\/nav>/)
    expect(renderToStaticMarkup(<AbToc items={items} />)).not.toContain('toc-footer')
  })
  it('CSS: heading 11/700/.06em faint mb 10, links 13 padding 6 0 6 14, active 650 accent-text + accent rail, sep mt 18 mb 12, footer 12.5 + 15px icons', () => {
    const c = css('ab-toc/styles.module.css')
    for (const re of [/margin: 0 0 10px; font-size: 11px; font-weight: 700; line-height: 15px; letter-spacing: 0\.06em;/, /line-height: 18px;/, /font-size: 12\.5px; line-height: 17px;/, /\.abToc \{ font-size: 13px; \}/, /padding: 6px 0 6px 14px;/,
      /border-inline-start-color: var\(--ab-color-accent[^;]*; color: var\(--ab-color-accent-text[^;]*; font-weight: 650;/, /margin: 18px 0 12px;/, /font-size: 12\.5px;/, /width: 15px; height: 15px;/]) expect(c).toMatch(re)
  })
})

// 📱 P18
describe('P18 AbNavbar indicator="none" · blur 📱', () => {
  const items = [{ kind: 'link' as const, href: '/', icon: 'home', label: 'Home' }, { kind: 'link' as const, href: '/docs', icon: 'menu_book', label: 'Docs' }]
  for (const [n, Nav] of [['client', AbNavbar], ['server', ServerAbNavbar]] as const) {
    it(`${n}: data hooks + 25px icons`, () => {
      const html = renderToStaticMarkup(<Nav items={items} activeHref="/" indicator="none" blur />)
      expect(html).toContain('data-indicator="none"'); expect(html).toContain('data-blur="true"'); expect(html).toMatch(/width="25"|--ab-icon-size:\s*25px|size-25|25px/)
    })
  }
  it('CSS: 80px items, gap 3, 11.5/550 faint, active accent 700, no pill, blur 12 + 92% bg + div hairline, dark #1f170f', () => {
    const c = css('ab-navbar/styles.module.css')
    for (const re of [/width: 80px; min-width: 0; gap: 3px; color: var\(--ab-color-faint/, /font-size: 11\.5px; font-weight: 550;/, /color: var\(--ab-color-accent-text/,
      /\.abNavbarLink \.abNavbarPill \{ width: auto; height: auto; background: none; \}/, /backdrop-filter: blur\(12px\)/, /color-mix\(in srgb, var\(--ab-color-bg, #fff8f5\) 92%, transparent\)/, /border-top: 1px solid var\(--ab-color-div/, /#1f170f/]) expect(c).toMatch(re)
  })
})

// 🎨 step 5: existing components read the theme 0.3.5 Home tokens first (M3 tokens stay as fallbacks)
import { readdirSync, existsSync } from 'node:fs'
describe('existing components on the Home tokens 🎨', () => {
  const root = join(__dirname, '..') // 📁 component folders + server/ twins (one level deep each)
  const dirs = (base: string) => readdirSync(join(root, base), { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== 'node_modules').map((d) => (base ? `${base}/${d.name}` : d.name))
  const files = [...dirs(''), ...dirs('server')].map((d) => `${d}/styles.module.css`).filter((f) => existsSync(join(root, f)))
  it('found the CSS modules', () => expect(files.length).toBeGreaterThan(30))
  for (const f of files) {
    it(f, () => {
      const c = css(f)
      for (const line of c.split('\n').filter((l) => /\boutline(-color)?:/.test(l) && /--ab-color-primary/.test(l))) expect(line).toMatch(/var\(--ab-color-accent, /) // ♿ rings
      expect(c).not.toMatch(/(?<!--ab-color-border, )var\(--ab-color-outline-variant/) // ➖ borders
      expect(c).not.toMatch(/(?<!--ab-color-hover, )color-mix\(in srgb, currentColor (8|10)%, transparent\)/) // 🖱️ hovers
      expect(c).not.toMatch(/(?<!--ab-color-tint, )var\(--ab-color-secondary-container/) // 🎯 active rows
    })
  }
})

// 🎯 John 20:57: the mobile (thumb icon) toggle shows the TARGET mode
describe('AbThemeToggle icon shows the target mode 🎯', () => {
  const L = { group: 'Theme', light: 'Light', dark: 'Dark', system: 'System', switchTo: { dark: 'Switch to dark theme', light: 'Switch to light theme' } }
  it('thumb: moon + "Switch to dark theme" in light, sun + "Switch to light theme" in dark', () => {
    const a = render(<AbThemeToggle labels={L} modes={['light', 'dark']} value="light" variant="icon" appearance="thumb" />)
    const b1 = a.getByRole('button')
    expect(b1.getAttribute('aria-label')).toBe('Switch to dark theme') // ♿
    expect(b1.getAttribute('data-shows')).toBe('target') // 🎯
    expect(b1.innerHTML).toContain('dark_mode') // 🌙
    a.unmount()
    const b = render(<AbThemeToggle labels={L} modes={['light', 'dark']} value="dark" variant="icon" appearance="thumb" />)
    const b2 = b.getByRole('button')
    expect(b2.getAttribute('aria-label')).toBe('Switch to light theme') // ♿
    expect(b2.innerHTML).toContain('light_mode') // 🌞
  })
  it('fill appearance keeps showing the current mode unless iconShows="target"', () => {
    const a = render(<AbThemeToggle labels={L} modes={['light', 'dark']} value="light" variant="icon" />)
    expect(a.getByRole('button').getAttribute('aria-label')).toBe('Theme: Light') // ✅ unchanged
    a.unmount()
    const b = render(<AbThemeToggle labels={{ group: 'Theme', light: 'Light', dark: 'Dark', system: 'System' }} modes={['light', 'dark']} value="light" variant="icon" iconShows="target" />)
    expect(b.getByRole('button').getAttribute('aria-label')).toBe('Theme: Dark') // 🔙 fallback name
  })
})

// 🌿 John 20:57: the sage chip fallback text is AA (≥ 4.5:1) on its own tint over the card
describe('AbChip sage fallback AA 🌿', () => {
  it('fallback colour ≥ 4.5:1 on rgb(119 141 121 / 12%) over #fff and #fff8f5', () => {
    const src = css('ab-chip/styles.module.css') // 🎨
    const rule = src.match(/\.chip\[data-tone='sage'\]\s*\{([^}]*)\}/)![1] // 🔍
    expect(rule).toContain('rgb(119 141 121 / 0.12)') // 🎨 tint unchanged
    const fg = rule.match(/--ab-color-sage-accent,\s*(#[0-9a-f]{6})/i)![1] // 🖋️
    const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) // 🔢
    const lum = (c: number[]) => { const [r, g, b] = c.map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4 }); return 0.2126 * r + 0.7152 * g + 0.0722 * b } // 💡
    for (const bg of ['#ffffff', '#fff8f5']) {
      const tint = [119, 141, 121].map((t, i) => t * 0.12 + hex(bg)[i] * 0.88) // 🎨 flattened
      const [a, b] = [lum(hex(fg)), lum(tint)].sort((p, q) => q - p) // ⚖️
      expect((a + 0.05) / (b + 0.05), bg).toBeGreaterThanOrEqual(4.5) // ♿
    }
  })
})
