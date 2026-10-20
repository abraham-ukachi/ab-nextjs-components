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
* @name: AbAppBar + AbSearchTrigger + AbKbd - Tests (G43, G44)
* @file: __tests__/ab-app-bar.test.tsx
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
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
// 🧱 under test
import AbAppBar from '../ab-app-bar'
import AbSearchTrigger, { isAbApplePlatform } from '../ab-search-trigger'
import AbKbd from '../ab-kbd'

afterEach(cleanup) // 🧹
const css = (f: string) => readFileSync(join(__dirname, '..', f), 'utf8') // 📄

const nav = [{ href: '/docs', label: 'Docs' }, { href: '/components', label: 'Components' }]

describe('AbAppBar (G43)', () => {
  it('renders brand, search, nav with aria-current, actions, sticky hairline', () => {
    const html = renderToStaticMarkup(<AbAppBar brand={<b>ab</b>} search={<i>s</i>} nav={nav} activeHref="/docs/intro" actions={<u>a</u>} />)
    expect(html).toContain('data-ab-part="app-bar"') // 🧩
    expect(html).toContain('data-sticky="true"') // 📌
    expect(html.match(/aria-current="page"/g)).toHaveLength(2) // ♿ inline nav + the hidden More menu copy
    expect(css('ab-app-bar/styles.module.css')).toContain('var(--ab-divider-hairline') // ➖
  })
  it('"More" opens an AbMenu with the nav, closes on Escape and focuses the button again', () => {
    const { getByRole, container } = render(<AbAppBar nav={nav} />)
    const more = getByRole('button', { name: 'More' }) // ⋮
    const menu = container.querySelector(`#${more.getAttribute('aria-controls')}`)! // 📋
    expect(menu.tagName).toBe('MENU') // G26
    expect(menu.hasAttribute('hidden')).toBe(true) // 🙈
    fireEvent.click(more)
    expect(more.getAttribute('aria-expanded')).toBe('true') // ♿
    expect(menu.hasAttribute('hidden')).toBe(false) // 👁️
    expect(menu.textContent).toContain('Components') // 🧭
    fireEvent.keyDown(document, { key: 'Escape' }) // ⎋
    expect(menu.hasAttribute('hidden')).toBe(true)
    expect(document.activeElement).toBe(more) // ♿
  })
  it('CSS: More below 1180px only, hidden without JS', () => {
    const c = css('ab-app-bar/styles.module.css')
    expect(c).toMatch(/@media \(max-width: 1179px\) \{[\s\S]*?\.abAppBarMoreButton \{ display: inline-grid/) // 📱
    expect(c).toMatch(/\(scripting: none\)[\s\S]*?\.abAppBarMore \{ display: none/) // 🚫 JS
  })
})

describe('AbSearchTrigger + AbKbd (G44)', () => {
  it('detects Apple platforms', () => {
    expect(isAbApplePlatform({ platform: 'MacIntel' })).toBe(true) // 🍎
    expect(isAbApplePlatform({ userAgentData: { platform: 'Windows' } })).toBe(false) // 🪟
  })
  it('SSR: Ctrl hint, aria-keyshortcuts, dialog button', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger onOpen={() => {}} />)
    expect(html).toContain('aria-keyshortcuts="Meta+K Control+K"') // ♿
    expect(html).toContain('aria-haspopup="dialog"') // 🔘
    expect(html).toContain('>Ctrl</kbd>') // ⌨️ server default
    expect(html).toContain('ab-motion-interactive') // 🎬
  })
  it('⌘K / Ctrl+K calls onOpen', () => {
    const onOpen = vi.fn()
    render(<AbSearchTrigger onOpen={onOpen} />)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true }) // ⌨️
    fireEvent.keyDown(window, { key: 'K', metaKey: true }) // ⌨️
    expect(onOpen).toHaveBeenCalledTimes(2)
  })
  it('href fallback is a link; comingSoon is aria-disabled with no shortcut', () => {
    expect(renderToStaticMarkup(<AbSearchTrigger href="/search" />)).toMatch(/^<a[^>]*href="\/search"/) // 🔗
    const soon = renderToStaticMarkup(<AbSearchTrigger comingSoon />)
    expect(soon).toContain('aria-disabled="true"') // 🚧
    expect(soon).not.toContain('aria-keyshortcuts') // 🚫
    expect(soon).toContain('Coming soon') // 🏷️
  })
  it('AbKbd renders nested keys', () => {
    expect(renderToStaticMarkup(<AbKbd keys={['⌘', 'K']} />)).toMatch(/<kbd[^>]*><kbd[^>]*>⌘<\/kbd><kbd[^>]*>K<\/kbd><\/kbd>/) // ⌨️
  })
})
