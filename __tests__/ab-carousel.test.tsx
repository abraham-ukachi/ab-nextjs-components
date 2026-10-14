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
* @name: AbCarousel - Tests (G31)
* @file: __tests__/ab-carousel.test.tsx
* @type: Vitest (happy-dom)
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
// 🖼️ DOM renderer + helpers
import { act, cleanup, fireEvent, render } from '@testing-library/react'
// 🖨️ server renderer (SSR / no-JS markup)
import { renderToString } from 'react-dom/server'
// 📄 read the shipped stylesheet
import { readFileSync } from 'node:fs'
// 🗺️ paths
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
// 🎠 component under test
import {
  AbCarousel,
  AbCarouselCounter,
  AbCarouselDots,
  AbCarouselNext,
  AbCarouselPrev,
  AbCarouselSlide,
  AbCarouselTrack,
  useAbCarousel,
  type AbCarouselProps,
} from '../ab-carousel'
// 🧮 server-safe helpers
import {
  AB_CAROUSEL_NOSCRIPT_CSS,
  clampAbCarouselIndex,
  getAbCarouselKeyAction,
  getAbCarouselSlidePosition,
} from '../ab-carousel/helpers'

// 📁 package root + CSS text
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(join(root, 'ab-carousel/styles.module.css'), 'utf8')

// 🧹 unmount between tests
afterEach(() => cleanup())

// ⏭️ custom control using the hook (like the Welcome "Skip" link → last slide)
function Skip() {
  const { goTo, count } = useAbCarousel() // 🪝
  return <button type="button" onClick={() => goTo(count - 1, 'skip')}>Skip</button>
}

// 🧪 a 3-slide fixture with every part
function Fixture(props: Partial<AbCarouselProps>) {
  return (
    <AbCarousel label="Intro" titles={['Welcome', 'Core', 'Get started']} {...props}>
      <AbCarouselCounter />
      <Skip />
      {/* 🎞️ wrapped in a <main> on purpose: the slide count is still discovered */}
      <main>
        <AbCarouselTrack>
          <AbCarouselSlide><h2>Welcome</h2><a href="#a">link a</a></AbCarouselSlide>
          <AbCarouselSlide><h2>Core</h2><div role="tablist"><button type="button">pnpm</button></div></AbCarouselSlide>
          <AbCarouselSlide><h2>Get started</h2></AbCarouselSlide>
        </AbCarouselTrack>
      </main>
      <footer>
        <AbCarouselDots />
        <AbCarouselPrev label="Diapositive précédente" />
        <AbCarouselNext label="Diapositive suivante" />
      </footer>
    </AbCarousel>
  )
}

// 🔎 tiny query helpers
const slides = (c: HTMLElement) => Array.from(c.querySelectorAll('[data-ab-part="slide"]')) as HTMLElement[]
const activeTitle = (c: HTMLElement) => c.querySelector('[data-ab-part="slide"][data-active="true"] h2')?.textContent
const status = (c: HTMLElement) => c.querySelector('[data-ab-part="status"]')?.textContent

describe('AbCarousel helpers', () => {
  it('clamps and wraps indexes', () => {
    expect(clampAbCarouselIndex(-1, 9)).toBe(0) // ✂️
    expect(clampAbCarouselIndex(12, 9)).toBe(8) // ✂️
    expect(clampAbCarouselIndex(-1, 9, true)).toBe(8) // 🔁
    expect(clampAbCarouselIndex(9, 9, true)).toBe(0) // 🔁
    expect(clampAbCarouselIndex(Number.NaN, 9)).toBe(0) // 🧯
    expect(clampAbCarouselIndex(3, 0)).toBe(0) // 🚫 empty
  })
  it('maps keys, flipping arrows in RTL', () => {
    expect(getAbCarouselKeyAction('ArrowRight', 'ltr')).toBe('next') // ➡️
    expect(getAbCarouselKeyAction('ArrowLeft', 'ltr')).toBe('prev') // ⬅️
    expect(getAbCarouselKeyAction('ArrowRight', 'rtl')).toBe('prev') // 🌍
    expect(getAbCarouselKeyAction('ArrowLeft', 'rtl')).toBe('next') // 🌍
    expect(getAbCarouselKeyAction('Home')).toBe('first') // ⏮️
    expect(getAbCarouselKeyAction('End')).toBe('last') // ⏭️
    expect(getAbCarouselKeyAction('Enter')).toBeNull() // 🙅
  })
  it('positions slides around the active one', () => {
    expect([0, 1, 2].map((i) => getAbCarouselSlidePosition(i, 1))).toEqual(['before', 'active', 'after']) // 📍
  })
})

