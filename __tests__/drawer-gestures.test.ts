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
* @name: AbDrawer gestures tests
* @file: __tests__/drawer-gestures.test.ts
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
import { describe, expect, it } from 'vitest'
import { AB_SWIPE, createAbVelocityTracker, isInAbEdgeZone, isInAbHorizontalScroller, resolveAbSheetRelease, resolveAbSideRelease } from '../ab-drawer/gestures'

// 📏 the 390×844 mock: S1 = 70% = 591px, S2 = 844 − 47 = 797px
const S = { partialHeight: 591, fullHeight: 797 }

describe('resolveAbSheetRelease (spec §1 gestures) 🧲', () => {
  it('S1 ⬆️ past 30% of S1→S2 (62px) or faster than 0.5px/ms → full; less springs back', () => {
    expect(resolveAbSheetRelease({ from: 'partial', dy: -70, velocity: -0.1, ...S })).toBe('full') // 📏 70 > 61.8
    expect(resolveAbSheetRelease({ from: 'partial', dy: -20, velocity: -0.8, ...S })).toBe('full') // ⚡ flick
    expect(resolveAbSheetRelease({ from: 'partial', dy: -40, velocity: -0.2, ...S })).toBe('partial') // 🧲
  })
  it('S2 ⬇️ gentle → partial; fast or past 30% of the sheet → closed', () => {
    expect(resolveAbSheetRelease({ from: 'full', dy: 120, velocity: 0.2, ...S })).toBe('partial') // 🫳 God: a gentle swipe returns to 70%
    expect(resolveAbSheetRelease({ from: 'full', dy: 60, velocity: 0.9, ...S })).toBe('closed') // 💨 hard swipe
    expect(resolveAbSheetRelease({ from: 'full', dy: 260, velocity: 0.2, ...S })).toBe('closed') // 📏 260 > 239
    expect(resolveAbSheetRelease({ from: 'full', dy: 3, velocity: 0, ...S })).toBe('full') // 🫥 jitter
  })
  it('S1 ⬇️ fast or past 30% of S1 → closed; a short gentle drag springs back', () => {
    expect(resolveAbSheetRelease({ from: 'partial', dy: 40, velocity: 0.7, ...S })).toBe('closed') // 💨
    expect(resolveAbSheetRelease({ from: 'partial', dy: 190, velocity: 0.1, ...S })).toBe('closed') // 📏 190 > 177
    expect(resolveAbSheetRelease({ from: 'partial', dy: 60, velocity: 0.1, ...S })).toBe('partial') // 🧲
  })
  it('the second swipe: after a gentle S2 → S1 return, a gentle swipe down (≥ 24px) closes', () => {
    expect(resolveAbSheetRelease({ from: 'partial', dy: 60, velocity: 0.1, returned: true, ...S })).toBe('closed') // ✌️
    expect(resolveAbSheetRelease({ from: 'partial', dy: 10, velocity: 0.1, returned: true, ...S })).toBe('partial') // 🫳 too short
  })
  it('the spec numbers', () => {
    expect(AB_SWIPE).toMatchObject({ ratio: 0.3, velocity: 0.5, edge: 24, standaloneInset: 16 }) // 🎚️
  })
})

describe('resolveAbSideRelease (spec §2 / §3) ↔️', () => {
  it('past 30% of 320 (96px) or ≥ 0.5px/ms commits; slower and shorter snaps back', () => {
    expect(resolveAbSideRelease({ distance: 100, velocity: 0.2, width: 320 })).toBe(true) // 📏
    expect(resolveAbSideRelease({ distance: 40, velocity: 0.6, width: 320 })).toBe(true) // ⚡
    expect(resolveAbSideRelease({ distance: 90, velocity: 0.2, width: 320 })).toBe(false) // 🧲
    expect(resolveAbSideRelease({ distance: -200, velocity: 2, width: 320 })).toBe(false) // 🚫 wrong way
  })
})

describe('isInAbEdgeZone 🧱', () => {
  const box = { left: 0, right: 390 }
  it('24px from each edge; 16px in on iOS standalone', () => {
    expect(isInAbEdgeZone(10, 'left', box)).toBe(true) // ⬅️
    expect(isInAbEdgeZone(30, 'left', box)).toBe(false) // 🚫
    expect(isInAbEdgeZone(380, 'right', box)).toBe(true) // ➡️
    expect(isInAbEdgeZone(10, 'left', box, true)).toBe(false) // 📱 the system edge
    expect(isInAbEdgeZone(30, 'left', box, true)).toBe(true) // 📱 16..40
  })
})

describe('createAbVelocityTracker ⚡', () => {
  it('px/ms over the last 100ms', () => {
    const v = createAbVelocityTracker()
    v.add(0, 0); v.add(10, 50); v.add(60, 100) // 📍
    expect(v.velocity()).toBeCloseTo(0.6) // ⚡ 60px / 100ms
    v.add(70, 400) // ⏱️ old samples drop out
    expect(v.velocity()).toBe(0) // 🫥 one sample left
  })
})

describe('isInAbHorizontalScroller 🎠', () => {
  it('true inside [data-ab-no-edge-swipe]; false in plain flow', () => {
    document.body.innerHTML = '<div data-ab-no-edge-swipe><pre id="a">x</pre></div><p id="b">y</p>'
    expect(isInAbHorizontalScroller(document.getElementById('a'))).toBe(true) // 🙅
    expect(isInAbHorizontalScroller(document.getElementById('b'))).toBe(false) // ✅
  })
})
