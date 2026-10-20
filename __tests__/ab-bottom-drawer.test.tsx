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
* @name: AbBottomDrawer - Tests
* @file: __tests__/ab-bottom-drawer.test.tsx
* @type: Vitest
* @authors: Abraham Ukachi <abrahamukachi@gmail.com>
*/

/*
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* MOTTO: We'll always do more 😜!!!
* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/


// @vitest-environment happy-dom

import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, within } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbBottomDrawer from '../ab-bottom-drawer'
import AbDrawerList from '../ab-drawer-list'
import AbLocaleSwitcher from '../ab-locale-switcher'

afterEach(() => { cleanup(); document.body.innerHTML = '' })

describe('AbBottomDrawer (D40) 📱', () => {
  it('is always an app-scope bottom AbDrawer with the sheet class and a handle', () => {
    render(<div className="AbAppLayout"><AbBottomDrawer open onClose={() => {}} title="Language" side="end"><p>x</p></AbBottomDrawer></div>)
    const dlg = document.querySelector('[role="dialog"]')!
    expect(dlg.getAttribute('data-side')).toBe('bottom') // ⬇️ even if a side is passed
    expect(dlg.closest('[data-scope]')?.getAttribute('data-scope')).toBe('app') // 🏠
    expect(dlg.classList.contains('AbBottomDrawer')).toBe(true)
    expect(dlg.className).toMatch(/withHandle/) // ➖
  })
  it('focuses the sheet on open, not the close button (John)', async () => {
    render(<div className="AbAppLayout"><AbBottomDrawer open onClose={() => {}} title="Language"><button>x</button></AbBottomDrawer></div>)
    await new Promise((r) => setTimeout(r, 400))
    expect(document.activeElement?.getAttribute('role')).toBe('dialog') // 🎯 the sheet
  })
  it('AbDrawerList renders into it via `as`; the locale switcher uses it for side="bottom"', () => {
    render(<div className="AbAppLayout"><AbDrawerList as={AbBottomDrawer} open onClose={() => {}} title="Sort" items={[{ value: 'a', label: 'A' }]} /></div>)
    expect(document.querySelector('[role="dialog"]')!.classList.contains('AbBottomDrawer')).toBe(true)
    cleanup(); document.body.innerHTML = ''
    const { container } = render(<div className="AbAppLayout"><AbLocaleSwitcher locales={[{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }]} current="en" label="Language" presentation="drawer" /></div>)
    fireEvent.click(container.querySelector('button[aria-haspopup]')!)
    const dlg = document.querySelector('[role="dialog"]') as HTMLElement
    expect(dlg.classList.contains('AbBottomDrawer')).toBe(true) // 📱
    expect(within(dlg).getByRole('button', { name: /Français/ })).toBeTruthy()
  })
  it('sheet CSS: 20px top radius, card surface, safe area, centred ≤560px from 768px', () => {
    const css = readFileSync(join(__dirname, '..', 'ab-bottom-drawer/styles.module.css'), 'utf8')
    expect(css).toMatch(/--ab-bottom-drawer-radius: 20px;/); expect(css).toMatch(/--ab-bottom-drawer-max-width: 560px;/)
    expect(css).toMatch(/background: var\(--ab-color-card, #fff\);/); expect(css).toMatch(/env\(safe-area-inset-bottom/)
    expect(css).toMatch(/@media \(min-width: 768px\)/)
    expect(css).toMatch(/padding-bottom: calc\(16px \+ env\(safe-area-inset-bottom, 0px\)\);/) // 📱 John
    expect(css).toMatch(/width: 36px; height: 4px; margin: 8px auto 0; border-radius: 2px;/) // ➖
    expect(css).toMatch(/var\(--ab-color-handle, rgb\(25 18 12 \/ 0\.18\)\)/)
    expect(css).toMatch(/border-top: 1px solid var\(--ab-color-sheet-edge, transparent\);/) // 🌙 edge
    expect(css).toMatch(/\[data-ab-part='drawer-close'\] \{ inline-size: 44px; block-size: 44px; border: 0; border-radius: 8px;/) // ✕
    expect(css).toMatch(/\[data-ab-part='drawer-close'\]:focus \{ outline: none; \}/); expect(css).toMatch(/:focus-visible \{ outline: 2px solid/) // ♿
    expect(readFileSync(join(__dirname, '..', 'ab-drawer/styles.module.css'), 'utf8')).toMatch(/var\(--ab-scrim-color, rgb\(25 18 12 \/ 0\.4\)\)/) // 🌫️
  })
})
