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
* @name: AbContentTabs panel tab stop (0.6.0)
* @file: __tests__/content-tabs-panel-stop-0.6.0.test.tsx
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
// 🖼️ renderers
import { act, cleanup, render } from '@testing-library/react'
import { renderToStaticMarkup } from 'react-dom/server'
// 🗂️ the tabs
import AbContentTabs, { AbContentTab, AB_FOCUSABLE_SELECTOR } from '../ab-content-tabs'
import AbCodeBlock from '../ab-code-block'

afterEach(cleanup) // 🧹

const panels = (c: HTMLElement) => Array.from(c.querySelectorAll<HTMLElement>('[role="tabpanel"]')) // 📄
const flush = () => act(async () => { await new Promise((r) => setTimeout(r, 0)) }) // ⏳ MutationObserver callbacks

describe('⌨️ AbContentTabs panel tab stop', () => {
  it('SSR default: every panel is tabIndex 0 (no hydration mismatch, no-JS safe)', () => {
    const h = renderToStaticMarkup(<AbContentTabs label="L"><AbContentTab label="A"><button>x</button></AbContentTab><AbContentTab label="B">text</AbContentTab></AbContentTabs>) // 🖨️
    expect(h.match(/role="tabpanel"[^>]*tabindex="0"/g)).toHaveLength(2) // ✅
  })
  it('after mount: a panel with focusable content leaves the tab order; a text panel stays', () => {
    const { container } = render(<AbContentTabs label="L"><AbContentTab label="Code"><AbCodeBlock code="x" copy={false}><pre>x</pre></AbCodeBlock></AbContentTab><AbContentTab label="Text">just text</AbContentTab></AbContentTabs>) // 🖼️
    const [code, text] = panels(container) // 📄
    expect(code.hasAttribute('tabindex')).toBe(false) // 🙅 the code scroller is the stop
    expect(text.getAttribute('tabindex')).toBe('0') // ⌨️ still reachable
  })
  it('the ARIA wiring is unchanged', () => {
    const { container, getAllByRole } = render(<AbContentTabs label="L"><AbContentTab label="A"><a href="/x">x</a></AbContentTab><AbContentTab label="B">b</AbContentTab></AbContentTabs>) // 🖼️
    const tabs = getAllByRole('tab'); const ps = panels(container) // 🔗
    tabs.forEach((t, i) => { expect(t.getAttribute('aria-controls')).toBe(ps[i].id); expect(ps[i].getAttribute('aria-labelledby')).toBe(t.id) }) // ✅
    expect(ps[1].hidden).toBe(true) // 🙈
  })
  it('reacts to content changes (MutationObserver)', async () => {
    const { container } = render(<AbContentTabs label="L"><AbContentTab label="A"><div data-slot="" /></AbContentTab></AbContentTabs>) // 🖼️
    const p = panels(container)[0] // 📄
    expect(p.getAttribute('tabindex')).toBe('0') // ⌨️ empty
    const b = document.createElement('button'); p.querySelector('[data-slot]')!.appendChild(b) // ➕ a focusable arrives
    await flush() // ⏳
    expect(p.hasAttribute('tabindex')).toBe(false) // 🙅
    b.remove(); await flush() // ➖ gone again
    expect(p.getAttribute('tabindex')).toBe('0') // ⌨️ back
  })
  it('the selector: matches focusables, skips tabindex=-1 and plain anchors', () => {
    const d = document.createElement('div') // 🧪
    const ok = ['<a href="#">a</a>', '<button></button>', '<input>', '<select></select>', '<textarea></textarea>', '<div tabindex="0"></div>', '<div contenteditable="true"></div>', '<details><summary>s</summary></details>'] // ✅
    for (const h of ok) { d.innerHTML = h; expect(d.querySelector(AB_FOCUSABLE_SELECTOR), h).not.toBeNull() }
    for (const h of ['<div tabindex="-1"></div>', '<a>no href</a>', '<pre tabindex="-1">x</pre>', '<span>t</span>']) { d.innerHTML = h; expect(d.querySelector(AB_FOCUSABLE_SELECTOR), h).toBeNull() } // 🙅
  })
})
