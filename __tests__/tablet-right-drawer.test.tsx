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
* @name: Tablet + mobile: the aside opens as the right drawer (God 02:47)
* @file: __tests__/tablet-right-drawer.test.tsx
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
import { cleanup, render } from '@testing-library/react'
import { AB_ASIDE_DRAWER_MAX_WIDTH, useAbEdgeSwipe } from '../ab-drawer'
import * as pkg from '../index'

afterEach(() => { cleanup(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
// 🖐️ a right-to-left touch swipe from the right edge of a `w`-wide app box
const swipeIn = (w: number) => {
  const ev = (k: string, x: number, t: number) => { const e = new Event(k, { bubbles: true, cancelable: true }); Object.assign(e, { clientX: x, clientY: 400, pointerType: 'touch', pointerId: 1 }); Object.defineProperty(e, 'timeStamp', { value: 1000 + t }); return e }
  const p = document.getElementById('page')!
  p.dispatchEvent(ev('pointerdown', w - 10, 0)); for (let i = 1; i <= 8; i++) p.dispatchEvent(ev('pointermove', w - 10 - (150 * i) / 8, (300 * i) / 8)); p.dispatchEvent(ev('pointerup', w - 160, 300))
}
function Probe({ onOpen, maxWidth }: { onOpen: () => void; maxWidth?: number }) {
  useAbEdgeSwipe({ edge: 'right', width: 296, onOpen, maxWidth }) // ➡️ the right drawer (AbTocDrawer)
  return <div className="AbAppLayout" id="app"><p id="page">page</p></div>
}
const at = (w: number, maxWidth?: number) => { // 📐 a viewport + app box of width w
  vi.stubGlobal('innerWidth', w)
  const onOpen = vi.fn(); render(<Probe onOpen={onOpen} maxWidth={maxWidth} />)
  document.getElementById('app')!.getBoundingClientRect = () => ({ left: 0, right: w, top: 0, bottom: 800, width: w, height: 800, x: 0, y: 0, toJSON: () => ({}) })
  swipeIn(w); return onOpen
}

describe('📟 the aside is the right drawer on mobile AND tablet (God 02:47)', () => {
  it('the column starts at 1180, so the drawer tier ends at 1179', () => expect(AB_ASIDE_DRAWER_MAX_WIDTH).toBe(1179)) // 🔢
  for (const w of [390, 768, 1024, 1179]) it(`${w}px: a right-to-left edge swipe opens it`, () => expect(at(w, AB_ASIDE_DRAWER_MAX_WIDTH)).toHaveBeenCalledTimes(1)) // ✅
  for (const w of [1180, 1920]) it(`${w}px: no swipe (the aside is a column there)`, () => expect(at(w, AB_ASIDE_DRAWER_MAX_WIDTH)).not.toHaveBeenCalled()) // 🚫
  it('without maxWidth it swipes at every width (back-compat)', () => expect(at(1440)).toHaveBeenCalledTimes(1)) // 🕰️
  it('is exported', () => expect(pkg.AB_ASIDE_DRAWER_MAX_WIDTH).toBe(1179)) // 📦
})
