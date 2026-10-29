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
* @name: AbMobileHeader extra row + 3-state theme (0.2.3)
* @file: __tests__/mobile-header-row-theme-0.2.3.test.tsx
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
import { cleanup, fireEvent, render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbMobileHeader, { AB_MOBILE_HEADER_THEME_CYCLE } from '../ab-mobile-header'

afterEach(() => cleanup())
const theme = (c: HTMLElement) => c.querySelector<HTMLButtonElement>('[data-ab-part="mobile-header-theme"]')!

describe('🌗 AbMobileHeader: 3-state theme (Joseph, Welcome 0.2.21)', () => {
  it('cycles light → dark → system → light, showing and naming the target', () => {
    expect(AB_MOBILE_HEADER_THEME_CYCLE).toEqual(['light', 'dark', 'system']) // 🔁
    const cases: Array<[ 'light' | 'dark' | 'system', 'light' | 'dark' | 'system', string, string ]> = [
      ['light', 'dark', 'dark_mode', 'Switch to dark theme'],
      ['dark', 'system', 'computer', 'Use the system theme'],
      ['system', 'light', 'light_mode', 'Switch to light theme'],
    ]
    for (const [mode, next, icon, label] of cases) {
      const on = vi.fn(); const { container, unmount } = render(<AbMobileHeader logo="x" themeMode={mode} onThemeModeChange={on} />)
      const b = theme(container)
      expect(b.getAttribute('aria-label')).toBe(label) // ♿
      expect(b.querySelector('[data-icon]')!.getAttribute('data-icon')).toBe(icon) // 🔣
      expect(b.getAttribute('data-theme-mode')).toBe(mode) // 🧪
      fireEvent.click(b); expect(on).toHaveBeenCalledWith(next) // 🔁
      unmount()
    }
  })
  it('the system label is translatable; the 2-state API is unchanged when onThemeModeChange is absent', () => {
    const { container } = render(<AbMobileHeader logo="x" themeMode="dark" onThemeModeChange={() => {}} labels={{ toSystem: 'Thème du système' }} />)
    expect(theme(container).getAttribute('aria-label')).toBe('Thème du système') // 🇫🇷
    cleanup()
    const on = vi.fn(); const r = render(<AbMobileHeader logo="x" theme="light" onThemeChange={on} />)
    expect(theme(r.container).hasAttribute('data-theme-mode')).toBe(false) // 🌗 2-state
    fireEvent.click(theme(r.container)); expect(on).toHaveBeenCalledWith('dark')
  })
})

describe('➕ AbMobileHeader: an extra row shared with the main header (Joseph)', () => {
  it('row renders a second row under the 56px bar, marked for core to let the slot grow', () => {
    const { container } = render(<AbMobileHeader logo={<a href="/">logo</a>} onLanguage={() => {}} row={<span id="counter">02 / 09</span>} />)
    const root = container.querySelector('[data-ab-part="mobile-header"]')!
    expect(root.getAttribute('data-ab-header-extra')).toBe('true') // 📏
    expect(root.getAttribute('role')).toBe('group') // ♿ unchanged
    const [bar, row] = Array.from(root.children)
    expect(bar.getAttribute('data-ab-part')).toBe('mobile-header-bar') // 🧱 first
    expect(bar.querySelector('[data-ab-part="mobile-header-language"]')).not.toBeNull()
    expect(row.getAttribute('data-ab-part')).toBe('mobile-header-row') // ➕ second
    expect(row.querySelector('#counter')).not.toBeNull()
  })
  it('without a row the markup is the old single bar', () => {
    const { container } = render(<AbMobileHeader logo="x" onLanguage={() => {}} />)
    const root = container.querySelector('[data-ab-part="mobile-header"]')!
    expect(root.hasAttribute('data-ab-header-extra')).toBe(false)
    expect(root.querySelector('[data-ab-part="mobile-header-bar"]')).toBeNull() // 🫥
  })
  it('kit CSS: the stack is a column, the bar keeps 56px, the row is padded', () => {
    const css = readFileSync(join(__dirname, '..', 'ab-drawer/kit.module.css'), 'utf8')
    expect(css).toMatch(/\.mhStack \{ flex-direction: column; align-items: stretch; padding: 0; block-size: auto; \}/) // 🧱
    expect(css).toMatch(/\.mhBar \{[^}]*min-block-size: 56px;/) // 📏
    expect(css).toMatch(/\.mhRow \{[^}]*padding: 0 16px 8px;/) // ➕
  })
})