describe('AbCarousel SSR / no-JS', () => {
  it('renders the APG carousel semantics without inert (no-JS stays usable)', () => {
    const html = renderToString(<Fixture />) // 🖨️
    expect(html).toContain('aria-roledescription="carousel"') // ♿ region
    expect(html).toContain('aria-label="Intro"') // 🏷️
    expect(html.match(/aria-roledescription="slide"/g)).toHaveLength(3) // ♿ 3 slides
    expect(html).toContain('aria-label="1 of 3"') // 🏷️ default slide label
    expect(html).not.toContain('inert') // 📜 no-JS: nothing inert on the server
    expect(html.replace(/<!-- -->/g, '')).toContain('<b>01</b> / 03') // 🔢 counter (React SSR adds text separators)
  })
  it('ships a noscript stylesheet that stacks slides and hides controls', () => {
    expect(AB_CAROUSEL_NOSCRIPT_CSS).toContain('[data-ab-part="slide"]') // 📚
    expect(AB_CAROUSEL_NOSCRIPT_CSS).toContain('[data-ab-part="dots"]') // 🙈
  })
})

describe('AbCarousel (uncontrolled)', () => {
  it('next / prev buttons move, with custom i18n labels and edge aria-disabled', () => {
    const { container, getByLabelText } = render(<Fixture />) // 🖼️
    const prev = getByLabelText('Diapositive précédente') // ⏮️ custom label
    const next = getByLabelText('Diapositive suivante') // ⏭️ custom label
    expect(prev.getAttribute('aria-disabled')).toBe('true') // 🚦 first slide
    expect(prev.getAttribute('title')).toBe('Diapositive précédente') // 💬 tooltip = label
    fireEvent.click(prev) // 🙅 no-op
    expect(activeTitle(container)).toBe('Welcome') // ✅ unchanged
    fireEvent.click(next) // ⏭️
    expect(activeTitle(container)).toBe('Core') // ✅
    expect(prev.getAttribute('aria-disabled')).toBeNull() // 🚦 enabled now
    fireEvent.click(next) // ⏭️ last
    expect(next.getAttribute('aria-disabled')).toBe('true') // 🚦 end (loop=false)
  })

  it('makes inactive slides inert + aria-hidden after hydration', () => {
    const { container } = render(<Fixture />) // 🖼️
    const [a, b] = slides(container) // 🎞️
    expect(a.hasAttribute('inert')).toBe(false) // ✅ active
    expect(b.hasAttribute('inert')).toBe(true) // 🚫 inactive
    expect(b.getAttribute('aria-hidden')).toBe('true') // 🙈
  })

  it('announces changes politely, but not on first load', () => {
    const { container, getByLabelText } = render(<Fixture />) // 🖼️
    expect(status(container)).toBe('') // 🤫 first load
    fireEvent.click(getByLabelText('Diapositive suivante')) // ⏭️
    expect(status(container)).toBe('Slide 2 of 3: Core') // 📣
    expect(container.querySelector('[data-ab-part="status"]')?.getAttribute('aria-live')).toBe('polite') // ♿
  })

  it('dots jump, mark aria-current="step" and point at their slide', () => {
    const { container, getByLabelText } = render(<Fixture />) // 🖼️
    const dot3 = getByLabelText('Go to slide 3: Get started') // 🔘
    fireEvent.click(dot3) // 🎯
    expect(activeTitle(container)).toBe('Get started') // ✅
    expect(dot3.getAttribute('aria-current')).toBe('step') // 📍
    expect(container.querySelector('[data-ab-part="dots"]')?.getAttribute('role')).toBe('group') // ♿ not a tablist
    expect(document.getElementById(dot3.getAttribute('aria-controls')!)).toBe(slides(container)[2]) // 🔗
  })

  it('custom controls via useAbCarousel (Skip → last slide, reason "skip")', () => {
    const onIndexChange = vi.fn() // 📣
    const { container, getByText } = render(<Fixture onIndexChange={onIndexChange} />) // 🖼️
    fireEvent.click(getByText('Skip')) // ⏭️⏭️
    expect(activeTitle(container)).toBe('Get started') // ✅
    expect(onIndexChange).toHaveBeenCalledWith(2, { reason: 'skip', from: 0 }) // 🎯 app focuses the s09 h1 on this
  })

  it('loops when asked', () => {
    const { container, getByLabelText } = render(<Fixture loop />) // 🔁
    fireEvent.click(getByLabelText('Diapositive précédente')) // ⏮️ from first
    expect(activeTitle(container)).toBe('Get started') // ✅ wrapped
  })
})

