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
* @name: AbSearchTrigger shortcut / hotkey split tests (0.7.2, D49)
* @file: __tests__/search-trigger-0.7.2.test.tsx
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
// 🧱 DOM renderer + cleanup
import { cleanup, render } from '@testing-library/react'
// 🖨️ server renderer
import { renderToStaticMarkup } from 'react-dom/server'
// 🔎 under test
import AbSearchTrigger, { isAbApplePlatform } from '../ab-search-trigger'

// ⌨️ press a combo on the window, return the event
const press = (init: KeyboardEventInit, target: EventTarget = window) => { const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init }); target.dispatchEvent(e); return e }
// 🍎 pretend to be a Mac for one test (happy-dom reports Linux)
const asMac = () => Object.defineProperty(navigator, 'platform', { value: 'MacIntel', configurable: true })
// 🧹 unmount (= drop listeners) + restore the platform
afterEach(() => { cleanup(); Reflect.deleteProperty(navigator, 'platform'); document.body.innerHTML = '' })

describe('AbSearchTrigger shortcut / hotkey split (0.7.2, D49) ⌨️', () => {
  it('shortcut + hotkey={false}: shows the cap and announces it, but registers NO listener (the shell owns it)', () => {
    const onOpen = vi.fn() // 🔔
    const { container } = render(<AbSearchTrigger variant="field" onOpen={onOpen} shortcut hotkey={false} />) // 🔎
    const btn = container.querySelector('button')! // 🔘
    expect(btn.querySelector('kbd')).not.toBeNull() // 👀 the cap
    expect(btn.getAttribute('aria-keyshortcuts')).toBe('Control+K') // ♿ (non-Apple)
    press({ key: 'k', ctrlKey: true }) // ⌨️ Ctrl+K
    expect(onOpen).not.toHaveBeenCalled() // 🙅 no second listener
  })
  it('default (onOpen, no props): listens AND shows the cap, like 0.7.1', () => {
    const onOpen = vi.fn() // 🔔
    const { container } = render(<AbSearchTrigger onOpen={onOpen} />) // 🔎
    expect(container.querySelector('kbd')).not.toBeNull() // 👀
    expect(press({ key: 'k', ctrlKey: true }).defaultPrevented).toBe(true) // 🚫 browser search bar
    expect(onOpen).toHaveBeenCalledTimes(1) // 🔔
  })
  it('Ctrl+K from a text field still opens (hooks 0.1.9: a modifier combo fires in inputs by default)', () => {
    document.body.innerHTML = '<input id="q">' // 🔤 a field on the page
    const onOpen = vi.fn() // 🔔
    render(<AbSearchTrigger onOpen={onOpen} />) // 🔎 no explicit allowInInputs
    press({ key: 'k', ctrlKey: true }, document.getElementById('q')!) // ✍️
    expect(onOpen).toHaveBeenCalledTimes(1) // 🔔 same as 0.7.1
  })
  it('shortcut={false}: still listens, just hides the cap + announcement', () => {
    const onOpen = vi.fn() // 🔔
    const { container } = render(<AbSearchTrigger onOpen={onOpen} shortcut={false} />) // 🔎
    expect(container.querySelector('kbd')).toBeNull() // 🫥
    expect(container.querySelector('button')!.getAttribute('aria-keyshortcuts')).toBeNull() // 🔕
    press({ key: 'k', ctrlKey: true }) // ⌨️
    expect(onOpen).toHaveBeenCalledTimes(1) // 🔔
  })
  it('hotkey={false} alone: no cap, no listener (0.7.1 behaviour kept)', () => {
    const html = renderToStaticMarkup(<AbSearchTrigger onOpen={() => {}} hotkey={false} />) // 🖨️
    expect(html).not.toContain('<kbd') // 🫥
    expect(html).not.toContain('aria-keyshortcuts') // 🔕
  })
  it('two listening triggers (both app-bar slots) open ONCE per press', () => {
    const onOpen = vi.fn() // 🔔
    render(<><AbSearchTrigger onOpen={onOpen} /><AbSearchTrigger size="sm" onOpen={onOpen} /></>) // 👯
    press({ key: 'k', ctrlKey: true }) // ⌨️
    expect(onOpen).toHaveBeenCalledTimes(1) // ✅ the second binding skips the handled event
  })
  it('a plain link can show the cap with `shortcut` (the shell opens the drawer); comingSoon never does', () => {
    const link = renderToStaticMarkup(<AbSearchTrigger href="/docs" variant="field" shortcut />) // 🔗
    expect(link).toMatch(/^<a /); expect(link).toContain('<kbd'); expect(link).toContain('aria-keyshortcuts="Control+K"') // 👀 ♿
    const soon = renderToStaticMarkup(<AbSearchTrigger onOpen={() => {}} shortcut comingSoon />) // 🚧
    expect(soon).not.toContain('<kbd'); expect(soon).not.toContain('aria-keyshortcuts') // 🔕
  })
  it('Apple: ⌘ cap, aria-keyshortcuts="Meta+K", and ⌘K (not Ctrl+K) opens', () => {
    asMac() // 🍎
    expect(isAbApplePlatform({ platform: 'MacIntel' })).toBe(true) // 🍎 re-exported from hooks
    const onOpen = vi.fn() // 🔔
    const { container } = render(<AbSearchTrigger variant="field" onOpen={onOpen} />) // 🔎
    const btn = container.querySelector('button')! // 🔘
    expect(btn.querySelector('kbd')!.textContent).toBe('⌘ K') // 👀 the field cap ("⌘ K")
    expect(btn.getAttribute('aria-keyshortcuts')).toBe('Meta+K') // ♿
    press({ key: 'k', ctrlKey: true }) // ⌃K on a Mac
    expect(onOpen).not.toHaveBeenCalled() // 🙅 mod = ⌘ on Apple
    press({ key: 'k', metaKey: true }) // ⌘K
    expect(onOpen).toHaveBeenCalledTimes(1) // 🔔
  })
})
