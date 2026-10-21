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
* @name: Swipe-open → Esc → focus back on the logo (Joseph, 0.2.1)
* @file: __tests__/swipe-return-focus.test.tsx
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
import { useState } from 'react'
import AbNavDrawer from '../ab-nav-drawer'
import AbMobileHeader from '../ab-mobile-header'
import { AB_DRAWER_DURATION, AB_DRAWER_RETURN_FOCUS, useAbEdgeSwipe } from '../ab-drawer'
import * as pkg from '../index'

beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = () => act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) }) // ⏱️
// 🖐️ a synthetic touch swipe (same as use-ab-edge-swipe.test)
const swipe = (target: Element, x0: number, x1: number, ms: number, y = 400, n = 8) => {
  const ev = (k: string, x: number, t: number) => { const e = new Event(k, { bubbles: true, cancelable: true }); Object.assign(e, { clientX: x, clientY: y, pointerType: 'touch', pointerId: 1 }); Object.defineProperty(e, 'timeStamp', { value: 1000 + t }); return e }
  act(() => { target.dispatchEvent(ev('pointerdown', x0, 0)); for (let i = 1; i <= n; i++) target.dispatchEvent(ev('pointermove', x0 + ((x1 - x0) * i) / n, (ms * i) / n)); target.dispatchEvent(ev('pointerup', x1, ms)) })
}
function App({ returnFocus }: { returnFocus?: string }) {
  const [open, setOpen] = useState(false) // 🚪
  useAbEdgeSwipe({ edge: 'left', onOpen: () => setOpen(true), enabled: !open }) // 🤏
  return (
    <div className="AbAppLayout" id="app">
      <AbMobileHeader logo={<a href="/" id="logo">Ab</a>} onLanguage={() => {}} onThemeChange={() => {}} />
      <button type="button" id="stale">something focused earlier</button>
      <p id="page">page</p>
      <AbNavDrawer open={open} onClose={() => setOpen(false)} logo={<a href="/">Ab</a>} sections={[{ id: 't', items: [{ href: '/', label: 'Home' }] }]} activeHref="/" onSettings={() => {}} returnFocus={returnFocus} />
    </div>
  )
}
const box = () => { document.getElementById('app')!.getBoundingClientRect = () => ({ left: 0, right: 390, top: 0, bottom: 844, width: 390, height: 844, x: 0, y: 0, toJSON: () => ({}) }) } // 📐

describe('↩️ swipe-opened nav drawer returns focus to the logo (Joseph)', () => {
  it('no returnFocus prop: Esc lands on the mobile header logo, not a stale element', async () => {
    render(<App />); box()
    document.getElementById('stale')!.focus() // 🫥 an old focus
    swipe(document.getElementById('page')!, 10, 150, 300); flush() // 🤏 open
    expect(document.querySelector('[data-ab-part="drawer"]')).not.toBeNull() // ✅ open
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' }); flush() // ⎋
    await act(async () => { await Promise.resolve() }) // ⏭️ the microtask
    expect(document.activeElement?.id).toBe('logo') // ↩️
  })
  it('an explicit returnFocus still wins', async () => {
    render(<App returnFocus="#stale" />); box()
    swipe(document.getElementById('page')!, 10, 150, 300); flush()
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' }); flush()
    await act(async () => { await Promise.resolve() })
    expect(document.activeElement?.id).toBe('stale') // 🎯
  })
  it('the default target list is exported and covers the header / brand logos', () => {
    expect(pkg.AB_DRAWER_RETURN_FOCUS).toBe(AB_DRAWER_RETURN_FOCUS) // 📦
    expect(AB_DRAWER_RETURN_FOCUS).toContain('[data-ab-part="mobile-header"] a[href]') // 📱
    expect(AB_DRAWER_RETURN_FOCUS).toContain('[data-ab-part="app-bar-brand"] a[href]') // 💻
  })
})