describe('AbCarousel (controlled)', () => {
  it('reports the requested index and waits for the parent', () => {
    const onIndexChange = vi.fn() // 📣
    const view = render(<Fixture index={0} onIndexChange={onIndexChange} />) // 🎛️
    fireEvent.click(view.getByLabelText('Diapositive suivante')) // ⏭️
    expect(onIndexChange).toHaveBeenCalledWith(1, { reason: 'next', from: 0 }) // 📣
    expect(activeTitle(view.container)).toBe('Welcome') // ⏸️ parent hasn't updated yet
    view.rerender(<Fixture index={1} onIndexChange={onIndexChange} />) // 🔁 parent updates (e.g. ?s=2)
    expect(activeTitle(view.container)).toBe('Core') // ✅
  })
  it('clamps an out-of-range controlled index', () => {
    const { container } = render(<Fixture index={42} />) // 🎛️
    expect(activeTitle(container)).toBe('Get started') // ✂️
  })
})

describe('AbCarousel keyboard', () => {
  it('←/→ + Home/End while focus is inside; RTL flips arrows', () => {
    const { container } = render(<Fixture />) // 🖼️
    const region = container.querySelector('[data-ab-part="carousel"]') as HTMLElement // 🎠
    fireEvent.keyDown(region, { key: 'ArrowRight' }) // ➡️
    expect(activeTitle(container)).toBe('Core') // ✅
    fireEvent.keyDown(region, { key: 'End' }) // ⏭️⏭️
    expect(activeTitle(container)).toBe('Get started') // ✅
    fireEvent.keyDown(region, { key: 'Home' }) // ⏮️⏮️
    expect(activeTitle(container)).toBe('Welcome') // ✅
    cleanup() // 🧹
    const rtl = render(<Fixture dir="rtl" />) // 🌍
    const rtlRegion = rtl.container.querySelector('[data-ab-part="carousel"]') as HTMLElement
    fireEvent.keyDown(rtlRegion, { key: 'ArrowLeft' }) // ⬅️ = next in RTL
    expect(activeTitle(rtl.container)).toBe('Core') // ✅
  })
  it('leaves arrows alone inside tablists and ignores modifier shortcuts', () => {
    const onIndexChange = vi.fn() // 📣
    const { container } = render(<Fixture defaultIndex={1} onIndexChange={onIndexChange} />) // 🖼️ slide with the install-box tablist
    fireEvent.keyDown(container.querySelector('[role="tablist"] button')!, { key: 'ArrowRight' }) // 🗂️ roving focus owns it
    fireEvent.keyDown(container.querySelector('[data-ab-part="carousel"]')!, { key: 'ArrowRight', altKey: true }) // ⌥ shortcut
    expect(onIndexChange).not.toHaveBeenCalled() // ✅ untouched
    expect(activeTitle(container)).toBe('Core') // ✅ still slide 2
  })
})

describe('AbCarousel swipe + motion', () => {
  it('a left touch swipe on the track goes to the next slide', () => {
    const { container } = render(<Fixture />) // 🖼️
    const track = container.querySelector('[data-ab-part="track"]') as HTMLElement // 🎞️
    const base = { pointerId: 7, isPrimary: true, pointerType: 'touch', bubbles: true } // 👆
    act(() => {
      track.dispatchEvent(new PointerEvent('pointerdown', { ...base, clientX: 300, clientY: 100 })) // 👇
      track.dispatchEvent(new PointerEvent('pointermove', { ...base, clientX: 200, clientY: 102 })) // 👈
      track.dispatchEvent(new PointerEvent('pointerup', { ...base, clientX: 180, clientY: 102 })) // 👆
    })
    expect(activeTitle(container)).toBe('Core') // ✅
  })
  it('reducedMotion="always" flags the region; CSS honours the OS setting too', () => {
    const { container } = render(<Fixture reducedMotion="always" />) // ♿
    const region = container.querySelector('[data-ab-part="carousel"]') // 🎠
    expect(region?.getAttribute('data-reduced-motion')).toBe('true') // ✅
    expect(region?.getAttribute('data-ab-reduced-motion')).toBe('true') // ♿ ab-nextjs-animations switch (OS setting is handled there too)
    expect(css.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/(transition|animation)[a-z-]*\s*:|@keyframes/) // ✂️ comments stripped // 🎬 no local motion: it all comes from ab-nextjs-animations
    expect(css).toContain("touch-action: pan-y") // 👆 vertical scroll preserved
  })
  it('throws a helpful error when a part is used outside <AbCarousel>', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {}) // 🤫 React logs the throw
    expect(() => render(<AbCarouselDots />)).toThrow(/inside <AbCarousel>/) // 💥
  })
})
