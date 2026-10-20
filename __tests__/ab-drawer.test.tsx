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
* @name: AbDrawer + useAbDrawer (G53) - Tests
* @file: __tests__/ab-drawer.test.tsx
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
// 🖼️ renderers
import { act, cleanup, fireEvent, render, renderHook } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { useState } from 'react'
// 🗄️ under test
import AbDrawer, { AB_DRAWER_DURATION, getAbDrawerHost, useAbDrawer, type AbDrawerScope, type AbDrawerSide } from '../ab-drawer'

const root = join(dirname(fileURLToPath(import.meta.url)), '..') // 📁
const read = (rel: string) => readFileSync(join(root, rel), 'utf8') // 📄
// ⏱️ rAF + timers under our control
beforeEach(() => { vi.useFakeTimers(); vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0)); vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id)) })
afterEach(() => { cleanup(); vi.useRealTimers(); vi.unstubAllGlobals(); document.body.innerHTML = '' })
const flush = () => act(() => { vi.advanceTimersByTime(AB_DRAWER_DURATION + 50) }) // 🎞️ past the slide

// 🧱 a fake core panes shell: app box > main pane (main-content scroller) + aside pane
function Shell({ scope = 'main', side = 'end', modal = true }: { scope?: AbDrawerScope; side?: AbDrawerSide; modal?: boolean }) {
  const d = useAbDrawer(scope)
  const [log, setLog] = useState('')
  return (
    <div className="AbAppLayout">
      <main data-ab-part="main">
        <div data-ab-part="main-content">
          <button {...d.triggerProps} id="opener">Open</button>
          <AbDrawer {...d.drawerProps} side={side} modal={modal} title="Filters" footer={<button id="last">Apply</button>}>
            <button id="first">One</button>
            <span data-log={log} onClick={() => setLog('x')} />
          </AbDrawer>
        </div>
      </main>
      <aside data-ab-part="aside"><button id="aside-btn">Aside</button></aside>
    </div>
  )
}

describe('useAbDrawer 🎛️', () => {
  it('starts closed, toggles, and gives trigger + drawer prop bags', () => {
    const { result } = renderHook(() => useAbDrawer('aside'))
    expect(result.current.open).toBe(false) // 🚪
    expect(result.current.triggerProps['aria-expanded']).toBe(false) // ♿
    expect(result.current.triggerProps['aria-controls']).toBe(result.current.id) // 🔗
    expect(result.current.triggerProps['aria-haspopup']).toBe('dialog') // ♿
    expect(result.current.drawerProps.scope).toBe('aside') // 🗺️
    act(() => result.current.triggerProps.onClick()) // 🔁
    expect(result.current.open).toBe(true)
    act(() => result.current.close())
    expect(result.current.open).toBe(false)
  })
})

