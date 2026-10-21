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
* @name: AbSettingsDrawer account + Help / About, AbProfileAvatar tests (0.2.1)
* @file: __tests__/ab-settings-account.test.tsx
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
import { renderToStaticMarkup } from 'react-dom/server'
import AbSettingsDrawer from '../ab-settings-drawer'
import AbProfileAvatar, { getAbInitials } from '../ab-profile-avatar'
import { AB_DRAWER_DURATION } from '../ab-drawer'
import * as pkg from '../index'

const LOCALES = [{ code: 'en', label: 'English' }, { code: 'fr', label: 'Français' }] // 🌍
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)); vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q, addEventListener: () => {}, removeEventListener: () => {} })) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = () => act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) }) // ⏱️
const mount = (over: Record<string, unknown> = {}) => { render(<div className="AbAppLayout"><main data-ab-part="main"><AbSettingsDrawer open onClose={vi.fn()} theme="light" onThemeChange={vi.fn()} locales={LOCALES} locale="en" onLocaleChange={vi.fn()} {...over} /></main></div>); flush() }
const $ = (s: string) => document.querySelector<HTMLElement>(s) // 🔍

describe('👤 AbProfileAvatar (0.2.1)', () => {
  it('🔤 initials: first + last word', () => {
    expect(getAbInitials('Abraham Ukachi')).toBe('AU') // ✅ God's example
    expect(getAbInitials('  cher ')).toBe('C') // 1️⃣
    expect(getAbInitials('Jean Paul Sartre')).toBe('JS') // 🅰️🅱️
    expect(getAbInitials('')).toBe('') // 🚫
  })
  it('🧭 initials, photo (masked circle) or the signed-out glyph; always aria-hidden; server-safe', () => {
    const a = renderToStaticMarkup(<AbProfileAvatar user={{ name: 'Abraham Ukachi' }} />)
    expect(a).toContain('data-kind="initials"'); expect(a).toContain('>AU<'); expect(a).toContain('aria-hidden="true"') // 🔤
    expect(renderToStaticMarkup(<AbProfileAvatar user={{ name: 'A U', image: '/me.jpg' }} />)).toMatch(/data-kind="image".*<img src="\/me\.jpg" alt=""/) // 🖼️
    expect(renderToStaticMarkup(<AbProfileAvatar />)).toContain('data-kind="icon"') // 👤
    expect(pkg.AbProfileAvatar).toBe(AbProfileAvatar) // 📦
  })
})

describe('⚙️ AbSettingsDrawer account, Help and About (God 02:44)', () => {
  it('👤 signed in: an Account section on top with the avatar, name and email', () => {
    const onAccount = vi.fn(); mount({ account: { name: 'Abraham Ukachi', email: 'a@b.c' }, onAccount })
    const sec = $('[data-ab-part="settings-account"]')!
    expect(sec.textContent).toContain('Account'); expect(sec.textContent).toContain('Abraham Ukachi'); expect(sec.textContent).toContain('a@b.c') // 🏷️
    expect(sec.querySelector('[data-kind="initials"]')?.textContent).toBe('AU') // 🔤
    expect(sec.compareDocumentPosition($('[data-ab-part="settings-theme"]')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy() // ⬆️ before Theme
    fireEvent.click($('[data-ab-part="settings-account-row"]')!); expect(onAccount).toHaveBeenCalled() // 👆
  })
  it('🔑 signed out: a "Sign in" row; nothing at all without a handler', () => {
    const onSignIn = vi.fn(); mount({ onSignIn })
    fireEvent.click($('[data-ab-part="settings-sign-in"]')!); expect(onSignIn).toHaveBeenCalled() // 🔑
    cleanup(); mount(); expect($('[data-ab-part="settings-account"]')).toBeNull() // 🚫 opt-in
  })
  it('❓ ℹ️ Help and About rows after Language, translatable', () => {
    const onHelp = vi.fn(); const onAbout = vi.fn(); mount({ onHelp, onAbout, labels: { help: 'Aide', about: 'À propos' } })
    const more = $('[data-ab-part="settings-more"]')!
    expect($('[data-ab-part="settings-language"]')!.compareDocumentPosition(more) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy() // ⬇️
    fireEvent.click($('[data-ab-part="settings-help"]')!); fireEvent.click($('[data-ab-part="settings-about"]')!) // 👆
    expect(onHelp).toHaveBeenCalled(); expect(onAbout).toHaveBeenCalled() // ✅
    expect(more.textContent).toContain('Aide'); expect(more.textContent).toContain('À propos') // 🌍
  })
})
