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
* @name: AbSidebarProfileButton tests (0.2.1)
* @file: __tests__/ab-sidebar-profile.test.tsx
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
import { renderToString } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import AbSidebar from '../ab-sidebar'
import AbSidebarProfileButton from '../ab-sidebar/profile-button'
import { AB_DRAWER_DURATION } from '../ab-drawer'
import * as pkg from '../index'

vi.mock('next/navigation', () => ({ usePathname: () => '/' })) // 🧭
const LOCALES = [{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }] // 🌍
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)); vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {} })) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = () => act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) }) // ⏱️
const drawer = { theme: 'light' as const, onThemeChange: vi.fn(), locales: LOCALES, locale: 'en', onLocaleChange: vi.fn() } // ⚙️
const S = [{ id: 'a', items: [{ href: '/', icon: 'home', label: 'Home' }] }] // 🗂️
const ME = { name: 'Abraham Ukachi', email: 'abrahamukachi@gmail.com' } // 👤
const tree = (p: Record<string, unknown> = {}) => <div className="AbAppLayout"><main data-ab-part="main"><AbSidebar sections={S} profile={{ ...drawer, user: null }} {...p} /></main></div>
const btn = () => document.querySelector<HTMLButtonElement>('[data-ab-part="sidebar-profile"]') // 🔘
const css = readFileSync(join(__dirname, '../ab-sidebar/styles.module.css'), 'utf8') // 🎨

describe('👤 AbSidebar profile button (God 02:44)', () => {
  it('🖥️ renders on the server (no JS gating), inside the <nav> footer slot', () => {
    const html = renderToString(tree()) // 🖥️ SSR
    expect(html).toContain('data-ab-part="sidebar-profile"') // ✅ in the first paint
    render(tree())
    expect(document.querySelector('nav [data-ab-part="sidebar-footer"]')?.contains(btn())).toBe(true) // 🦶
  })
  it('📱 hidden by CSS below 1180px (mobile + tablet), shown from 1180 up', () => {
    expect(css).toMatch(/@media \(max-width: 1179\.98px\) \{ \.abSidebarProfile \{ display: none; \} \}/) // 🙈 768 / 1024 / 1179
    expect(css).not.toMatch(/@media \(min-width: 1180px\)[^}]*abSidebarProfile[^}]*display: none/) // 👀 1180 / 1920
  })
  it('👤 signed out: the profile glyph; signed in: "AU" initials, or the photo', () => {
    render(tree()); expect(btn()!.querySelector('[data-kind="icon"]')).not.toBeNull(); cleanup() // 👤
    render(tree({ profile: { ...drawer, user: ME } }))
    expect(btn()!.querySelector('[data-kind="initials"]')?.textContent).toBe('AU') // 🔤
    expect(btn()!.textContent).toContain('Abraham Ukachi') // 🏷️ expanded: the name
    cleanup(); render(tree({ profile: { ...drawer, user: { ...ME, image: '/me.jpg' } } }))
    expect(btn()!.querySelector('img')?.getAttribute('src')).toBe('/me.jpg') // 🖼️
  })
  it('♿ accessible, translatable label', () => {
    render(tree()); expect(btn()!.getAttribute('aria-label')).toBe('Profile and settings') // 🇬🇧
    expect(btn()!.getAttribute('aria-haspopup')).toBe('dialog') // ♿
    cleanup(); render(tree({ labels: { profile: 'Profil et réglages' } }))
    expect(btn()!.getAttribute('aria-label')).toBe('Profil et réglages') // 🇫🇷
  })
  it('🖱️ tap opens AbSettingsDrawer with the Account section; ↩️ Esc returns focus to the button', async () => {
    render(tree({ profile: { ...drawer, user: ME } }))
    const b = btn()!; b.focus(); fireEvent.click(b); flush() // 🖱️
    expect(document.querySelector('.AbSettingsDrawer')).not.toBeNull() // ✅ open
    expect(b.getAttribute('aria-expanded')).toBe('true') // ♿
    expect(document.getElementById(b.getAttribute('aria-controls')!)).not.toBeNull() // ♿
    expect(document.querySelector('[data-ab-part="settings-account"]')?.textContent).toContain('Abraham Ukachi') // 👤
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' }); flush() // ⎋
    await act(async () => { await Promise.resolve() }) // ⏭️
    expect(b.getAttribute('aria-expanded')).toBe('false') // 🚪
    expect(document.activeElement).toBe(b) // ↩️
  })
  it('🎈 collapsed rail: avatar only, with a hover / focus tooltip', () => {
    render(tree({ profile: { ...drawer, user: ME }, collapsed: true }))
    expect(btn()!.getAttribute('data-collapsed')).toBe('true') // 🚪
    expect(btn()!.textContent).not.toContain('Abraham Ukachi') // ⭕ no name
    expect(btn()!.closest('.AbBalloon')).not.toBeNull() // 🎈 wrapped
    expect(document.getElementById(btn()!.getAttribute('aria-describedby')!)?.textContent).toBe('Profile and settings') // 💬 the hover / focus label
  })
  it('🔕 opt-in, and exported (old settings-button name is gone)', () => {
    render(<AbSidebar sections={S} />); expect(btn()).toBeNull() // 🚫
    expect(pkg.AbSidebarProfileButton).toBe(AbSidebarProfileButton) // 📦
    expect((pkg as Record<string, unknown>).AbSidebarSettingsButton).toBeUndefined() // 🧹 replaced
  })
})
