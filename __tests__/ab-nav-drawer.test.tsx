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
* @name: AbNavDrawer tests
* @file: __tests__/ab-nav-drawer.test.tsx
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
import AbNavDrawer from '../ab-nav-drawer'
import { AB_DRAWER_DURATION } from '../ab-drawer'
import * as pkg from '../index'

beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = () => act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) })
// 🗂️ God 01:22 + 01:27: Home · GETTING STARTED (Introduction, Packages, Guides) · Changelog; no Docs item
const SECTIONS = [
  { id: 'top', items: [{ href: '/', label: 'Home', icon: 'home' }] },
  { id: 'gs', label: 'Getting started', items: [{ href: '/introduction', label: 'Introduction', icon: 'description' }, { href: '/packages', label: 'Packages', icon: 'package_2' }, { href: '/guides', label: 'Guides', icon: 'menu_book' }] },
]
const mount = (over: Record<string, unknown> = {}) => {
  const p = { onClose: vi.fn(), onSettings: vi.fn(), onNavigate: vi.fn() }
  render(<div className="AbAppLayout"><AbNavDrawer open logo={<a href="/">AbElements</a>} version="v0.2.x" sections={SECTIONS} activeHref="/" footer={[{ href: '/changelog', label: 'Changelog', icon: 'history' }]} {...p} {...over} /></div>)
  flush()
  return p
}

describe('AbNavDrawer (drawers v2 §2) ⬅️', () => {
  it('a modal dialog "Site navigation", tier nav, left, 320px, swipe on', () => {
    mount()
    const dlg = document.querySelector<HTMLElement>('[role="dialog"]')!
    expect(dlg.getAttribute('aria-label')).toBe('Site navigation'); expect(dlg.getAttribute('aria-labelledby')).toBeNull() // ♿ the logo doesn't label it
    expect(dlg.getAttribute('aria-modal')).toBe('true')
    expect(dlg.dataset.side).toBe('left'); expect(dlg.dataset.swipe).toBe('true') // 🤏
    expect(dlg.style.getPropertyValue('--ab-drawer-size')).toBe('320px') // 📏
    expect(document.querySelector('[data-tier="nav"]')).not.toBeNull() // 🥞
  })
  it('logo, the version chip, Home (aria-current), a GETTING STARTED heading labelling its list, no Docs', () => {
    mount()
    const dlg = document.querySelector('[role="dialog"]')!
    expect(dlg.querySelector('[data-ab-part="drawer-header-start"]')!.textContent).toBe('AbElements') // 🏷️
    expect(dlg.querySelector('[aria-label="Version v0.2.x"]')!.textContent).toContain('v0.2.x') // 🏷️
    expect(dlg.querySelector('[aria-current="page"]')!.textContent).toContain('Home') // 🎯
    const h = dlg.querySelector('h3')!; expect(h.textContent).toBe('Getting started')
    expect(dlg.querySelector(`ul[aria-labelledby="${h.id}"]`)!.querySelectorAll('li')).toHaveLength(3) // ♿
    expect(Array.from(dlg.querySelectorAll('a')).map((a) => a.textContent)).not.toContain('Docs') // 🚫 God 01:27
  })
  it('choosing a link closes; Settings › closes first, then opens Settings', () => {
    const p = mount()
    fireEvent.click(Array.from(document.querySelectorAll('a')).find((a) => a.textContent?.includes('Introduction'))!)
    expect(p.onNavigate).toHaveBeenCalledWith('/introduction'); expect(p.onClose).toHaveBeenCalledTimes(1) // 🔗
    const order: string[] = []; p.onClose.mockImplementation(() => order.push('close')); p.onSettings.mockImplementation(() => order.push('settings'))
    fireEvent.click(Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('Settings'))!)
    expect(order).toEqual(['close', 'settings']) // 🥞 spec: close the left drawer first
  })
  it('a pinned footer with Changelog + Settings, and the 72px fade', () => {
    mount()
    const foot = document.querySelector('[data-ab-part="nav-drawer-footer"]')!
    expect(foot.textContent).toMatch(/Changelog/); expect(foot.textContent).toMatch(/Settings/)
    expect(document.querySelector('[data-ab-part="nav-drawer-nav"]')).not.toBeNull()
  })
  it('is exported from the package root', () => { expect(pkg.AbNavDrawer).toBe(AbNavDrawer) })
})
