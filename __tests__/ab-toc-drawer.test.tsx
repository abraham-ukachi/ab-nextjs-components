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
* @name: AbTocDrawer tests
* @file: __tests__/ab-toc-drawer.test.tsx
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
import AbTocDrawer from '../ab-toc-drawer'
import { AB_DRAWER_DURATION } from '../ab-drawer'
import * as pkg from '../index'

beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = () => act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) })
const ITEMS = [{ id: 'req', label: 'Requirements' }, { id: 'core', label: 'Install the core' }, { id: 'pnpm', label: 'pnpm', level: 3 as const }]
const mount = (over: Record<string, unknown> = {}) => {
  const p = { onClose: vi.fn(), onNavigate: vi.fn() }
  render(<div className="AbAppLayout"><AbTocDrawer open items={ITEMS} activeId="req" links={[{ href: 'https://github.com/x', label: 'Edit this page', icon: 'github', external: true }, { href: '/changelog', label: 'Changelog', icon: 'history' }]} {...p} {...over} /></div>)
  flush()
  return p
}

describe('AbTocDrawer (drawers v2 §3) ➡️', () => {
  it('a modal dialog titled "On this page", right, 296px, tier aside, swipe on', () => {
    mount()
    const dlg = document.querySelector<HTMLElement>('[role="dialog"]')!
    expect(document.getElementById(dlg.getAttribute('aria-labelledby')!)!.textContent).toBe('On this page') // 🏷️
    expect(dlg.dataset.side).toBe('right'); expect(dlg.dataset.swipe).toBe('true')
    expect(dlg.style.getPropertyValue('--ab-drawer-size')).toBe('296px') // 📏
    expect(document.querySelector('[data-tier="aside"]')).not.toBeNull() // 🥞 below nav
  })
  it('the active heading has aria-current="location" and takes focus; level 3 rows carry data-level', () => {
    mount()
    const on = document.querySelector<HTMLElement>('[aria-current="location"]')!
    expect(on.textContent).toBe('Requirements'); expect(document.activeElement).toBe(on) // 🎯
    expect(document.querySelector('[data-level="3"]')!.textContent).toBe('pnpm')
  })
  it('choosing a heading scrolls (onNavigate) then closes', () => {
    const p = mount()
    fireEvent.click(Array.from(document.querySelectorAll('a')).find((a) => a.textContent === 'Install the core')!)
    expect(p.onNavigate).toHaveBeenCalledWith('core'); expect(p.onClose).toHaveBeenCalled()
  })
  it('a divider, then Edit this page (new tab) and Changelog', () => {
    mount()
    expect(document.querySelector('hr')).not.toBeNull()
    const edit = Array.from(document.querySelectorAll('a')).find((a) => a.textContent?.includes('Edit this page'))!
    expect(edit.getAttribute('target')).toBe('_blank')
  })
  it('CSS: 44px rows on a 2px rail, level 3 +16px, title 20px', () => {
    const css = readFileSync(join(__dirname, '..', 'ab-drawer', 'kit.module.css'), 'utf8')
    expect(css).toMatch(/\.tocLink \{[^}]*block-size: 44px; padding: 0 16px; border-inline-start: 2px solid/) // 📏
    expect(css).toMatch(/\.tocLink\[data-level='3'\] \{ padding-inline-start: 32px;/) // ↳
    expect(css).toMatch(/\.titleSm \[data-ab-part='drawer-header'\] > :first-child \{ font-size: 20px; \}/) // 🏷️
  })
  it('is exported from the package root', () => { expect(pkg.AbTocDrawer).toBe(AbTocDrawer) })
})
