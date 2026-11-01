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
* @name: AbMobileHeader search slot + theme glyph parity - Tests (0.3.2)
* @file: __tests__/mobile-header-search-glyph-0.3.2.test.tsx
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
// 🧩 the components under test
import AbMobileHeader from '../ab-mobile-header'
import AbThemeToggle from '../ab-theme-toggle'
import { AB_THEME_MODE_ICONS, AB_THEME_ICON_BUTTON_GLYPH } from '../ab-theme-mode'
import * as pkg from '../index'

afterEach(() => cleanup()) // 🧹
const labels = { group: 'Theme', light: 'Light', dark: 'Dark', system: 'System' } // 🏷️ toggle labels
const icon = (el: Element | null) => el!.querySelector('[data-icon]')! // 🔣 the AbIcon span
const parts = (c: HTMLElement) => Array.from(c.querySelectorAll('[data-ab-part^="mobile-header-"]')).map((e) => e.getAttribute('data-ab-part')) // 🗂️ order

// 🔎 Joseph (0.2.23 gaps): a search pill between the globe and the theme button
describe('🔎 AbMobileHeader `search` slot (0.3.2)', () => {
  it('renders the pill right BEFORE the theme button (after the globe)', () => {
    const { container } = render(<AbMobileHeader logo="x" onLanguage={() => {}} themeMode="light" onThemeModeChange={() => {}} search={<button type="button">Search</button>} />)
    expect(parts(container)).toEqual(['mobile-header-language', 'mobile-header-search', 'mobile-header-theme']) // ➡️ globe · search · theme
    expect(container.querySelector('[data-ab-part="mobile-header-search"] button')!.textContent).toBe('Search') // 🧩 the slot content
  })
  it('renders nothing extra without `search`', () => {
    const { container } = render(<AbMobileHeader logo="x" themeMode="light" onThemeModeChange={() => {}} />)
    expect(container.querySelector('[data-ab-part="mobile-header-search"]')).toBeNull() // 🚫
  })
  it('stays in the bar (not the row) when a row is set', () => {
    const { container } = render(<AbMobileHeader logo="x" themeMode="light" onThemeModeChange={() => {}} row={<i>row</i>} search={<b>s</b>} />)
    expect(container.querySelector('[data-ab-part="mobile-header-bar"] [data-ab-part="mobile-header-search"]')).not.toBeNull() // 🧱
  })
})

// 🌗 Joseph (0.2.23 gaps): AbThemeToggle's icon button shows the same glyph as the header's theme button
describe('🌗 theme glyph parity (0.3.2)', () => {
  it('one shared map; exported', () => {
    expect(AB_THEME_MODE_ICONS).toEqual({ light: 'light_mode', dark: 'dark_mode', system: 'brightness_auto' }) // 🔣
    expect(AB_THEME_ICON_BUTTON_GLYPH).toBe(24) // 📏
    expect(pkg.AB_THEME_MODE_ICONS).toBe(AB_THEME_MODE_ICONS) // 📦
  })
  for (const mode of ['light', 'dark', 'system'] as const) {
    it(`${mode}: same target glyph name + 24px size in the header and the thumb toggle`, () => {
      const h = render(<AbMobileHeader logo="x" themeMode={mode} onThemeModeChange={() => {}} />).container // 📱
      const t = render(<AbThemeToggle labels={labels} variant="icon" appearance="thumb" value={mode} />).container // 🌗
      const hi = icon(h.querySelector('[data-ab-part="mobile-header-theme"]')) // 🔣 header glyph
      const ti = icon(t.querySelector('[data-ab-part="theme-toggle"]')) // 🔣 toggle glyph
      expect(ti.getAttribute('data-icon')).toBe(hi.getAttribute('data-icon')) // ✅ same name
      expect(ti.getAttribute('style')).toContain('--ab-icon-size: 24px') // 📏 toggle
      expect(hi.getAttribute('style')).toContain('--ab-icon-size: 24px') // 📏 header
    })
  }
  it('the default (fill) icon button also uses the 24px glyph', () => {
    const t = render(<AbThemeToggle labels={labels} variant="icon" value="dark" />).container // 🔘
    expect(icon(t.querySelector('[data-ab-part="theme-toggle"]')).getAttribute('style')).toContain('--ab-icon-size: 24px') // 📏
  })
})
