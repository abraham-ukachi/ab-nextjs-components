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
import { afterEach, describe, expect, it, vi } from 'vitest'
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
})
