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
* @name: AbDrawer Escape stack (G59)
* @file: __tests__/ab-drawer-escape-stack-g59.test.tsx
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
// 🖼️ renderer
import { act, cleanup, fireEvent, render } from '@testing-library/react'
// 🗄️ under test
import AbDrawer, { AB_DRAWER_DURATION, useAbDrawer, type AbDrawerScope } from '../ab-drawer'

// ⏱️ rAF + timers under our control (same harness as ab-drawer.test.tsx)
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = () => act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) }) // 🎞️ past the slide
const escape = async () => { fireEvent.keyDown(document, { key: 'Escape' }); flush(); await act(async () => {}) } // ⎋ + the focus-restore microtask
const titles = () => Array.from(document.querySelectorAll('[role="dialog"]')).map((d) => d.querySelector('h2')?.textContent) // 🏷️ open drawers

/** 🥞 two stacked drawers: B is opened from inside A; `bScope` lets B live in another scope (app over aside, …) */
function Stacked({ aScope = 'app', bScope = 'app' }: { aScope?: AbDrawerScope; bScope?: AbDrawerScope }) {
  const a = useAbDrawer(aScope); const b = useAbDrawer(bScope)
  return (
    <div className="AbAppLayout">
      <main data-ab-part="main" />
      <aside data-ab-part="aside" />
      <button id="open-a" {...a.triggerProps}>A</button>
      <AbDrawer {...a.drawerProps} title="Bottom"><button id="open-b" {...b.triggerProps}>B</button></AbDrawer>
      <AbDrawer {...b.drawerProps} title="Top"><button>in top</button></AbDrawer>
    </div>
  )
}

describe('G59 ⎋ Escape closes only the topmost stacked drawer', () => {
  const scopes: Array<[AbDrawerScope, AbDrawerScope]> = [['app', 'app'], ['aside', 'app'], ['main', 'aside']]
  it.each(scopes)('%s under %s: first Escape closes the top only, focus returns to its trigger; second closes the bottom', async (aScope, bScope) => {
    render(<Stacked aScope={aScope} bScope={bScope} />)
    const openA = document.getElementById('open-a') as HTMLButtonElement
    openA.focus(); fireEvent.click(openA); flush(); await act(async () => {}) // 🚪 bottom
    const openB = document.getElementById('open-b') as HTMLButtonElement
    openB.focus(); fireEvent.click(openB); flush(); await act(async () => {}) // 🚪 top, opened from inside the bottom
    expect(titles()).toEqual(['Bottom', 'Top']) // 🥞 both open

    await escape() // ⎋ #1
    expect(titles()).toEqual(['Bottom']) // ✅ not both, and not the bottom one
    expect(openA.getAttribute('aria-expanded')).toBe('true') // 🚪 the bottom drawer is still open
    expect(document.activeElement).toBe(document.getElementById('open-b')) // ↩️ focus back on the top drawer's trigger

    await escape() // ⎋ #2
    expect(titles()).toEqual([]) // ✅ now the bottom one
    expect(document.activeElement).toBe(openA) // ↩️ focus back on the bottom drawer's trigger
  })

  it('an Escape an inner widget already handled closes nothing (even in a stack)', async () => {
    render(<Stacked />)
    fireEvent.click(document.getElementById('open-a')!); flush()
    fireEvent.click(document.getElementById('open-b')!); flush()
    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }); ev.preventDefault() // 🙅 handled upstream
    act(() => { document.dispatchEvent(ev) }); flush()
    expect(titles()).toEqual(['Bottom', 'Top']) // 🥞 untouched
  })
})
