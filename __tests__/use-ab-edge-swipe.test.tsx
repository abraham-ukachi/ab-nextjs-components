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
* @name: useAbEdgeSwipe tests
* @file: __tests__/use-ab-edge-swipe.test.tsx
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
import { cleanup, render } from '@testing-library/react'
import { useAbEdgeSwipe } from '../ab-drawer'

afterEach(() => { cleanup(); document.body.innerHTML = '' })
// 🖐️ a synthetic touch swipe on `target`
const swipe = (target: Element, x0: number, x1: number, ms: number, y = 400, type = 'touch', n = 8) => {
  const ev = (k: string, x: number, t: number) => { const e = new Event(k, { bubbles: true, cancelable: true }); Object.assign(e, { clientX: x, clientY: y, pointerType: type, pointerId: 1 }); Object.defineProperty(e, 'timeStamp', { value: 1000 + t }); return e }
  target.dispatchEvent(ev('pointerdown', x0, 0))
  for (let i = 1; i <= n; i++) target.dispatchEvent(ev('pointermove', x0 + ((x1 - x0) * i) / n, (ms * i) / n))
  target.dispatchEvent(ev('pointerup', x1, ms))
}
function Probe({ edge, onOpen, enabled }: { edge: 'left' | 'right'; onOpen: () => void; enabled?: boolean }) {
  useAbEdgeSwipe({ edge, onOpen, enabled })
  return <div className="AbAppLayout" id="app"><p id="page">page</p><div id="code" data-ab-no-edge-swipe>code</div></div>
}
const stubBox = () => { const app = document.getElementById('app')!; app.getBoundingClientRect = () => ({ left: 0, right: 390, top: 0, bottom: 844, width: 390, height: 844, x: 0, y: 0, toJSON: () => ({}) }) }

describe('useAbEdgeSwipe 🤏', () => {
  it('left edge: a 120px swipe from x=10 opens; from x=60 (outside the 24px zone) does nothing', () => {
    const onOpen = vi.fn(); render(<Probe edge="left" onOpen={onOpen} />); stubBox()
    swipe(document.getElementById('page')!, 60, 200, 300) // 🚫 not the edge
    expect(onOpen).not.toHaveBeenCalled()
    swipe(document.getElementById('page')!, 10, 130, 600) // ✅ 120 > 96
    expect(onOpen).toHaveBeenCalledTimes(1)
  })
  it('a slow short drag snaps back; a fast short flick opens', () => {
    const onOpen = vi.fn(); render(<Probe edge="left" onOpen={onOpen} />); stubBox()
    swipe(document.getElementById('page')!, 10, 70, 600) // 🫳 60px, 0.1px/ms
    expect(onOpen).not.toHaveBeenCalled()
    swipe(document.getElementById('page')!, 10, 70, 60) // ⚡ 1px/ms
    expect(onOpen).toHaveBeenCalledTimes(1)
  })
  it('right edge swipes right-to-left; the wrong direction does nothing', () => {
    const onOpen = vi.fn(); render(<Probe edge="right" onOpen={onOpen} />); stubBox()
    swipe(document.getElementById('page')!, 380, 390, 50) // 🚫 outward
    expect(onOpen).not.toHaveBeenCalled()
    swipe(document.getElementById('page')!, 380, 240, 300) // ✅
    expect(onOpen).toHaveBeenCalledTimes(1)
  })
  it('ignored in [data-ab-no-edge-swipe], for a mouse, and when disabled', () => {
    const onOpen = vi.fn(); const { rerender } = render(<Probe edge="left" onOpen={onOpen} />); stubBox()
    swipe(document.getElementById('code')!, 10, 200, 300) // 🎠
    swipe(document.getElementById('page')!, 10, 200, 300, 400, 'mouse') // 🖱️
    rerender(<Probe edge="left" onOpen={onOpen} enabled={false} />)
    swipe(document.getElementById('page')!, 10, 200, 300) // 🎚️
    expect(onOpen).not.toHaveBeenCalled()
  })
  describe('👆 touch events (Android Chrome: pointercancel on pan)', () => {
    // 👆 a synthetic touch gesture; returns which touchmoves were prevented
    const touch = (target: Element, pts: [number, number][], ms: number) => {
      const ev = (k: string, x: number, y: number, t: number, down = true) => { const e = new Event(k, { bubbles: true, cancelable: true }); const p = { clientX: x, clientY: y, identifier: 1 }; Object.assign(e, { touches: down ? [p] : [], changedTouches: [p] }); Object.defineProperty(e, 'timeStamp', { value: 1000 + t }); return e }
      target.dispatchEvent(ev('touchstart', ...pts[0], 0))
      const prevented = pts.slice(1).map(([x, y], i) => { const e = ev('touchmove', x, y, (ms * (i + 1)) / (pts.length - 1)); target.dispatchEvent(e); return e.defaultPrevented })
      const [lx, ly] = pts[pts.length - 1]; target.dispatchEvent(ev('touchend', lx, ly, ms, false))
      return prevented
    }
    const line = (x0: number, y0: number, x1: number, y1: number, n = 8): [number, number][] => Array.from({ length: n + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n])
    beforeEach(() => { (window as unknown as Record<string, unknown>).ontouchstart = null })
    afterEach(() => { delete (window as unknown as Record<string, unknown>).ontouchstart })

    it('a sideways touch from the left edge opens and prevents the browser pan once it is sideways (not before the slop)', () => {
      const onOpen = vi.fn(); render(<Probe edge="left" onOpen={onOpen} />); stubBox()
      const prevented = touch(document.getElementById('page')!, line(6, 400, 206, 402, 40), 250) // 5px steps
      expect(onOpen).toHaveBeenCalledTimes(1) // ✅
      expect(prevented[0]).toBe(false); expect(prevented.slice(1).every(Boolean)).toBe(true) // 🛑 only after 8px sideways
    })
    it('the right edge works the same way', () => {
      const onOpen = vi.fn(); render(<Probe edge="right" onOpen={onOpen} />); stubBox()
      touch(document.getElementById('page')!, line(384, 400, 184, 401), 250)
      expect(onOpen).toHaveBeenCalledTimes(1)
    })
    it('a vertical touch starting in the edge zone is never prevented (the page scrolls) and does not open', () => {
      const onOpen = vi.fn(); render(<Probe edge="left" onOpen={onOpen} />); stubBox()
      const prevented = touch(document.getElementById('page')!, line(6, 600, 9, 200), 250)
      expect(prevented.some(Boolean)).toBe(false); expect(onOpen).not.toHaveBeenCalled() // 📜
    })
    it('[data-ab-no-edge-swipe] and touches outside the zone are left alone (never prevented)', () => {
      const onOpen = vi.fn(); render(<Probe edge="left" onOpen={onOpen} />); stubBox()
      expect(touch(document.getElementById('code')!, line(6, 400, 206, 400), 250).some(Boolean)).toBe(false) // 🎠
      expect(touch(document.getElementById('page')!, line(80, 400, 280, 400), 250).some(Boolean)).toBe(false) // 🧱
      expect(onOpen).not.toHaveBeenCalled()
    })
    it('with touch events present, touch pointer events are ignored (no double open), pens still work', () => {
      const onOpen = vi.fn(); render(<Probe edge="left" onOpen={onOpen} />); stubBox()
      swipe(document.getElementById('page')!, 10, 200, 200); expect(onOpen).not.toHaveBeenCalled() // 👆 the touch path owns it
      swipe(document.getElementById('page')!, 10, 200, 200, 400, 'pen'); expect(onOpen).toHaveBeenCalledTimes(1) // 🖊️
    })
  })
})
