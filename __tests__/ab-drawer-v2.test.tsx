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
* @name: AbDrawer v2 tests
* @file: __tests__/ab-drawer-v2.test.tsx
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
import AbDrawer, { AB_DRAWER_DURATION, type AbDrawerProps } from '../ab-drawer'

const read = (rel: string) => readFileSync(join(__dirname, '..', rel), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 📄 no comments
// 📱 a matchMedia stub: `mobile` = below 768px
const stubMedia = (mobile: boolean) => vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('max-width: 767px') ? mobile : false, media: q, addEventListener: () => {}, removeEventListener: () => {} }))
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = () => act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) }) // 🎞️
const panel = () => document.querySelector<HTMLElement>('[data-ab-part="drawer"]')!
// 🧱 a fake panes shell
const mount = (p: Partial<AbDrawerProps>) => {
  const onClose = vi.fn()
  render(<div className="AbAppLayout"><main data-ab-part="main"><a href="/" id="logo">Logo</a><AbDrawer open onClose={onClose} title="Settings" {...p}><button id="a">A</button><span role="radio" aria-checked="true" tabIndex={0} id="checked">English</span></AbDrawer></main></div>)
  flush()
  return onClose
}
// 🖐️ a synthetic pointer drag: n steps over `ms`
const dragOn = (el: Element, from: [number, number], to: [number, number], ms: number, n = 6) => {
  const ev = (type: string, x: number, y: number, t: number) => { const e = new Event(type, { bubbles: true, cancelable: true }) as unknown as Record<string, unknown>; Object.assign(e, { clientX: x, clientY: y, pointerId: 1, button: 0, pointerType: 'touch' }); Object.defineProperty(e, 'timeStamp', { value: 1000 + t }) /* ⏱️ never 0: React reads 0 as now */; return e as unknown as Event }
  act(() => { el.dispatchEvent(ev('pointerdown', from[0], from[1], 0)) })
  for (let i = 1; i <= n; i++) act(() => { el.dispatchEvent(ev('pointermove', from[0] + ((to[0] - from[0]) * i) / n, from[1] + ((to[1] - from[1]) * i) / n, (ms * i) / n)) })
  act(() => { el.dispatchEvent(ev('pointerup', to[0], to[1], ms)) })
}

