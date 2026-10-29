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
* @name: useAbCarouselKeys (0.2.3)
* @file: __tests__/carousel-keys-0.2.3.test.tsx
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
import { useRef } from 'react'
import { AbCarouselProvider, AbCarouselSlide, AbCarouselTrack, useAbCarouselKeys, useAbCarouselRegion } from '../ab-carousel'

afterEach(() => cleanup())
const active = () => document.querySelector('[data-ab-part="slide"][data-active="true"]')?.textContent // ✅

function Region() {
  const r = useAbCarouselRegion() // 🧷
  return <div {...r} id="region"><button id="inside">in</button><AbCarouselTrack>{['A', 'B', 'C'].map((t) => <AbCarouselSlide key={t}>{t}</AbCarouselSlide>)}</AbCarouselTrack></div>
}
function Keys({ on, homeEnd, enabled }: { on: 'document' | 'main' | 'ref'; homeEnd?: boolean; enabled?: boolean }) {
  const main = useRef<HTMLElement>(null)
  useAbCarouselKeys(on === 'ref' ? main : on, { homeEnd, enabled }) // ⌨️
  return (
    <>
      <header><button id="hdr">menu</button><input id="field" /></header>
      <main ref={main} id="main"><button id="cta">go</button><Region /></main>
      <div role="dialog" aria-modal="true"><button id="dlg">x</button></div>
    </>
  )
}
function MainKeys() { useAbCarouselKeys('main'); return <main><button id="cta2">c</button><Region /></main> }
const App = (p: Parameters<typeof Keys>[0]) => <AbCarouselProvider label="W" count={3}><Keys {...p} /></AbCarouselProvider>
const key = (id: string, k: string, extra: Record<string, unknown> = {}) => act(() => { fireEvent.keyDown(document.getElementById(id)!, { key: k, ...extra }) })

describe('⌨️ useAbCarouselKeys (Joseph, Welcome 0.2.21)', () => {
  it('"document": arrows from the header move the slides', () => {
    render(<App on="document" />)
    key('hdr', 'ArrowRight'); expect(active()).toBe('B') // ⏭️
    key('hdr', 'ArrowLeft'); expect(active()).toBe('A') // ⏮️
  })
  it('"main" (recommended): listens on <main> only — no global hijack from the header', () => {
    render(<App on="main" />)
    key('hdr', 'ArrowRight'); expect(active()).toBe('A') // 🙅 outside <main>
    key('cta', 'ArrowRight'); expect(active()).toBe('B') // ✅ inside
  })
  it('"main" prefers core\'s [data-ab-part="main"] pane', () => {
    render(<AbCarouselProvider label="W" count={3}><div data-ab-part="main"><button id="pane">p</button></div><MainKeys /></AbCarouselProvider>)
    key('cta2', 'ArrowRight'); expect(active()).toBe('A') // 🙅 the plain <main> is not the scope
    key('pane', 'ArrowRight'); expect(active()).toBe('B') // ✅ core's pane
  })
  it('a ref: only while focus is inside that element', () => {
    render(<App on="ref" />)
    key('hdr', 'ArrowRight'); expect(active()).toBe('A') // 🙅 outside <main>
    key('cta', 'ArrowRight'); expect(active()).toBe('B') // ✅ inside
  })
  it('skips inputs, dialogs, modifiers and handled events', () => {
    render(<App on="document" />)
    key('field', 'ArrowRight'); key('dlg', 'ArrowRight'); key('hdr', 'ArrowRight', { shiftKey: true }) // 🙈
    expect(active()).toBe('A')
    const e = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }); e.preventDefault()
    act(() => { document.getElementById('hdr')!.dispatchEvent(e) }); expect(active()).toBe('A') // 🙅 handled
  })
  it('inside the region it moves ONE step (the region handles it, the hook stands back)', () => {
    render(<App on="document" />)
    key('inside', 'ArrowRight'); expect(active()).toBe('B') // ✅ not C
  })
  it('Home / End only with homeEnd; enabled={false} unbinds', () => {
    const { unmount } = render(<App on="document" />)
    key('hdr', 'End'); expect(active()).toBe('A') // 🙅 the page keeps End
    unmount()
    render(<App on="document" homeEnd />)
    key('hdr', 'End'); expect(active()).toBe('C') // ⏭️⏭️
    cleanup()
    render(<App on="document" enabled={false} />)
    key('hdr', 'ArrowRight'); expect(active()).toBe('A') // 🎚️ off
  })
})
