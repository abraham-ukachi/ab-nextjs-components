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
* @name: AbCarousel headless mode (0.2.3)
* @file: __tests__/carousel-headless-0.2.3.test.tsx
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
import { renderToString } from 'react-dom/server'
import {
  AbCarousel,
  AbCarouselCounter,
  AbCarouselNext,
  AbCarouselProvider,
  AbCarouselSlide,
  AbCarouselStatus,
  AbCarouselTrack,
  useAbCarouselRegion,
} from '../ab-carousel'

afterEach(() => cleanup())

// 🧱 Joseph's Welcome shape: the counter lives in the header, the track in <main>, the provider above both
function Slides() {
  const region = useAbCarouselRegion() // 🧷
  return (
    <div {...region} className={`${region.className} my-slides`} id="region">
      <AbCarouselTrack>{['A', 'B', 'C'].map((t) => <AbCarouselSlide key={t}><h2>{t}</h2></AbCarouselSlide>)}</AbCarouselTrack>
      <AbCarouselStatus />
    </div>
  )
}
const App = () => (
  <AbCarouselProvider label="Welcome" count={3} titles={['A', 'B', 'C']}>
    <header id="hdr"><AbCarouselCounter /><AbCarouselNext /></header>
    <main id="main"><Slides /></main>
  </AbCarouselProvider>
)

describe('🧠 AbCarouselProvider: headless mode (Joseph, Welcome 0.2.21)', () => {
  it('renders no wrapper: <main> is not inside a carousel element', () => {
    const { container } = render(<App />)
    expect(container.firstElementChild?.id).toBe('hdr') // 🫥 no <section> around everything
    expect(document.getElementById('main')!.closest('[data-ab-part="carousel"]')).toBeNull() // ✅ main is free
  })
  it('the consumer element becomes the region (roledescription, label, data-*, own class kept)', () => {
    render(<App />)
    const region = document.getElementById('region')!
    expect(region.getAttribute('aria-roledescription')).toBe('carousel') // ♿
    expect(region.getAttribute('aria-label')).toBe('Welcome') // 🏷️
    expect(region.getAttribute('data-ab-part')).toBe('carousel') // 🧩
    expect(region.className).toMatch(/AbCarousel/); expect(region.className).toMatch(/my-slides/) // 🏷️
  })
  it('controls outside the region drive the track, and the status announces it', () => {
    render(<App />)
    act(() => { fireEvent.click(document.querySelector('#hdr [data-ab-part="next"]')!) }) // ⏭️ from the header
    expect(document.querySelector('[data-ab-part="slide"][data-active="true"] h2')?.textContent).toBe('B') // ✅
    expect(document.querySelector('#hdr [data-ab-part="counter"]')?.textContent).toBe('02 / 03') // 🔢
    expect(document.querySelector('#region [data-ab-part="status"]')?.textContent).toMatch(/2 of 3/) // 📣
  })
  it('keyboard: arrows inside the consumer region move the slides', () => {
    render(<App />)
    act(() => { fireEvent.keyDown(document.querySelector('[data-ab-part="slide"][data-active="true"] h2')!, { key: 'ArrowRight' }) }) // ⌨️
    expect(document.querySelector('[data-ab-part="slide"][data-active="true"] h2')?.textContent).toBe('B')
  })
  it('SSR works (no element of its own), and the hooks explain misuse', () => {
    expect(renderToString(<App />)).toMatch(/aria-roledescription="carousel"/) // 🖨️
    const Bad = () => { useAbCarouselRegion(); return null }
    expect(() => render(<Bad />)).toThrow(/useAbCarouselRegion\(\) must be used inside <AbCarouselProvider>/) // 💥
  })
  it('<AbCarousel> is unchanged: it still renders its own region with the live status', () => {
    const { container } = render(<AbCarousel label="X"><AbCarouselTrack><AbCarouselSlide>1</AbCarouselSlide></AbCarouselTrack></AbCarousel>)
    const el = container.firstElementChild!
    expect(el.tagName).toBe('SECTION'); expect(el.getAttribute('aria-label')).toBe('X') // 🎠
    expect(el.querySelector('[data-ab-part="status"]')).not.toBeNull() // 📣
  })
})
