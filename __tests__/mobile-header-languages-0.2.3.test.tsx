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
* @name: AbMobileHeader no-JS language list (0.2.3)
* @file: __tests__/mobile-header-languages-0.2.3.test.tsx
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
import { cleanup, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createRef } from 'react'
import AbMobileHeader, { type AbMobileHeaderLanguage } from '../ab-mobile-header'

afterEach(() => cleanup())
const LANGS: AbMobileHeaderLanguage[] = [
  { locale: 'en', label: 'English', href: '/en/welcome', current: true },
  { locale: 'fr', label: 'Français', href: '/fr/welcome' },
] // 🌍

describe('🧩 AbMobileHeader `languages`: no-JS <details> fallback (Joseph, Welcome 0.2.21)', () => {
  it('server HTML: a <details>/<summary> globe with real links, no popup ARIA (works without JS)', () => {
    const html = renderToStaticMarkup(<AbMobileHeader logo="x" languages={LANGS} onLanguage={() => {}} languageControls="lang" />)
    expect(html).toMatch(/<details[^>]*data-ab-part="mobile-header-languages"><summary/) // 🧩
    expect(html).toMatch(/<a href="\/fr\/welcome" hrefLang="fr" lang="fr">Français<\/a>/) // 🔗
    expect(html).toMatch(/<a href="\/en\/welcome" hrefLang="en" lang="en" aria-current="true">English<\/a>/) // ✅
    expect(html).not.toMatch(/aria-haspopup|aria-controls/) // ♿ native disclosure before JS
  })
  it('hydrated + onLanguage: the summary opens the sheet (no toggle) with aria-controls / aria-expanded', () => {
    const onLanguage = vi.fn(); const ref = createRef<HTMLButtonElement & HTMLAnchorElement>()
    const { container, rerender } = render(<AbMobileHeader logo="x" languages={LANGS} onLanguage={onLanguage} languageControls="lang" languageRef={ref} />)
    const summary = container.querySelector('summary')!
    expect(ref.current).toBe(summary) // 📌 trigger for AbBottomDrawer
    expect(summary.getAttribute('aria-haspopup')).toBe('dialog'); expect(summary.getAttribute('aria-controls')).toBe('lang') // 🔗
    expect(summary.getAttribute('aria-expanded')).toBe('false') // ♿
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    summary.dispatchEvent(click)
    expect(onLanguage).toHaveBeenCalledTimes(1) // 📱 the sheet
    expect(click.defaultPrevented).toBe(true) // 🛑 browsers skip the native <details> toggle (happy-dom toggles anyway)
    rerender(<AbMobileHeader logo="x" languages={LANGS} onLanguage={onLanguage} languageControls="lang" languageExpanded />)
    expect(container.querySelector('summary')!.getAttribute('aria-expanded')).toBe('true') // ♿ open
  })
  it('without onLanguage it stays a plain disclosure, and `languages` wins over `languageHref`', () => {
    const { container } = render(<AbMobileHeader logo="x" languages={LANGS} languageHref="/x" />)
    expect(container.querySelector('summary')!.hasAttribute('aria-haspopup')).toBe(false) // 🧩
    expect(container.querySelector('a[href="/x"]')).toBeNull() // 🥇 languages
  })
})
