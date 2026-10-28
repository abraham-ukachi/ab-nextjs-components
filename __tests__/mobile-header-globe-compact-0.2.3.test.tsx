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
* @name: AbMobileHeader globe wiring, link fallback, compact size (0.2.3)
* @file: __tests__/mobile-header-globe-compact-0.2.3.test.tsx
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
import { renderToStaticMarkup } from 'react-dom/server'
import { createRef } from 'react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbMobileHeader from '../ab-mobile-header'

afterEach(() => cleanup())
const globe = (c: ParentNode) => c.querySelector<HTMLElement>('[data-ab-part="mobile-header-language"]')!

describe('🌍 AbMobileHeader globe wiring (Joseph, Welcome 0.2.21)', () => {
  it('languageControls sets aria-controls and an always-present aria-expanded', () => {
    const { container, rerender } = render(<AbMobileHeader logo="x" onLanguage={() => {}} languageControls="lang-sheet" />)
    expect(globe(container).getAttribute('aria-controls')).toBe('lang-sheet') // 🔗
    expect(globe(container).getAttribute('aria-expanded')).toBe('false') // ♿ closed
    rerender(<AbMobileHeader logo="x" onLanguage={() => {}} languageControls="lang-sheet" languageExpanded />)
    expect(globe(container).getAttribute('aria-expanded')).toBe('true') // ♿ open
  })
  it('languageRef points at the globe (AbBottomDrawer trigger)', () => {
    const ref = createRef<HTMLButtonElement & HTMLAnchorElement>()
    const { container } = render(<AbMobileHeader logo="x" onLanguage={() => {}} languageRef={ref} />)
    expect(ref.current).toBe(globe(container)) // 📌
  })
  it('languageHref: a real link in the server HTML (no-JS works), upgraded to the sheet by onLanguage', () => {
    const html = renderToStaticMarkup(<AbMobileHeader logo="x" languageHref="/en/settings/language" />)
    expect(html).toMatch(/<a[^>]*href="\/en\/settings\/language"[^>]*data-ab-part="mobile-header-language"/) // 🧩
    expect(html).not.toMatch(/aria-haspopup/) // ♿ a plain link without JS wiring
    const onLanguage = vi.fn()
    const { container } = render(<AbMobileHeader logo="x" languageHref="/en/settings/language" onLanguage={onLanguage} languageControls="s" />)
    const a = globe(container)
    expect(a.tagName).toBe('A'); expect(a.getAttribute('aria-haspopup')).toBe('dialog') // ♿ JS: opens a dialog
    const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
    a.dispatchEvent(click)
    expect(onLanguage).toHaveBeenCalledTimes(1); expect(click.defaultPrevented).toBe(true) // 🛑 no navigation
    const newTab = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, metaKey: true })
    a.dispatchEvent(newTab); expect(newTab.defaultPrevented).toBe(false) // 🗂️ ⌘-click still opens the list
  })
  it('the old button API is unchanged (no aria-controls / aria-expanded unless asked)', () => {
    const { container } = render(<AbMobileHeader logo="x" onLanguage={() => {}} />)
    expect(globe(container).tagName).toBe('BUTTON')
    expect(globe(container).hasAttribute('aria-controls')).toBe(false); expect(globe(container).hasAttribute('aria-expanded')).toBe(false)
    fireEvent.click(globe(container))
  })
})

describe('📏 AbMobileHeader size="compact" (Welcome v6 mock: 48px bar)', () => {
  it('marks the header for core and adds the compact class; default stays 56px', () => {
    const { container } = render(<AbMobileHeader logo="x" size="compact" row={<span>01 / 09</span>} />)
    const root = container.querySelector('[data-ab-part="mobile-header"]')!
    expect(root.getAttribute('data-ab-header-size')).toBe('compact') // 📏
    expect(root.className).toMatch(/mhCompact/)
    cleanup()
    const r = render(<AbMobileHeader logo="x" />)
    expect(r.container.querySelector('[data-ab-part="mobile-header"]')!.hasAttribute('data-ab-header-size')).toBe(false) // 🫥
  })
  it('kit CSS: 48px bar with the mock\'s 18px start inset, with and without a row', () => {
    const css = readFileSync(join(__dirname, '..', 'ab-drawer/kit.module.css'), 'utf8')
    expect(css).toMatch(/\.mhCompact \{ min-block-size: 48px; padding-inline-start: 18px; \}/) // 📏
    expect(css).toMatch(/\.mhCompact > \.mhBar \{ min-block-size: 48px; padding-inline-start: 18px; \}/) // 🧱
  })
})