describe('AbDrawer 0.2.0: tiers 🥞', () => {
  it('data-tier on the frame; CSS: nav (61) above aside (60), sheet (62) on top', () => {
    mount({ tier: 'nav', side: 'left' })
    expect(document.querySelector('[data-tier="nav"]')).not.toBeNull() // 🥞
    const css = read('ab-drawer/styles.module.css')
    expect(css).toMatch(/\.abDrawerLayer:has\(> \.abDrawerFrame\[data-tier='nav'\]\) \{ z-index: 61; \}/) // ⬅️
    expect(css).toMatch(/\.abDrawerLayer:has\(> \.abDrawerFrame\[data-tier='sheet'\]\) \{ z-index: 62; \}/) // ⬆️
    expect(css).toMatch(/\.abDrawerLayer \{[^}]*z-index: 60;/) // ➡️ aside = the base level
  })
  it('side drawers: 200ms in, 160ms out (the --ab-motion-duration token)', () => {
    const css = read('ab-drawer/styles.module.css')
    expect(css).toMatch(/--ab-motion-duration: var\(--ab-drawer-duration, 200ms\)/) // 🎞️
    expect(css).toMatch(/\[data-state='closed'\][^{]*\{ --ab-motion-duration: var\(--ab-drawer-close-duration, 160ms\); \}/) // 🎞️
  })
})

describe('AbDrawer 0.2.0: snap points (mobile) 🧲', () => {
  it('opens at S1 with a handle button; the handle toggles S2 with aria-expanded + labels', () => {
    stubMedia(true)
    const onSnap = vi.fn()
    mount({ snapPoints: true, tier: 'sheet', handleLabels: { expand: 'Expand settings', collapse: 'Collapse settings' }, onSnapChange: onSnap })
    const h = document.querySelector<HTMLButtonElement>('button[data-ab-part="drawer-handle"]')!
    expect(panel().dataset.snap).toBe('partial') // 🧲 S1
    expect(h.getAttribute('aria-expanded')).toBe('false')
    expect(h.getAttribute('aria-label')).toBe('Expand settings') // ♿
    fireEvent.click(h)
    expect(panel().dataset.snap).toBe('full') // 🧲 S2
    expect(h.getAttribute('aria-label')).toBe('Collapse settings')
    expect(onSnap).toHaveBeenLastCalledWith('full') // 🔔
  })
  it('defaultSnap="full" opens at S2 (the search sheet)', () => {
    stubMedia(true)
    mount({ snapPoints: true, defaultSnap: 'full' })
    expect(panel().dataset.snap).toBe('full')
  })
  it('a hard swipe down on the handle closes; a fast flick up snaps to S2', () => {
    stubMedia(true)
    const onClose = mount({ snapPoints: true })
    const h = document.querySelector('[data-ab-part="drawer-handle"]')!
    dragOn(h, [195, 260], [195, 180], 60) // ⬆️ 80px in 60ms
    expect(panel().dataset.snap).toBe('full')
    dragOn(h, [195, 60], [195, 160], 80) // ⬇️ 100px in 80ms = 1.25px/ms
    expect(onClose).toHaveBeenCalled() // 💨
  })
  it('S2 → gentle drag down → S1; then a second swipe closes', () => {
    stubMedia(true)
    const onClose = mount({ snapPoints: true, defaultSnap: 'full' })
    const h = document.querySelector('[data-ab-part="drawer-handle"]')!
    dragOn(h, [195, 60], [195, 130], 700, 14) // 🫳 70px in 700ms
    expect(panel().dataset.snap).toBe('partial') // 🧲 back to 70%
    expect(onClose).not.toHaveBeenCalled()
    dragOn(h, [195, 300], [195, 360], 700, 14) // ✌️ another gentle swipe
    expect(onClose).toHaveBeenCalled()
  })
  it('no snap and no handle button on laptop; centerIn="main" sets data-center', () => {
    stubMedia(false)
    mount({ snapPoints: true, centerIn: 'main' })
    expect(panel().dataset.snap).toBeUndefined() // 💻
    expect(panel().dataset.center).toBe('main') // 🎯
    expect(document.querySelector('button[data-ab-part="drawer-handle"]')).toBeNull() // 🙈 decorative bar only
    expect(document.querySelector('[data-ab-part="drawer-handle"]')!.getAttribute('aria-hidden')).toBe('true')
    const css = read('ab-drawer/styles.module.css')
    expect(css).toMatch(/--ab-drawer-w: min\(var\(--ab-drawer-max-width, 640px\), var\(--ab-drawer-main-width, 100%\)\)/) // 📏 min(640, main)
    expect(css).toMatch(/\[data-center='main'\] \{[^}]*max-block-size: 70%;/) // 📏 ≤ 70%
  })
})

describe('AbDrawer 0.2.0: side swipe + focus 🤏', () => {
  it('a swipe toward the edge past 30% closes; a short slow one does not', () => {
    const onClose = mount({ side: 'left', swipe: true, tier: 'nav' })
    Object.defineProperty(panel(), 'offsetWidth', { value: 320 })
    dragOn(panel(), [300, 400], [260, 402], 600, 12) // 🫳 40px slow
    expect(onClose).not.toHaveBeenCalled()
    dragOn(panel(), [300, 400], [180, 402], 600, 12) // ↔️ 120px > 96
    expect(onClose).toHaveBeenCalled()
  })
  it('initialFocus selector focuses the checked option; returnFocus is used after a swipe-open', async () => {
    const onClose = vi.fn()
    const { rerender } = render(<div className="AbAppLayout"><a href="/" id="logo">Logo</a><AbDrawer open onClose={onClose} title="S" initialFocus='[role="radio"][aria-checked="true"]' returnFocus="#logo"><button>A</button><span role="radio" aria-checked="true" tabIndex={0} id="checked">English</span></AbDrawer></div>)
    flush()
    expect(document.activeElement?.id).toBe('checked') // 🎯
    rerender(<div className="AbAppLayout"><a href="/" id="logo">Logo</a><AbDrawer open={false} onClose={onClose} title="S" initialFocus='[role="radio"][aria-checked="true"]' returnFocus="#logo"><button>A</button></AbDrawer></div>)
    flush(); await act(async () => { await Promise.resolve() })
    expect(document.activeElement?.id).toBe('logo') // ↩️ no opener (body) → the logo link
  })
})

describe('AbDrawer 0.2.0: fullOnly (the search sheet) 🔎', () => {
  it('opens at S2, a gentle drag springs back to S2, a hard swipe closes; the handle is a decorative grip', () => {
    stubMedia(true)
    const onClose = mount({ snapPoints: true, fullOnly: true })
    expect(panel().dataset.snap).toBe('full')
    const h = document.querySelector('[data-ab-part="drawer-handle"]')!
    expect(h.tagName).toBe('DIV'); expect(h.getAttribute('aria-hidden')).toBe('true') // ➖ no 70% to toggle to
    dragOn(h, [195, 60], [195, 130], 700, 14) // 🫳 gentle
    expect(panel().dataset.snap).toBe('full'); expect(onClose).not.toHaveBeenCalled()
    dragOn(h, [195, 60], [195, 160], 80) // 💨
    expect(onClose).toHaveBeenCalled()
  })
})

describe('AbDrawer 0.2.0: initial focus never scrolls the layer 👀', () => {
  it('no scrollIntoView (it scrolled the clipped layer and undid the 70% offset in WebKit)', () => {
    const src = readFileSync(join(__dirname, '..', 'ab-drawer', 'index.tsx'), 'utf8')
    expect(src).not.toMatch(/\.scrollIntoView\?*\.?\(/) // 🚫
    const spy = vi.fn(); Element.prototype.scrollIntoView = spy
    stubMedia(true); mount({ snapPoints: true, initialFocus: '#checked' })
    expect(document.activeElement?.id).toBe('checked'); expect(spy).not.toHaveBeenCalled()
  })
})
