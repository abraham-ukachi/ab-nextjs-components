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
* @name: AbThemeModeProvider shared theme state (0.2.3)
* @file: __tests__/theme-mode-provider-0.2.3.test.tsx
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
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { AbThemeModeProvider, useAbThemeModeContext } from '../ab-theme-mode'
import { AbThemeToggle } from '../ab-theme-toggle'
import AbMobileHeader from '../ab-mobile-header'
import * as pkg from '../index'

beforeEach(() => { localStorage.clear(); document.documentElement.className = ''; delete document.documentElement.dataset.theme })
afterEach(() => cleanup())
const L = { group: 'Theme', light: 'Light', dark: 'Dark', system: 'System' } // 🏷️
const tick = () => act(() => new Promise((r) => setTimeout(r, 0))) // ⏱️ effects
const checked = (c: HTMLElement) => c.querySelector('[role="radio"][aria-checked="true"]')?.getAttribute('aria-label') // 🎚️
const Probe = () => <output id="mode">{useAbThemeModeContext()?.mode ?? 'none'}</output>

// 🌗 laptop (segmented) + mobile header (3-state) on one page, like Joseph's Welcome across 768px
const Page = () => (
  <AbThemeModeProvider>
    <div id="laptop"><AbThemeToggle labels={L} /></div>
    <AbMobileHeader logo="x" />
    <Probe />
  </AbThemeModeProvider>
)
const mobileBtn = () => document.querySelector<HTMLButtonElement>('[data-ab-part="mobile-header-theme"]')!

describe('🌗 AbThemeModeProvider (Joseph, Welcome 0.2.21)', () => {
  it('the mobile header picks up the shared 3-state cycle with no theme props', async () => {
    render(<Page />); await tick()
    expect(mobileBtn().getAttribute('data-theme-mode')).toBe('light') // 🧠 shared
    expect(mobileBtn().getAttribute('aria-label')).toBe('Switch to dark theme') // 🎯 next
  })
  it('a change on mobile shows on the laptop toggle, and the other way round (no drift)', async () => {
    const { container } = render(<Page />); await tick()
    act(() => { fireEvent.click(mobileBtn()) }); await tick() // 📱 → dark
    expect(document.getElementById('mode')!.textContent).toBe('dark')
    expect(checked(container.querySelector('#laptop')!)).toMatch(/Dark/) // 💻 follows
    act(() => { fireEvent.click(container.querySelector('#laptop [role="radio"]:last-child')!) }); await tick() // 💻 → system
    expect(mobileBtn().getAttribute('data-theme-mode')).toBe('system') // 📱 follows
  })
  it('persists under the engine key and applies to <html>', async () => {
    render(<Page />); await tick()
    act(() => { fireEvent.click(mobileBtn()) }); await tick()
    expect(localStorage.getItem('theme')).toBe('dark') // 💾
    expect(document.documentElement.dataset.theme).toBe('dark') // 🖌️
  })
  it('reads a saved mode on mount', async () => {
    localStorage.setItem('theme', 'system')
    render(<Page />); await tick()
    expect(mobileBtn().getAttribute('data-theme-mode')).toBe('system') // 📖
  })
  it('without a provider nothing changes: context is null and explicit props still win', async () => {
    render(<><Probe /><AbMobileHeader logo="x" theme="dark" onThemeChange={() => {}} /></>); await tick()
    expect(document.getElementById('mode')!.textContent).toBe('none') // 🫥
    expect(mobileBtn().hasAttribute('data-theme-mode')).toBe(false) // 🌗 2-state
  })
  it('is exported from the package root', () => {
    expect(pkg.AbThemeModeProvider).toBe(AbThemeModeProvider); expect(pkg.useAbThemeModeContext).toBe(useAbThemeModeContext) // 📦
  })
})
