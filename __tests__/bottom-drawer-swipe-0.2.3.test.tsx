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
* @name: AbBottomDrawer swipe down + focus return (0.2.3)
* @file: __tests__/bottom-drawer-swipe-0.2.3.test.tsx
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
import { act, cleanup, render } from '@testing-library/react'
import { useRef, useState } from 'react'
import AbBottomDrawer from '../ab-bottom-drawer'

afterEach(() => { cleanup(); document.body.innerHTML = '' })
const wait = (ms: number) => act(() => new Promise((r) => setTimeout(r, ms))) // ⏱️

// 👆 a synthetic touch gesture on `target` (same shape as the useAbEdgeSwipe tests); returns the prevented moves
const touch = (target: Element, pts: [number, number][], ms: number) => {
  const ev = (k: string, x: number, y: number, t: number, down = true) => { const e = new Event(k, { bubbles: true, cancelable: true }); const p = { clientX: x, clientY: y, identifier: 1 }; Object.assign(e, { touches: down ? [p] : [], changedTouches: [p] }); Object.defineProperty(e, 'timeStamp', { value: 1000 + t }); return e }
  target.dispatchEvent(ev('touchstart', ...pts[0], 0))
  const prevented = pts.slice(1).map(([x, y], i) => { const e = ev('touchmove', x, y, (ms * (i + 1)) / (pts.length - 1)); target.dispatchEvent(e); return e.defaultPrevented })
  const [lx, ly] = pts[pts.length - 1]; target.dispatchEvent(ev('touchend', lx, ly, ms, false))
  return prevented
}
// 📏 a sheet 400px tall (happy-dom has no layout)
const sized = () => { const s = document.querySelector<HTMLElement>('[role="dialog"]')!; Object.defineProperty(s, 'offsetHeight', { value: 400, configurable: true }); return s }
const line = (y0: number, y1: number, n = 6, x = 100): [number, number][] => Array.from({ length: n + 1 }, (_, i) => [x, y0 + ((y1 - y0) * i) / n])

function Sheet({ onClose, swipeToClose, scroller }: { onClose: () => void; swipeToClose?: boolean; scroller?: boolean }) {
  return (
    <div className="AbAppLayout">
      <AbBottomDrawer open onClose={onClose} title="Language" swipeToClose={swipeToClose}>
        {scroller ? <div id="list" style={{ overflow: 'auto' }}><p id="row">row</p></div> : <p id="row">row</p>}
      </AbBottomDrawer>
    </div>
  )
}

describe('👇 AbBottomDrawer: swipe down to close (Joseph, Welcome 0.2.21)', () => {
  it('a long slow drag down (> 30% of the height) closes, and the moves are prevented', () => {
    const onClose = vi.fn(); render(<Sheet onClose={onClose} />); sized()
    const prevented = touch(document.getElementById('row')!, line(100, 260), 900) // 160 > 120, 0.18px/ms
    expect(onClose).toHaveBeenCalledTimes(1) // ✅
    expect(prevented.slice(1).every(Boolean)).toBe(true) // 🛑 ours once past the slop
  })
  it('a short fast flick closes; a short slow drag springs back', () => {
    const onClose = vi.fn(); render(<Sheet onClose={onClose} />); const s = sized()
    touch(document.getElementById('row')!, line(100, 160), 800) // 🫳 60px, slow
    expect(onClose).not.toHaveBeenCalled()
    expect(s.style.transform).toBe('') // 🛬 back to rest
    touch(document.getElementById('row')!, line(100, 160), 60) // ⚡ 1px/ms
    expect(onClose).toHaveBeenCalledTimes(1)
  })
  it('up and sideways moves are never ours (not prevented, no close)', () => {
    const onClose = vi.fn(); render(<Sheet onClose={onClose} />); sized()
    expect(touch(document.getElementById('row')!, line(300, 100), 100).some(Boolean)).toBe(false) // ⬆️
    expect(touch(document.getElementById('row')!, [[100, 100], [140, 104], [200, 110], [300, 120]], 100).some(Boolean)).toBe(false) // ↔️
    expect(onClose).not.toHaveBeenCalled()
  })
  it('does not fight inner scroll: a scroller below scrollTop 0 keeps the gesture, at 0 the sheet takes it', () => {
    const onClose = vi.fn(); render(<Sheet onClose={onClose} scroller />); sized()
    const list = document.getElementById('list')!; list.scrollTop = 50 // 📜 scrolled
    Object.defineProperty(list, 'scrollTop', { value: 50, configurable: true })
    expect(touch(document.getElementById('row')!, line(100, 300), 100).some(Boolean)).toBe(false) // 📜 the content's
    expect(onClose).not.toHaveBeenCalled()
    Object.defineProperty(list, 'scrollTop', { value: 0, configurable: true }) // ⬆️ at the top
    touch(document.getElementById('row')!, line(100, 300), 100)
    expect(onClose).toHaveBeenCalledTimes(1) // ✅
  })
  it('swipeToClose={false} turns it off', () => {
    const onClose = vi.fn(); render(<Sheet onClose={onClose} swipeToClose={false} />); sized()
    touch(document.getElementById('row')!, line(100, 300), 100)
    expect(onClose).not.toHaveBeenCalled() // 🎚️ off
  })
  it('the sheet follows the finger while dragging', () => {
    render(<Sheet onClose={() => {}} />); const s = sized(); const row = document.getElementById('row')!
    const ev = (k: string, y: number, t: number) => { const e = new Event(k, { bubbles: true, cancelable: true }); Object.assign(e, { touches: [{ clientX: 100, clientY: y }], changedTouches: [{ clientX: 100, clientY: y }] }); Object.defineProperty(e, 'timeStamp', { value: t }); return e }
    row.dispatchEvent(ev('touchstart', 100, 0)); row.dispatchEvent(ev('touchmove', 150, 50)); row.dispatchEvent(ev('touchmove', 180, 100))
    expect(s.style.transform).toBe('translateY(80px)') // 🫳
  })
})

describe('↩️ AbBottomDrawer: focus returns to the trigger on close (Joseph)', () => {
  function Host({ withRef }: { withRef?: boolean }) {
    const [open, setOpen] = useState(false); const ref = useRef<HTMLButtonElement>(null)
    return (
      <div className="AbAppLayout">
        <a href="/" className="AbMobileHeader__logo" data-ab-part="mobile-header-logo">logo</a>
        <button id="trigger" ref={ref} aria-controls="lang" onClick={() => setOpen(true)}>Language</button>
        <AbBottomDrawer id="lang" open={open} onClose={() => setOpen(false)} title="Language" trigger={withRef ? ref : undefined}><p>x</p></AbBottomDrawer>
      </div>
    )
  }
  it('with no focused opener (Safari / iOS taps), focus goes to the [aria-controls] trigger, not the logo', async () => {
    render(<Host />)
    act(() => { document.getElementById('trigger')!.click() }) // 🖱️ a click that does NOT focus (Safari)
    ;(document.activeElement as HTMLElement | null)?.blur?.()
    await wait(50)
    act(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })) }) // ⎋
    await wait(300)
    expect(document.activeElement?.id).toBe('trigger') // ↩️
  })
  it('an explicit trigger ref wins', async () => {
    render(<Host withRef />)
    act(() => { document.getElementById('trigger')!.click() })
    await wait(50)
    act(() => { document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })) })
    await wait(300)
    expect(document.activeElement?.id).toBe('trigger') // ↩️
  })
})