describe('AbDrawer 🗄️', () => {
  it('SSR / no JS (D41): renders the content in flow as a labelled section, no dialog', () => {
    const html = renderToStaticMarkup(<AbDrawer open={false} onClose={() => {}} title="Language"><p>English</p></AbDrawer>)
    expect(html).toContain('data-ab-part="drawer-fallback"') // 🧩 in-flow section
    expect(html).toMatch(/<section[^>]*aria-labelledby="ab-drawer-[^"]+-title"/) // ♿ labelled
    expect(html).toContain('<p>English</p>') // 📄 nothing hides behind JS
    expect(html).not.toContain('role="dialog"') // 🚫 no dialog on the server
    expect(renderToStaticMarkup(<AbDrawer open onClose={() => {}} noJsFallback={false} aria-label="x"><p>y</p></AbDrawer>)).not.toContain('<p>y</p>') // 🙅 opt-out
    expect(read('ab-drawer/styles.module.css')).toMatch(/@media \(scripting: enabled\) \{\s*\.abDrawerFallback \{ display: none; \}/) // 🫥 hidden once JS runs
  })

  it('on the client it portals into the scope box layer, never into the scroller', () => {
    render(<Shell scope="main" />)
    const layer = document.querySelector('[data-ab-drawer-layer="main"]')!
    expect(layer.parentElement).toBe(document.querySelector('[data-ab-part="main"]')) // 📄 the pane, not main-content
    expect(document.querySelector('[data-ab-part="drawer-fallback"]')).toBeNull() // 🧩 fallback gone after hydration
    expect(getAbDrawerHost('aside')).toBe(document.querySelector('[data-ab-part="aside"]')) // 🗺️
    expect(getAbDrawerHost('app')).toBe(document.querySelector('.AbAppLayout')) // 🏠
  })

  it('opens labelled + modal, focuses the first control, traps Tab, Escape closes and focus returns', async () => {
    render(<Shell scope="main" />)
    const opener = document.getElementById('opener')!
    opener.focus()
    fireEvent.click(opener); flush()
    const dialog = document.querySelector('[role="dialog"]')!
    expect(dialog.getAttribute('aria-modal')).toBe('true') // ♿
    expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)?.textContent).toBe('Filters') // 🏷️
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Close') // 🎯 first control = the ✕
    expect(document.querySelector('[data-ab-part="drawer-scrim"]')?.closest('[data-state]')?.getAttribute('data-state')).toBe('open') // 🛬
    ;(document.getElementById('last') as HTMLElement).focus()
    fireEvent.keyDown(document, { key: 'Tab' }) // ➡️ wraps
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Close')
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true }) // ⬅️ wraps
    expect(document.activeElement?.id).toBe('last')
    fireEvent.keyDown(document, { key: 'Escape' }); flush(); await act(async () => {}) // ⎋ + the restore microtask
    expect(document.querySelector('[role="dialog"]')).toBeNull() // 🚪 unmounted after the slide
    expect(document.activeElement).toBe(opener) // ↩️ focus restored
  })

  it('a scrim click closes; Escape an inner widget already handled is ignored', () => {
    render(<Shell scope="aside" side="bottom" />)
    fireEvent.click(document.getElementById('opener')!); flush()
    const ev = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }); ev.preventDefault()
    act(() => { document.dispatchEvent(ev) })
    expect(document.querySelector('[role="dialog"]')).not.toBeNull() // 🙅 handled elsewhere
    fireEvent.click(document.querySelector('[data-ab-part="drawer-scrim"]')!); flush() // 🌫️
    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it('makes only the rest of its scope inert, and undoes it on close', () => {
    render(<Shell scope="main" />)
    fireEvent.click(document.getElementById('opener')!); flush()
    expect(document.querySelector('[data-ab-part="main-content"]')!.hasAttribute('inert')).toBe(true) // 🧊 main siblings
    expect(document.querySelector('[data-ab-part="aside"]')!.hasAttribute('inert')).toBe(false) // 🙅 not the aside
    fireEvent.keyDown(document, { key: 'Escape' }); flush()
    expect(document.querySelector('[data-ab-part="main-content"]')!.hasAttribute('inert')).toBe(false) // 🔓
  })

  it('modal={false} skips the inert scope and the trap', () => {
    render(<Shell scope="main" modal={false} />)
    fireEvent.click(document.getElementById('opener')!); flush()
    expect(document.querySelector('[role="dialog"]')!.hasAttribute('aria-modal')).toBe(false) // ♿
    expect(document.querySelector('[data-ab-part="main-content"]')!.hasAttribute('inert')).toBe(false) // 🔓
  })

  it('every side has a slide; 240ms, none under reduced motion; the body scrolls on its own', () => {
    const css = read('ab-drawer/styles.module.css')
    for (const side of ['top', 'bottom', 'left', 'right', 'start', 'end']) expect(css, side).toMatch(new RegExp(`\\.abDrawer\\[data-side='${side}'\\] \\{[^}]*transform:`)) // 🧭
    expect(css).toMatch(/\.abDrawer \{[^}]*--ab-motion-duration: var\(--ab-drawer-duration, 240ms\);/) // 🎞️ via ab-nextjs-animations
    const tsx = read('ab-drawer/index.tsx')
    expect(tsx).toContain("import 'ab-nextjs-animations/motion/styles.css';") // ♿ its reduced-motion rule snaps the slide
    expect(tsx).toMatch(/styles\.abDrawer, AB_MOTION\.transform/); expect(tsx).toMatch(/styles\.abDrawerScrim, AB_MOTION\.colors/) // 🎬
    expect(css).toMatch(/\.abDrawerLayer \{[^}]*position: absolute;[^}]*inset: 0;[^}]*overflow: hidden;/) // ✂️ clipped by the scope
    expect(css).toMatch(/\.abDrawerBody \{[^}]*overflow: hidden auto; overscroll-behavior: contain;/) // 📜
    expect(AB_DRAWER_DURATION).toBe(240) // ⏱️ = the panes slide
  })

  it('without a layout it covers the viewport from <body> (fixed layer)', () => {
    render(<AbDrawer open={false} onClose={() => {}} aria-label="x" />)
    expect(document.querySelector('[data-ab-drawer-layer="app"]')?.getAttribute('data-host')).toBe('body') // 📌
  })

  it('Escape closes only the topmost drawer when two are open (stack)', () => {
    function Two() {
      const a = useAbDrawer('app'); const b = useAbDrawer('app')
      return (
        <div className="AbAppLayout">
          <button id="open-a" {...a.triggerProps}>A</button>
          <AbDrawer {...a.drawerProps} title="Outer"><button id="open-b" {...b.triggerProps}>B</button></AbDrawer>
          <AbDrawer {...b.drawerProps} title="Inner"><button>in B</button></AbDrawer>
        </div>
      )
    }
    render(<Two />)
    fireEvent.click(document.getElementById('open-a')!); flush()
    fireEvent.click(document.getElementById('open-b')!); flush()
    const names = () => Array.from(document.querySelectorAll('[role="dialog"]')).map((d) => d.querySelector('h2')?.textContent)
    expect(names()).toEqual(['Outer', 'Inner']) // 🥞 both open
    fireEvent.keyDown(document, { key: 'Escape' }); flush()
    expect(names()).toEqual(['Outer']) // ⎋ only the top one
    fireEvent.keyDown(document, { key: 'Escape' }); flush()
    expect(names()).toEqual([]) // ⎋ then the next
  })
})
