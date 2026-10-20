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
* @name: AbSettingsDrawer tests
* @file: __tests__/ab-settings-drawer.test.tsx
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
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbSettingsDrawer from '../ab-settings-drawer'
import { AB_DRAWER_DURATION } from '../ab-drawer'
import * as pkg from '../index'

const LOCALES = [{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }, { code: 'es', label: 'Español' }, { code: 'ru', label: 'Русский' }]
const stubMedia = (mobile: boolean) => vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('max-width: 767px') ? mobile : false, media: q, addEventListener: () => {}, removeEventListener: () => {} }))
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = () => act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) })
const mount = (over: Record<string, unknown> = {}) => {
  const p = { onClose: vi.fn(), onThemeChange: vi.fn(), onLocaleChange: vi.fn() }
  render(<div className="AbAppLayout"><main data-ab-part="main"><AbSettingsDrawer open theme="light" locales={LOCALES} locale="en" {...p} {...over} /></main></div>)
  flush()
  return p
}

describe('AbSettingsDrawer (drawers v2 §1) ⚙️', () => {
  it('a modal dialog labelled "Settings", tier sheet, with Theme + Language radiogroups only', () => {
    stubMedia(true); mount()
    const dlg = document.querySelector('[role="dialog"]')!
    expect(dlg.getAttribute('aria-modal')).toBe('true')
    expect(document.getElementById(dlg.getAttribute('aria-labelledby')!)!.textContent).toBe('Settings') // 🏷️
    expect(document.querySelector('[data-tier="sheet"]')).not.toBeNull() // 🥞
    const groups = Array.from(document.querySelectorAll('[role="radiogroup"]')).map((g) => document.getElementById(g.getAttribute('aria-labelledby')!)!.textContent)
    expect(groups).toEqual(['Theme', 'Language']) // 🎚️ 🌍
    expect(dlg.textContent).not.toMatch(/Reduce animations|Text size|About/) // 🚫 God 01:22: dropped
  })
  it('theme: Light / Dark / System radios with aria-checked; click + arrows pick', () => {
    stubMedia(true); const p = mount()
    const radios = Array.from(document.querySelectorAll('[data-ab-part="settings-theme"] [role="radio"]'))
    expect(radios.map((r) => [r.getAttribute('data-value'), r.getAttribute('aria-checked'), /(Light|Dark|System)$/.exec(r.textContent ?? '')?.[1]])).toEqual([['light', 'true', 'Light'], ['dark', 'false', 'Dark'], ['system', 'false', 'System']]) // 🔣 the icon fallback text comes first
    fireEvent.click(radios[1]); expect(p.onThemeChange).toHaveBeenLastCalledWith('dark') // 🖱️
    fireEvent.keyDown(radios[0], { key: 'ArrowRight' }); expect(p.onThemeChange).toHaveBeenLastCalledWith('dark') // ⌨️
    fireEvent.keyDown(radios[0], { key: 'End' }); expect(p.onThemeChange).toHaveBeenLastCalledWith('system')
  })
  it('language rows: own lang, the checked one has the check; focus lands on it at open', () => {
    stubMedia(true); const p = mount()
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-ab-part="settings-language"] [role="radio"]'))
    expect(rows.map((r) => r.getAttribute('lang'))).toEqual(['en', 'fr', 'es', 'ru']) // 🌍
    expect(rows[0].getAttribute('aria-checked')).toBe('true')
    expect(rows[0].querySelector('svg')).not.toBeNull() // ✓
    expect(rows[1].querySelector('svg')).toBeNull()
    expect(document.activeElement).toBe(rows[0]) // 🎯 spec: the checked language
    fireEvent.click(rows[2]); expect(p.onLocaleChange).toHaveBeenLastCalledWith('es')
  })
  it('handle: "Expand settings" / aria-expanded on mobile; centred on laptop', () => {
    stubMedia(true); mount()
    const h = document.querySelector('button[data-ab-part="drawer-handle"]')!
    expect(h.getAttribute('aria-label')).toBe('Expand settings'); expect(h.getAttribute('aria-expanded')).toBe('false')
    cleanup(); document.body.innerHTML = ''
    stubMedia(false); mount()
    expect(document.querySelector('[data-ab-part="drawer"]')!.getAttribute('data-center')).toBe('main') // 💻
  })
  it('CSS: 48px rows and segmented control, Mulish 800 22px title, 16px top radius', () => {
    const css = readFileSync(join(__dirname, '..', 'ab-drawer', 'kit.module.css'), 'utf8')
    expect(css).toMatch(/\.row \{[^}]*block-size: 48px;/) // 📏
    expect(css).toMatch(/\.seg \{[^}]*block-size: 48px;/) // 📏
    expect(css).toMatch(/font-weight: 800; font-size: 22px;/) // 🏷️
    expect(css).toMatch(/\[data-side='bottom'\] \{ border-bottom: 0; border-radius: 16px 16px 0 0;/) // ⭕
  })
  it('is exported from the package root', () => {
    expect(pkg.AbSettingsDrawer).toBe(AbSettingsDrawer) // 📦
  })
})
