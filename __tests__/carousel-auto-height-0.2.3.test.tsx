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
* @name: AbCarousel autoHeight (0.2.3)
* @file: __tests__/carousel-auto-height-0.2.3.test.tsx
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
import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { AbCarousel, AbCarouselNext, AbCarouselSlide, AbCarouselTrack } from '../ab-carousel'

afterEach(() => cleanup())
const css = readFileSync(join(__dirname, '..', 'ab-carousel/styles.module.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '') // 🧹

// 📐 happy-dom has no layout: give slide i a height of (i + 1) * 100px
const HEIGHTS = [100, 300, 200]
const stub = () => {
  const proto = HTMLElement.prototype as unknown as { getBoundingClientRect: () => DOMRect }
  const orig = proto.getBoundingClientRect
  proto.getBoundingClientRect = function (this: HTMLElement) { // 📏
    const i = this.id?.match(/-slide-(\d+)$/)?.[1]
    return { height: i == null ? 0 : HEIGHTS[Number(i)], width: 0, top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, toJSON: () => ({}) } as DOMRect
  }
  return () => { proto.getBoundingClientRect = orig }
}
const Demo = ({ autoHeight, reducedMotion }: { autoHeight?: boolean; reducedMotion?: 'always' | 'never' }) => (
  <AbCarousel label="Intro" autoHeight={autoHeight} reducedMotion={reducedMotion}>
    <AbCarouselTrack>{HEIGHTS.map((h) => <AbCarouselSlide key={h}><p>{h}</p></AbCarouselSlide>)}</AbCarouselTrack>
    <AbCarouselNext />
  </AbCarousel>
)
const track = () => document.querySelector<HTMLElement>('[data-ab-part="track"]')!

describe('📏 AbCarousel autoHeight (Joseph, Welcome 0.2.21)', () => {
  it('off by default: no inline height, no data-auto-height (tallest-slide grid, CLS 0)', () => {
    render(<Demo />)
    expect(track().style.height).toBe('') // 🧱
    expect(track().hasAttribute('data-auto-height')).toBe(false)
  })
  it('on: the track takes the active slide\'s height and follows it to the next slide', () => {
    const undo = stub()
    try {
      render(<Demo autoHeight reducedMotion="never" />)
      expect(track().getAttribute('data-auto-height')).toBe('true') // 📏
      expect(track().style.height).toBe('100px') // 1️⃣
      act(() => { fireEvent.click(document.querySelector('[data-ab-part="next"]')!) }) // ⏭️
      expect(track().style.height).toBe('300px') // 2️⃣
      expect(track().classList.contains('ab-motion-size')).toBe(true) // 🎞️ animated by ab-nextjs-animations
    } finally { undo() }
  })
  it('reduced motion: the region carries data-ab-reduced-motion, which turns .ab-motion-size off', () => {
    render(<Demo autoHeight reducedMotion="always" />)
    expect(track().closest('[data-ab-reduced-motion="true"]')).not.toBeNull() // ♿ prop
    const anim = readFileSync(require.resolve('ab-nextjs-animations/motion/styles.css'), 'utf8') // 🎬
    expect(anim).toMatch(/\[data-ab-reduced-motion='true'\] \.ab-motion-size \{\s*transition: none;/) // ♿ prop
    expect(anim).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*\.ab-motion-size \{\s*transition: none;/) // ♿ OS
  })
  it('CSS: top-aligned, clipped slides timed with the carousel tokens, and no local transition', () => {
    expect(css).toMatch(/\.track\[data-auto-height='true'\] \{[^}]*overflow: hidden;[^}]*align-items: start;[^}]*--ab-motion-duration: var\(--ab-carousel-duration, 280ms\);/) // 🎞️
    expect(css).not.toMatch(/(transition|animation)[a-z-]*\s*:/) // 🎬 motion only from ab-nextjs-animations
  })
})
